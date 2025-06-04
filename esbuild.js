// https://juejin.cn/post/7450045367225679899#heading-14
import { context } from 'esbuild'
import externalPackage from 'esbuild-plugin-external-package'
import copy from 'esbuild-copy-files-plugin'
const ctx = await context({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  // charset: 'utf8',
  outdir: 'dist',
  format: 'esm',
  // external: [],
  // minify: true,
  // pure: true,
  logLevel: 'info',
  platform: 'node',
  // metafile: true,
  plugins: [
    externalPackage,
    copy({
      source: ['./src/command/flip.config.json', '.env'],
      target: './dist',
    }),
  ],
})
await ctx.watch()
