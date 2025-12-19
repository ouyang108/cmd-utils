import { readFileSync } from "./readFile";
import path from "node:path";
import fs from "fs";
import { confirm, select } from "@inquirer/prompts";
import { BREAK } from "../constant/text";
import chalk from "chalk";
const jsonFilePath = path.resolve(__dirname, "cli/historyCommand.json");
const commandJsonFilePath = path.resolve(__dirname, "cli/command.json");
const resetCommandJson = async () => {
  const historyCommandJson = readFileSync(jsonFilePath);

  //  将command.json内容替换成historyCommandJson的内容
  fs.writeFileSync(
    commandJsonFilePath,
    JSON.stringify(historyCommandJson, null, 2)
  );
  console.log(chalk.green("重置成功"));
};

async function resetAction() {
  try {
    const answer = await confirm({ message: "确认重置吗？", default: false });

    if (answer) {
      resetCommandJson();
    }
  } catch (err) {
    console.log(chalk.red(BREAK, err));
  }
}
// 单个重置
async function resetSingleAction() {
  try {
    //  读取当前的command.json文件
    const jsonData = readFileSync(commandJsonFilePath);
    // 读取初始化的json文件
    const initJsonData = readFileSync(jsonFilePath);
    // 获取当前command.json文件中的alias
    const aliasInJson = Object.keys(jsonData);
    // 获取初始化的json文件中的alias
    const initAliasInJson = Object.keys(initJsonData);
    if (aliasInJson.length === 0) {
      console.log(
        chalk.yellow("当前没有设置任何命令别名,建议直接重置所有命令")
      );
      return;
    }
    const selectedKey = await select({
      message: "请选择要修改的命令：",
      choices: aliasInJson,
    });
    // 如果selectedKey不在initAliasInJson中，移出这个命令
    if (!initAliasInJson.includes(selectedKey)) {
      // 移出这个命令
      delete jsonData[selectedKey];
      // 将剩余命令写入command.json文件
      fs.writeFileSync(commandJsonFilePath, JSON.stringify(jsonData, null, 2));
      console.log(chalk.green(`已删除 ${selectedKey}`));
    } else {
      // 将init的数据赋值给jsonData
      jsonData[selectedKey] = initJsonData[selectedKey];
      // 将剩余命令写入command.json文件
      fs.writeFileSync(commandJsonFilePath, JSON.stringify(jsonData, null, 2));
      console.log(chalk.green(`已重置 ${selectedKey}`));
    }
  } catch (err) {
    console.log(chalk.red(BREAK, err));
  }
}
export { resetCommandJson, resetAction, resetSingleAction };
