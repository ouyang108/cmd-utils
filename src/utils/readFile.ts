import fs from "fs";

function readFileSync(jsonFilePath: string) {
  const commandJson = fs.readFileSync(jsonFilePath, "utf-8");
  return JSON.parse(commandJson);
}
export { readFileSync };
