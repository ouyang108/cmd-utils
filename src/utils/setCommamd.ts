import { select, input } from "@inquirer/prompts";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import { readFileSync } from "./readFile";
import { BREAK } from "../constant/text";
const jsonFilePath = path.join(__dirname, "cli/command.json");
function readCommandJson() {
  return readFileSync(jsonFilePath);
}
/**
 * 列出并修改JSON内容（使用inquirer交互）
 */
async function listAndModifyJson() {
  try {
    const jsonData = readCommandJson();

    // 1. 列出所有JSON内容
    console.log("\n📋 当前JSON文件中的内容：");
    if (Object.keys(jsonData).length === 0) {
      console.log("(空对象)");
    } else {
      Object.entries(jsonData).forEach(([key, value], index) => {
        console.log(`[${index + 1}] ${key.padEnd(5)}: ${value}`);
      });
    }

    // 2. 交互选择操作
    const action = await select({
      message: "请选择操作：",
      choices: ["修改已有命令", "新增命令", "删除命令", "退出"],
    });

    if (action === "退出") {
      console.log("操作已取消");
      return;
    }

    // 3. 根据选择执行对应操作
    if (action === "修改已有命令") {
      const keys = Object.keys(jsonData);
      if (keys.length === 0) {
        console.log("没有可修改的命令，请先新增命令");
        return;
      }
      const selectedKey = await select({
        message: "请选择要修改的命令：",
        choices: keys,
      });
      // 记录当前key的内容
      const currentKeyValue = jsonData[selectedKey];
      // 允许修改当前的key
      const newKey = await input({
        message: `请输入"${selectedKey}"的新命令名（当前命令名：${selectedKey}）：`,
        default: selectedKey,
      });
      // 检查新命令名是否已存在
      if (keys.includes(newKey)) {
        console.log(chalk.red("命令名已存在，请选择其他命令名"));
        return;
      }
      // 检查key是否为空
      if (newKey.trim() === "") {
        console.log(chalk.red("命令名不能为空"));
        return;
      }
      const newValue = await input({
        message: `请输入"${newKey}（原命令名：${selectedKey}）"的新值（当前值：${currentKeyValue}）：`,
        default: currentKeyValue,
      });
      jsonData[selectedKey] = newValue;
    } else if (action === "新增命令") {
      const key = await input({
        message: "请输入新命令名：",
      });
      const newKeyValue = await input({
        message: `请输入新命令：`,
      });
      jsonData[key] = newKeyValue;
    } else if (action === "删除命令") {
      const keys = Object.keys(jsonData);
      if (keys.length === 0) {
        console.log("没有可删除的命令");
        return;
      }
      const selectedKey = await select({
        message: "请选择要删除的命令：",
        choices: keys,
      });
      delete jsonData[selectedKey];
    }

    // 4. 保存并展示修改后的内容
    writeJsonFile(jsonData);
    console.log("\n🔧 修改后的JSON内容：");
    Object.entries(jsonData).forEach(([k, v], i) => {
      console.log(`[${i + 1}] ${k.padEnd(5)}: ${v}`);
    });
  } catch (_err) {
    console.log(chalk.red(BREAK));
    process.exit(1);
  }
}
/**
 * 写入JSON文件内容
 */
function writeJsonFile(data: any) {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2), "utf8");
    console.log(`\n✅ JSON文件已成功保存到：${jsonFilePath}`);
  } catch (err) {
    console.log(chalk.red("写入JSON文件失败", err));
    process.exit(1);
  }
}
export { readCommandJson, listAndModifyJson };
