export interface configInfo {
  /**
   * 服务器主机地址
   */
  host: string;
  /**
   * 服务器端口 (SSH默认22，FTP默认21)
   */
  port: number;
  /**
   * 登录用户名
   */
  username: string;
  /**
   * 登录密码
   */
  password: string;
  /**
   * 本地要上传的目录路径
   */
  localPath: string;
  /**
   * 远程服务器目标路径
   */
  remotePath: string;

  /**
   * 文件过滤规则 (可选)
   */
  excludePatterns?: string[];
}
export enum actionType {
  download,
  upload,
}
