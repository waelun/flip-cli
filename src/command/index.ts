import { copyFileSync, existsSync, readFileSync } from "fs";
import { resolve } from "path";
import logger from "../utils/consola";
import { getDirName, transferDir } from "../utils";
import { initSftp, sftpClient } from "./sftpClient";
import { actionType, configInfo } from "src/type";

// 初始化
export async function init() {
  copyFileSync(
    resolve(getDirName(), process.env.CONFIG_FILE_NAME),
    resolve(process.cwd(), process.env.CONFIG_FILE_NAME)
  );
  logger.success("已初始化配置文件:", process.env.CONFIG_FILE_NAME);
}
// 上传
export async function handleUploadOrDownloadAction(
  configName = process.env.CONFIG_FILE_NAME,
  type: actionType
) {
  logger.info("配置文件", configName);
  // 参数校验
  const configPath = resolve(process.cwd(), configName);
  if (!existsSync(configPath)) {
    logger.error("配置文件不存在，如还未有配置文件，请先执行flip init");
    return;
  }
  // 读取参数
  const config: configInfo = JSON.parse(readFileSync(configPath, "utf8"));
  try {
    // 初始化连接
    await initSftp({
      host: config.host,
      username: config.username,
      password: config.password,
      port: config.port,
    });
    logger.success("初始化sftp连接");
    // 上传文件
    const srcDir = resolve(process.cwd(), config.localPath);
    logger.info("本地目录", srcDir);
    logger.info("远程目录", config.remotePath);
    await transferDir(
      sftpClient,
      srcDir,
      config.remotePath,
      type,
      config.excludePatterns
    );
  } catch (error: any) {
    logger.error("出错了", error.message);
    logger.error("-----------错误详情 开始-----------");
    console.log(error);
    logger.error("-----------错误详情 结束-----------");
  }
  await sftpClient.end();
  // 关闭连接
  logger.success("关闭sftp连接");
}
