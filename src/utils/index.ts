import { mkdirSync, readdirSync, statSync } from "fs";
import { basename, dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import sftp from "ssh2-sftp-client";
import cliProgress from "cli-progress";
import logger from "./consola";
import { actionType } from "src/type";
import chalk from "chalk";
import { minimatch } from "minimatch";
export function getDirName() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return __dirname;
}

export function getFileName(path: string) {
  return basename(path);
}

export function getRelativePath(basePath: string, fullPath: string) {
  return relative(basePath, fullPath);
}

function padFileName(name: string, width: number): string {
  return name.length >= width ? name : name.padEnd(width, " ");
}
// 确保本地目录存在
function ensureLocalDir(dirPath: string) {
  try {
    mkdirSync(dirPath, { recursive: true });
  } catch (err: any) {
    if (err.code !== "EEXIST") throw err;
  }
}
/**
 * 上传或下载目录（支持数组方式排除文件）
 * @param sftpClient SFTP客户端
 * @param localDir 本地目录路径
 * @param remoteDir 远程目录路径
 * @param mode 'upload' 或 'download'
 * @param excludePatterns 要排除的文件/目录路径数组（可选）
 */
export async function transferDir(
  sftpClient: sftp,
  localDir: string,
  remoteDir: string,
  mode: actionType,
  excludePatterns?: string[] // 要排除的文件/目录路径数组
) {
  const isUpload = mode === actionType.upload;
  const files: { localPath: string; remotePath: string; size: number }[] = [];

  // 标准化路径以便比较
  const normalizePath = (path: string) => basename(path.replace(/\\/g, "/"));

  // 检查是否匹配排除模式
  const isExcluded = (path: string, isDirectory: boolean): boolean => {
    if (!excludePatterns || excludePatterns.length === 0) return false;
    const normalizedPathRes = normalizePath(path);
    // 使用 minimatch 检查是否匹配任何排除模式
    return excludePatterns.some((pattern) => {
      // 对于目录，需要特殊处理以确保正确匹配
      if (isDirectory) {
        // 匹配目录本身
        if (minimatch(normalizedPathRes, pattern)) {
          return true;
        }
        // 匹配目录内容（添加 /** 后缀）
        return minimatch(normalizedPathRes + "/", pattern + "/**");
      }
      // 对于文件，直接匹配
      return minimatch(normalizedPathRes, pattern);
    });
  };

  // 收集文件列表
  try {
    if (isUpload) {
      // 上传模式：扫描本地目录
      function walkUploadDir(
        currentLocalDir: string,
        currentRemoteDir: string
      ) {
        const items = readdirSync(currentLocalDir);
        for (const item of items) {
          const fullPath = join(currentLocalDir, item);
          const stat = statSync(fullPath);

          if (stat.isDirectory()) {
            if (!isExcluded(fullPath, true)) {
              walkUploadDir(fullPath, currentRemoteDir);
            } else {
              logger.info(`跳过排除目录: ${fullPath}`);
            }
          } else {
            const relativePath = relative(localDir, fullPath);
            const remotePath = join(remoteDir, relativePath).replace(
              /\\/g,
              "/"
            );

            if (!isExcluded(fullPath, false)) {
              files.push({
                localPath: fullPath,
                remotePath,
                size: stat.size,
              });
            } else {
              logger.info(`跳过排除文件: ${fullPath}`);
            }
          }
        }
      }
      walkUploadDir(localDir, remoteDir);
    } else {
      // 下载模式：扫描远程目录
      async function walkDownloadDir(remoteDir: string, localDir: string) {
        const remoteItems = await sftpClient.list(remoteDir);
        for (const item of remoteItems) {
          const remotePath = join(remoteDir, item.name).replace(/\\/g, "/");
          const relativePath = relative(remoteDir, remotePath);
          const localPath = join(localDir, relativePath);

          if (item.type === "d") {
            if (!isExcluded(remotePath, true)) {
              await walkDownloadDir(remotePath, localPath);
            } else {
              logger.info(`跳过排除目录: ${remotePath}`);
            }
          } else {
            if (!isExcluded(remotePath, false)) {
              files.push({
                localPath,
                remotePath,
                size: item.size,
              });
            } else {
              logger.info(`跳过排除文件: ${remotePath}`);
            }
          }
        }
      }
      await walkDownloadDir(remoteDir, localDir);
    }
  } catch (error) {
    throw Error(error);
  }

  const totalFiles = files.length;
  if (totalFiles === 0) {
    logger.error(`没有找到要${isUpload ? "上传" : "下载"}的文件`);
    return;
  }

  const multibar = new cliProgress.MultiBar(
    {
      clearOnComplete: false,
      hideCursor: true,
      format:
        "{time} {tip} {index} | 进度：{percentage}% | ETA：{eta_formatted} | {file}",
      barsize: 30,
    },
    cliProgress.Presets.shades_classic
  );

  try {
    // 执行文件传输
    for (const [index, file] of files.entries()) {
      const relativePath = isUpload
        ? relative(localDir, file.localPath)
        : relative(remoteDir, file.remotePath);

      const bar = multibar.create(file.size, 0, {
        file: padFileName(relativePath, 20),
        tip: chalk.cyan(`i 文件${isUpload ? "上传" : "下载"}中`),
        time: chalk.gray(`[${new Date().toLocaleTimeString()}]`),
        index: `[${index + 1}/${totalFiles}]`,
      });

      try {
        if (isUpload) {
          // 确保远程目录存在
          const remoteDirPath = dirname(file.remotePath);
          await sftpClient.mkdir(remoteDirPath, true).catch(() => {});

          // 上传文件
          await sftpClient.fastPut(file.localPath, file.remotePath, {
            step: (transferred) => bar.update(transferred),
          });
        } else {
          // 确保本地目录存在
          ensureLocalDir(dirname(file.localPath));
          // 下载文件
          await sftpClient.fastGet(file.remotePath, file.localPath, {
            step: (transferred) => bar.update(transferred),
          });
        }
        bar.update(file.size); // 确保100%
      } catch (error: any) {
        bar.stop();
        throw error;
      }
    }
    multibar.stop();
    logger.success(
      `${isUpload ? "上传" : "下载"}完成! 总共处理了 ${files.length} 个文件`
    );
  } catch (error: any) {
    multibar.stop();
    throw error;
  }
}
