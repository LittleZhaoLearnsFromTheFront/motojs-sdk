#!/usr/bin/env node
import { $ } from "zx"
import { targets, packageDirPath } from "./utils.js"
import path from "path"
import fs from "fs"
import prompts from "prompts"
async function run() {
    const result = await prompts([
        {
            type: 'autocompleteMultiselect',
            message: '请选择更改版本package,默认不选为all',
            name: 'selectPackages',
            choices: [...targets.map(t => ({ title: t, value: t }))]
        }
    ])
    const newPackages = result.selectPackages?.length ? result.selectPackages : targets
    const error = []
    const success = []
    for (let index = 0; index < newPackages.length; index++) {
        const pkgName = newPackages[index]
        const pkgPath = path.resolve(packageDirPath, `./${pkgName}`)
        if (!fs.existsSync(path.resolve(pkgPath, './dist'))) {
            error.push(pkgName)
            continue;
        }
        try {
            await $({ cwd: pkgPath, stdio: ['inherit', 'inherit', 'inherit'] })`npm publish`
            success.push(pkgName)
        } catch {
            error.push(pkgName)
        }
    }
    if (error.length) {
        console.error(`publish error : ${error.join('、')}`);
    }
    if (success.length) {
        console.log(`publish success : ${success.join('、')}`);
    }
}

run()