import { defineBuildConfig } from 'unbuild'
import minimist from 'minimist'
const argv = minimist(process.argv.slice(2), { string: ["_"] })

const { packageName } = argv
const entrie = `packages/${packageName}/src/index`
const outDir = `packages/${packageName}/dist`
export default defineBuildConfig({
  entries: [entrie],
  outDir: outDir,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      target: 'es2015',
      minify: true,
    },
  },
  declaration: true,
})
