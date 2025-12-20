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
  //   console.log("列出所有命令");
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
cli
  .command("<alias> ", "执行自定义命令别名")
  .allowUnknownOptions()
  .action(async (alias) => {
    const commands = readCommandJson();
    // 拆分预设命令的第一个部分（比如 'nn dd' 拆分出 'nn'）
    const firstPart = commands[alias].split(" ")[0];
    // 校验命令是否存在
    const isExist = await isCommandExists(firstPart);

    if (!isExist) {
      console.error(`命令 ${firstPart} 不存在,是否输入错误或者未安装`);
      return;
    }

    if (commands[alias]) {
      const { exec } = await import("node:child_process");

      // 获取命令的参数
      const args = process.argv.slice(3);

      // 合并命令和参数
      // 判断电脑有没有安装这个命令
      const commandWithArgs = `${commands[alias]} ${args.join(" ")}`;
      exec(commandWithArgs, (error, stdout, stderr) => {
        if (error) {
          console.error(`执行错误: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    } else {
      console.error(`未找到命令别名: ${alias}`);
      console.log("使用 'cmd-utils ls' 查看所有可用命令别名");
      process.exit(1);
    }
  });

// 解析命令行参数
cli.parse();
