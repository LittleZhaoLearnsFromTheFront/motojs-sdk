#!/usr/bin/env node
import prompts from 'prompts'
import fs from "fs"
import path from 'path'
import { targets, packageDirPath } from "./utils.js"

const MITO_PREFIX = "@motojs_sdk"
let beModifiedPackages = []

async function run() {
    const result = await prompts([
        {
            type: 'text',
            message: '请输入版本',
            name: 'targetVersion'
        },
        {
            type: 'autocompleteMultiselect',
            message: '请选择更改版本package,默认不选为all',
            name: 'selectPackages',
            choices: [...targets.map(t => ({ title: t, value: t }))]
        }
    ])
    const { targetVersion, selectPackages } = result
    beModifiedPackages = selectPackages?.length ? selectPackages : targets
    const pkg = JSON.parse(fs.readFileSync("package.json", 'utf-8'))
    if (pkg.version !== targetVersion) {
        console.error('传入的版本号与根路径的package.json不符合，请检查package.json的version')
        return
    }
    modify(targetVersion)
}
async function modify(targetVersion) {
    console.log(`start modify packages version: ${targetVersion}`)
    for (const target of beModifiedPackages) {
        modifyMitoVersion(target, targetVersion)
    }
}

function modifyMitoVersion(pkgName, targetVersion) {
    const pkgPath = path.resolve(packageDirPath, `./${pkgName}/package.json`)
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const oldVersion = pkg.version
    pkg.version = targetVersion
    const dependencies = pkg.dependencies || {}
    Object.entries(dependencies).forEach(([dependent]) => {
        // 拼接：前缀 + 当前包名
        const isExist = beModifiedPackages.some((name) => `${MITO_PREFIX}/${name}` === dependent)
        if (isExist) {
            dependencies[dependent] = targetVersion
        }
    })
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
    console.log(`${pkgName} package version from ${oldVersion} to ${targetVersion} success`);
}
run()
