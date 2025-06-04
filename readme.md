# @waelun/flip - SFTP 文件传输工具

## 简介

flip 是一个基于 SFTP 协议的文件传输工具，用于在本地和远程服务器之间高效地上传和下载文件。

## 功能预览

![功能预览](https://raw.githubusercontent.com/waelun/flip-cli/master/assets/image-20250523192526047.png)

## 安装

### 全局安装（推荐）

```bash
npm install @waelun/flip -g
```

### 项目内安装

```bash
npm install @waelun/flip --save-dev
```

## 使用说明

### 查看帮助

```bash
flip --help
# 或项目内使用
npx flip --help
```

### 初始化配置

> 提示：建议将配置文件添加到 `.gitignore` 中以避免敏感信息泄露

```bash
flip init
```

默认会在当前目录生成 `flip.config.json` 配置文件

### 配置文件示例

```json
{
  "host": "your_server_ip",
  "port": 22,
  "username": "your_username",
  "password": "your_password",
  "localPath": "./dist",
  "remotePath": "/var/www/html/your_project",
  "excludePatterns": ["node_modules/", ".git", "*.log"]
}
```

### 文件上传

```bash
# 使用默认配置
flip upload

# 使用自定义配置
flip upload ./config/custom.config.json
```

### 文件下载

```bash
# 使用默认配置
flip download

# 使用自定义配置
flip download ./config/custom.config.json
```

## 其他

### 为何不使用 sftp、scp 命令

每次上传都要输入地址、账号密码，有点儿麻烦

### 应用场景

对于我来说主要用于前端项目的部署，结合 nginx，不用重启上传即可更新。(提示：如果要专业的部署工具，jenkins 阿里云效都是非常不错的产品。)

该项目可以作为一个小工具使用，也可以作为学习项目使用，包含了很多有意思的 js 开发知识，如：

1. nodejs 中文件、路径模块的具体应用
2. 如何构建并打包 nodejs 项目
3. 如何开发一个 cli 工具
4. 如何发布一个 npm 包

### 其他工具推荐

由于该项目比较特殊，最理想的使用方式 npm 全局安装使用。

但是全局安装 npm 包意味着需要安装 node 环境，所以对于非 js 开发人员，还是有些许的麻烦。

所以给大家推荐另一个类似的工具：rclone https://github.com/rclone/rclone

rclone 基本使用流程

1. 安装 rclone

2. 初始化连接配置`rclone config`

3. 传输 `rclone copy source:path dest:path [flags]` (-v 显示日志)

   - 上传 `rclone copy ./dist configName:/home/code/test -v`
   - 下载 `rclone copy configName:/home/code/test ./download -v`

4. 文件排除

   ```bash
   rclone copy ./ configName:/home/code/test -v --exclude node_modules/
   ```

5. 配置文件位置

   ```bash
   rclone config file
   ```

6. 磁盘挂载

   ```bash
   rclone mount configName:/home/code/test Z: --volname "MyCloudDrive"
   ```

### 反馈

如果在使用的过程中有任何问题，也欢迎各位反馈。
