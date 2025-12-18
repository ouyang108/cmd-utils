import { defineConfig } from "tsdown";
import { existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from "fs";
import { resolve, join, dirname } from "path";

// 递归复制目录
function copyRecursive(src: string, dest: string) {
  if (!existsSync(src)) return;

  const srcStat = statSync(src);
  if (srcStat.isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }

    const files = readdirSync(src);
    files.forEach((file) => {
      const srcPath = join(src, file);
      const destPath = join(dest, file);
      copyRecursive(srcPath, destPath);
    });
  } else {
    // 确保目标目录存在
    const destDir = dirname(dest);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    copyFileSync(src, dest);
  }
}

export default defineConfig({
  entry: ["src/index.ts"],
  format: "cjs",
  clean: true, // 使用 tsdown 内置的清理功能
  banner: {
    js: "#!/usr/bin/env node",
  },
  external: [
    "events",
    "fs",
    "path",
    "os",
    "util",
    "crypto",
    "url",
    "querystring",
    "stream",
    "buffer",
    "process",
  ],
  outDir: "dist",
  dts: false,
  plugins: [
    {
      name: "copy-cli-folder",
      buildEnd() {
        // 复制 src/cli 文件夹到 dist/cli
        const srcCliDir = resolve("src/cli");
        const destCliDir = resolve("dist/cli");

        if (existsSync(srcCliDir)) {
          copyRecursive(srcCliDir, destCliDir);
          console.log(`Copied ${srcCliDir} to ${destCliDir}`);
        }
      },
    },
  ],
});
