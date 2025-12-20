import { exec } from "node:child_process";
import { promisify } from "node:util";

// 把 exec 转换成 Promise 形式，方便异步处理
const execAsync = promisify(exec);

/**
 * 校验命令是否存在
 * @param {string} command 要校验的命令（比如 'nn'、'pnpm'）
 * @returns {Promise<boolean>} 存在返回 true，不存在返回 false
 */
async function isCommandExists(command: string) {
  let cmd = "";
  // 根据系统选择不同的校验命令
  if (process.platform === "win32") {
    // Windows 系统使用 where 命令，/q 表示静默模式（只返回状态，不输出内容）
    cmd = `where /q ${command}`;
  } else {
    // macOS/Linux 系统使用 command -v
    cmd = `command -v ${command}`;
  }
  try {
    // 执行校验命令
    await execAsync(cmd);
    // 没有抛出错误，说明命令存在
    return true;
  } catch (error) {
    // 抛出错误，说明命令不存在
    return false;
  }
}
export { isCommandExists };
