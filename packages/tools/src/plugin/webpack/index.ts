import glob from "glob"
import path from 'path'
import { upload } from "../utils";
import { Options } from "../types";
class MotojsSDKPlugin {
    options: Options = { dsn: '', fields: '' }
    constructor(options: Options) {
        this.options = options
    }

    apply(compiler) {
        let outPath = ''
        compiler.hooks.afterEmit.tap('motojs-sdk-upload', () => {
            // 获取输出文件夹的绝对路径
            outPath = path.resolve(compiler.options.output.path);
        });
        compiler.hooks.done.tapAsync('motojs-sdk-upload', async (_, next) => {
            if (!this.options.dsn) {
                console.log('dsn is not defind!');
                return
            }
            const list = glob.sync(path.join(outPath, `./**/*.{js.map,}`))
            for (let file of list) {
                try {
                    await upload(this.options.dsn, file, this.options.fields)
                    console.log('uploadMap:', file)
                } catch {
                    console.log('error:', file)
                }
            }
            next()
        })
    }
}
const chainWebpackMotojsSDK = (config: any, options: Options) => {
    config.plugin('motojs-sdk-upload').use(
        MotojsSDKPlugin, [
        options
    ])
}
export { MotojsSDKPlugin, chainWebpackMotojsSDK }