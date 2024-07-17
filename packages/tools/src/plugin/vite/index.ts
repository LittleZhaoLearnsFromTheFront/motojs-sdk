import path from "path";
import { Options } from "../types";
import { glob } from "glob";
import { upload } from "../utils";

const viteMotojsSDK = (options: Options) => {
    let outPath = ''
    let type = 'build'
    return {
        name: 'motojs-sdk-upload',
        config: (_, { command }) => {
            type = command
        },
        configResolved: (configResolved) => {
            outPath = path.resolve(configResolved.build.outDir ?? 'dist')
        },
        closeBundle: async () => {
            if (type !== 'build') return
            if (!options.dsn) {
                console.log('dsn is not defind!');
                return
            }
            const list = glob.sync(path.join(outPath, `./**/*.{js.map,}`))
            for (let file of list) {
                try {
                    await upload(options.dsn, file, options.fields)
                    console.log('uploadMap:', file)
                } catch {
                    console.log('error:', file);
                }
            }
        }

    }
}
export { viteMotojsSDK }