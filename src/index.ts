#!/usr/bin/env node
import { config } from 'dotenv';
import { resolve } from 'path';
import { program } from 'commander';
import { getDirName } from './utils';
import packageJson from '../package.json';
config({
  path: resolve(getDirName(), './.env'),
  // debug: true,
  // encoding: "utf8",
});

import { init, handleUploadOrDownloadAction } from './command';
import { actionType } from './type';
program
  .name(packageJson.name.replace('@waelun/', ''))
  .description(packageJson.description)
  .version(packageJson.version);
program.command('init').description('初始化配置文件').action(init);
program
  .command('upload')
  .description('文件上传')
  .argument(
    '[configFile]',
    `指定配置文件路径（如 ${process.env.CONFIG_FILE_NAME}）`
  )
  .action((configFile) => {
    handleUploadOrDownloadAction(configFile, actionType.upload);
  });
program
  .command('download')
  .description('文件下载')
  .argument(
    '[configFile]',
    `指定配置文件路径（如 ${process.env.CONFIG_FILE_NAME}）`
  )
  .action((configFile) => {
    handleUploadOrDownloadAction(configFile, actionType.download);
  });

program.helpCommand('help', '显示帮助文档');
program.parse(process.argv);
