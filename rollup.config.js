import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import copy from "rollup-plugin-copy";
import del from "rollup-plugin-delete";
import json from "@rollup/plugin-json";
import nodeExternals from "rollup-plugin-node-externals";
import terser from "@rollup/plugin-terser";
import filesize from "rollup-plugin-filesize";
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "src/index.ts", // 入口文件
  output: {
    // file: "dist/bundle.js", // 输出文件
    dir: "dist",
    // sourcemap: true // 生成 sourcemap
    // preserveModules: true, // 保留原始模块结构
    // preserveModulesRoot: "./", // 可选，指定相对于哪个目录保留结构
  },
  plugins: [
    del({ targets: "dist/*" }), // 清除dist目录下的所有内容
    json(), // 启用 JSON 解析
    nodeResolve(), // 解析 node_modules 中的模块
    commonjs(), // 将 CommonJS 模块转换为 ES6
    typescript({
      tsconfig: "./tsconfig.json", // 指定 tsconfig 文件
      useTsconfigDeclarationDir: true, // 使用 tsconfig 中的声明文件配置
    }),
    copy({
      targets: [
        { src: "./src/command/flip.config.json", dest: "dist" }, // 复制单个文件
        // { src: 'assets/images/*', dest: 'dist/images' }, // 复制整个文件夹
        { src: ".env", dest: "dist" }, // 根目录文件
      ],
      verbose: true, // 显示复制日志
    }),
    nodeExternals(), // 自动排除node_modules
    terser(), // 压缩
    filesize(),
  ],
  // external: [
  //   // 这里列出不希望打包的外部依赖
  //   "fs",
  //   "path",
  //   // 其他 Node.js 内置模块或第三方模块
  //   "commander",
  //   "chalk",
  //   "dotenv",
  //   "ssh2-sftp-client",
  //   "cli-progress",
  // ],
  watch: {
    clearScreen: true,
  },
};
