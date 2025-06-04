import Client from "ssh2-sftp-client";

export let sftpClient = new Client();

export async function initSftp(config: Client.ConnectOptions) {
  await sftpClient.connect(config);
}

sftpClient;
