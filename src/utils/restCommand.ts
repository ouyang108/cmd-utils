import { readFileSync } from "./readFile";
import path from "node:path";
import fs from "fs";
import { confirm } from "@inquirer/prompts";
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
export { resetCommandJson, resetAction };
