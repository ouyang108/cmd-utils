import cac from "cac";
import fs from "node:fs";
import path from "path";
import { readCommandJson, listAndModifyJson } from "./utils/setCommamd";
import { resetAction, resetSingleAction } from "./utils/restCommand";
import { isCommandExists } from "./utils/isCommand";

/**
 * 列出所有命令（类似ls的效果）
 */
function listAllCommands() {
   
  console.log("\n=== 可用命令别名列表 ===");
  // 遍历命令对象，格式化输出
  Object.entries(readCommandJson()).forEach(([alias, desc], index) => {
    // 对齐输出
    console.log(`[${index + 1}] ${alias.padEnd(5)} -> ${desc}`);
  });
  console.log("=========================\n");
}
const cli = cac("cmd-utils");
// cli.version("0.0.1");
// 实现输入 utils ls 命令，打印当前目录下的所有文件
cli.command("ls", "列出所有命令").action(() => {
   
  listAllCommands();
});

// 实现输入set命令，修改command.json文件
cli
  .command("set [alias] [...command]", "设置命令别名")
  .usage("[alias] [...command] - 设置命令别名，参数说明如下：")
  .example("set 不传参数，进入别名列表修改模式")
  .example("set alias command 设置alias命令为command")
  .action((alias, command) => {
    if (!alias) {
      listAndModifyJson();
      return;
    }
    const commands = readCommandJson();

    commands[alias] = command.join(" ");
    fs.writeFileSync(
      path.resolve(__dirname, "cli/command.json"),
      JSON.stringify(commands, null, 2)
    );
    console.log(`已设置 ${alias} -> ${command.join(" ")}`);
  });
// 重置命令
cli
  .command("reset [alias]", "重置命令,还原到初始化")
  .usage("[alias] - 设置命令别名，参数说明如下：")
  .example("reset 不传参数，重置所有命令")
  .example("reset once 重置单个命令")
  .action((alias) => {
    // listAndModifyJson();
    if (!alias) {
      // 重置全部
      resetAction();
      return;
    }
    if (alias === "once") {
      resetSingleAction();
    }
  });
cli.help();

// 添加默认命令处理，用于执行自定义命令别名
// 替换原有的 exec 逻辑
cli
  .command("<alias>", "执行自定义命令别名")
  .allowUnknownOptions()
  .action(async (alias) => {
    try {
      const commands = readCommandJson();

      if (!commands[alias]) {
        console.error(`❌ 未找到命令别名: ${alias}`);
        console.log("使用 'ocu ls' 查看所有可用命令别名");
        process.exit(1);
      }

      // 拆分预设命令的第一个部分（比如 'nn dd' 拆分出 'nn'）
      const firstPart = commands[alias].split(" ")[0];
      // 校验命令是否存在
      const isExist = await isCommandExists(firstPart);

      if (!isExist) {
        console.error(`❌ 命令 ${firstPart} 不存在,是否输入错误或者未安装`);
        return;
      }

      const { spawn } = await import("node:child_process");

      // 获取命令的参数
      const args = process.argv.slice(3);
      // 拆分基础命令和命令自身的参数（比如 "pnpm run dev" 拆成 ["pnpm", "run", "dev"]）
      const baseCommandArr = commands[alias].split(" ");
      // 合并所有参数（基础命令参数 + 额外传入的参数）
      const fullArgs = [...baseCommandArr.slice(1), ...args];
      const baseCommand = baseCommandArr[0];

      console.log(`🚀 执行命令: ${baseCommand} ${fullArgs.join(" ")}`);
      
      // 创建子进程，实时输出/stdout/stderr
      const child = spawn(baseCommand, fullArgs, {
        stdio: "inherit", // 关键：继承父进程的输入输出，让dev服务的日志实时显示
        cwd: process.cwd(), // 使用当前工作目录
        shell: true // 兼容Windows环境
      });

      // 监听子进程退出
      child.on("exit", (code) => {
        if (code !== 0) {
          console.error(`❌ 命令执行失败，退出码: ${code}`);
          process.exit(code);
        }
      });

      // 监听子进程错误
      child.on("error", (error) => {
        console.error(`❌ 执行错误: ${error.message}`);
        process.exit(1);
      });

    } catch (error) {
      console.error("❌ 执行自定义命令失败:", error);
    }
  });

// 解析命令行参数
cli.parse();
