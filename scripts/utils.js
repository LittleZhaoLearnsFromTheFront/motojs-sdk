import fs from "fs"
import path from "path"

export const packageDirPath = path.resolve(process.cwd(), './packages')

export const targets = fs.readdirSync(packageDirPath).filter((f) => {
    if (!fs.statSync(`packages/${f}`).isDirectory()) {
        return false
    }
    return true
})