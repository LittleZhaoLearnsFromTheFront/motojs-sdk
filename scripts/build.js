#!/usr/bin/env node
import { $ } from "zx"
import { targets } from "./utils.js"
async function run() {
    const packages = targets
    for (let index = 0; index < packages.length; index++) {
        const name = packages[index];
        await $`unbuild --packageName ${name}`
    }
}
run()
