# @ou/cmd-utils

一个轻量级的命令别名管理脚手架工具，让你能够快速设置和执行自定义命令。

## 功能特性

- ✨ 简单易用的命令别名管理
- 📋 列出所有已设置的命令别名
- 🎯 执行自定义命令别名
- 🔄 重置命令别名到初始状态
- 🎨 交互式修改命令别名
- ✅ 命令存在性校验

## 安装

```bash
npm install @ouyangtianfeng/cmd-utils -g
```

## 快速开始

### 列出所有命令别名

```bash
ocu ls
```

### 设置命令别名

```bash
# 方式1：直接设置别名
ocu set pi pnpm install

# 方式2：进入交互式修改模式
ocu set
```

### 执行自定义命令

```bash
# 执行已设置的别名
ocu pi
```

### 重置命令别名

```bash
# 重置所有命令别名
ocu reset

# 重置单个命令别名
ocu reset once
```

## 详细使用说明

### ocu ls

列出所有已设置的命令别名。

```bash
ocu ls
```

**输出示例：**
```
=== 可用命令别名列表 ===
[1] pi     -> pnpm install
[2] pa     -> pnpm add 
[3] pb     -> pnpm build
[4] nst    -> npm config set registry https://registry.npmmirror.com
[5] ns     -> npm config set registry https://registry.npmjs.org
[6] ncr    -> npm config get registry
=========================
```

### ocu set

用于设置和管理命令别名。

```bash
# 语法
ocu set [alias] [...command]

# 示例
ocu set pa pnpm add
ocu set pb pnpm build
```

**参数说明：**
- `alias`: 命令别名（可选）
- `command`: 实际执行的命令（可选）

**交互式模式：**
当不传递任何参数时，会进入交互式修改模式：

```
📋 当前JSON文件中的内容：
[1] pi     -> pnpm install
[2] pa     -> pnpm add 
[3] pb     -> pnpm build
[4] nst    -> npm config set registry https://registry.npmmirror.com
[5] ns     -> npm config set registry https://registry.npmjs.org
[6] ncr    -> npm config get registry

? 请选择操作：
❯ 修改已有命令
  新增命令
  删除命令
  退出
```

### ocu reset

用于重置命令别名。

```bash
# 重置所有命令别名到初始状态
ocu reset

# 重置单个命令别名
ocu reset once
```

### 执行自定义命令

直接使用 `ocu` 后跟命令别名即可执行对应命令。

```bash
ocu <alias>
```

**示例：**
```bash
# 执行 pnpm install
ocu pi

# 执行 pnpm add react
ocu pa react
```

## 命令存在性校验

工具会自动校验命令是否存在：

```bash
ocu set nn non_existent_command
ocu nn
# 输出：命令 non_existent_command 不存在,是否输入错误或者未安装
```

## 项目结构

```
@ou/cmd-utils/
├── src/
│   ├── cli/             # 命令配置文件
│   │   ├── command.json     # 当前命令别名配置
│   │   └── historyCommand.json # 初始命令别名配置
│   ├── utils/           # 工具函数
│   │   ├── isCommand.ts     # 命令存在性校验
│   │   ├── readFile.ts      # 文件读取
│   │   ├── restCommand.ts   # 重置命令
│   │   └── setCommamd.ts    # 设置命令
│   └── index.ts         # 主入口文件
├── dist/                # 构建输出目录
├── package.json         # 项目配置
├── tsconfig.json        # TypeScript配置
└── tsdown.config.ts     # 构建配置
```

## 开发

```bash
# 克隆项目
git clone <repository-url>
cd cmd-utils

# 安装依赖
pnpm install

# 构建项目
pnpm build

# 开发模式
pnpm dev
```

## 发布

```bash
npm publish --access public
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

ISC
