# npm 发包常用命令

npm (Node Package Manager) 是 JavaScript 生态中最常用的包管理工具，以下是发布 npm 包的常用命令和流程：

## 1. 初始化项目

```
npm init
# 或使用默认配置快速初始化
npm init -y
```

## 2. 登录 npm 账号

```
npm login
# 或指定私有 registry
npm login --registry=https://your-private-registry.example.com
```

## 3. 检查当前登录用户

```
npm whoami
```

## 4. 发布包

```
npm publish
# 发布到特定 registry
npm publish --registry=https://your-private-registry.example.com
```

## 5. 发布带标签的版本

```
npm publish --tag beta
```

## 6. 更新版本号

```
npm version patch   # 0.0.1 → 0.0.2
npm version minor   # 0.0.1 → 0.1.0
npm version major   # 0.0.1 → 1.0.0
```

## 7. 撤销发布

```
npm unpublish <package-name>@<version>
# 或撤销整个包（24小时内有效）
npm unpublish <package-name> --force
```

## 8. 设置访问权限

```
npm access public <package-name>    # 设为公开
npm access restricted <package-name> # 设为私有
```

## 9. 查看包信息

```
npm view <package-name>
npm info <package-name>
```

## 10. 常用辅助命令

```
# 检查包名是否可用
npm search <package-name>
npm view <package-name> name

# 列出当前用户发布的包
npm ls --global --depth=0

# 更新所有依赖
npm update
```

## 发布流程示例

1. 初始化项目并编写代码
2. 更新 package.json 中的必要字段（name, version, description 等）
3. 登录 npm 账号
4. 运行测试
5. 构建项目（如有需要）
6. 更新版本号
7. 发布包

## 注意事项

- 包名必须唯一（可先通过 `npm search` 检查）
- 发布公开包是免费的，私有包需要付费订阅
- 撤销发布有严格的时间限制（24 小时内）
- 发布前确保已正确设置 `.npmignore` 或 `package.json` 的 `files` 字段

## 高级

1. 添加版本标识符
   npm version patch -m "版本 %s" # %s 会被替换为新版本号
2. 跳过 Git 操作
   npm version patch --no-git-tag-version # 只更新 package.json，不创建 git 标签
3. 强制更新版本
   npm version patch -f # 即使 git 工作目录不干净也强制更新
