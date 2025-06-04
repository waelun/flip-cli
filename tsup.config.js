import { defineConfig } from "tsup";
import copy from "rollup-plugin-copy";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: "esm",
  clean: true,
  minify: true, // 压缩
  // dts: true,
  // sourcemap: true,
  watch: true,
  // treeshake: true,
  plugins: [
    copy({
      targets: [
        { src: "./src/command/flip.config.json", dest: "dist" }, // 复制单个文件
        // { src: 'assets/images/*', dest: 'dist/images' }, // 复制整个文件夹
        { src: ".env", dest: "dist" }, // 根目录文件
      ],
    }),
  ],
});
