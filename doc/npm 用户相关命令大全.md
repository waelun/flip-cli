# npm 用户相关命令大全

以下是 npm 中与用户管理相关的常用命令：

## 1. 用户认证命令

### 登录/添加用户

```
npm login
# 或旧版命令
npm adduser
# 指定注册表登录
npm login --registry=https://your-registry.example.com
```

### 登出用户

```
npm logout
# 从特定注册表登出
npm logout --registry=https://your-registry.example.com
```

### 检查当前登录用户

```
npm whoami
# 检查特定注册表的登录用户
npm whoami --registry=https://your-registry.example.com
```

## 2. 用户配置命令

### 查看npm配置

```
npm config list
# 查看全局配置
npm config list --global
```

### 设置用户配置

```
npm set init-author-name "Your Name"
npm set init-author-email "your@email.com"
npm set init-author-url "https://yourwebsite.com"
npm set init-license "MIT"
```

### 查看特定配置项

```
npm get init-author-name
npm get registry
```

## 3. 用户权限管理

### 查看包访问权限

```
npm access ls-packages
npm access ls-collaborators <package-name>
```

### 管理包协作者

```
# 添加协作者
npm owner add <username> <package-name>
# 删除协作者
npm owner rm <username> <package-name>
# 列出所有协作者
npm owner ls <package-name>
```

### 更改包访问级别

```
npm access public <package-name>    # 设为公开
npm access restricted <package-name> # 设为私有
npm access grant <read-only|read-write> <team> <package-name>
npm access revoke <team> <package-name>
```

## 4. 用户信息管理

### 查看用户信息

```
npm profile get
```

### 更新用户信息

```
npm profile set password
npm profile set email <new-email>
npm profile set fullname <new-name>
npm profile set homepage <new-url>
npm profile set freenode <new-irc-nick>
npm profile set twitter <new-twitter-handle>
npm profile set github <new-github-username>
```

## 5. 双因素认证(2FA)

### 启用2FA

```
npm profile enable-2fa
npm profile enable-2fa auth-only   # 仅登录需要
npm profile enable-2fa auth-and-writes # 登录和发布都需要
```

### 禁用2FA

```
npm profile disable-2fa
```

## 6. 用户令牌(Token)管理

### 创建访问令牌

```
npm token create
npm token create --read-only
npm token create --cidr=192.0.2.0/24
```

### 列出令牌

```
npm token list
```

### 撤销令牌

```
npm token revoke <token-id>
```

## 注意事项

1. 使用 `--registry` 参数可以指定私有注册表
2. 敏感操作可能需要双因素认证
3. 用户配置存储在 `~/.npmrc` 文件中
4. 组织权限管理需要相应的组织管理员权限

这些命令可以帮助你全面管理 npm 用户账户、权限和认证设置。