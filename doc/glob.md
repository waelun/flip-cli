# Glob 表达式详解

Glob（全局匹配）是一种用于匹配文件路径名的模式匹配语法，常用于命令行工具和编程语言中（如Unix shell、Python的`glob`模块等）。它比正则表达式简单，专门用于文件名匹配。

## 基本通配符

1. `*` - 匹配任意数量的任意字符（包括零个字符）
   - `*.txt` 匹配所有以`.txt`结尾的文件
   - `a*` 匹配所有以`a`开头的文件
2. `?` - 匹配单个任意字符
   - `file?.txt` 匹配`file1.txt`、`fileA.txt`等，但不匹配`file10.txt`
3. `[ ]` - 匹配括号内的任一字符
   - `file[123].txt` 匹配`file1.txt`、`file2.txt`、`file3.txt`
   - `[a-z]` 匹配任意小写字母
   - `[!a]` 或 `[^a]` 匹配不是`a`的字符

## 扩展通配符（部分shell支持）

1. `**` - 递归匹配所有子目录
   - `**/*.txt` 匹配当前目录及所有子目录中的`.txt`文件
2. `{ }` - 匹配多个模式
   - `file.{txt,md}` 匹配`file.txt`和`file.md`
   - `a{b,c}d` 匹配`abd`和`acd`

## 转义字符

- 使用反斜杠

  ```
  \
  ```

  来转义特殊字符

  - `file\*.txt` 匹配字面上的`file*.txt`文件

## 示例

- `*.py` - 所有Python文件
- `project?.md` - `project1.md`, `projectA.md`等
- `image[0-9].jpg` - `image0.jpg`到`image9.jpg`
- `src/**/*.js` - `src`目录及其子目录中的所有JavaScript文件
- `backup.{tar,gz}` - `backup.tar`和`backup.gz`

## 与正则表达式的区别

1. Glob更简单，专为文件名匹配设计
2. `*`在glob中相当于正则的`.*`
3. `?`在glob中相当于正则的`.`
4. `[ ]`在两者中功能相似
5. 正则表达式有更多复杂特性如量词(`+`, `?`, `{n,m}`)、锚点(`^`, `$`)、分组等

## 编程语言中的使用

在Python中：

```
import glob
files = glob.glob('*.py')  # 获取当前目录所有.py文件
```

在Bash中：

```
ls *.txt       # 列出所有.txt文件
rm file[1-3].* # 删除file1.*, file2.*, file3.*
```

Glob表达式是文件操作中非常实用的工具，掌握它能大大提高工作效率。