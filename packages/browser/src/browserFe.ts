import { BaseFe } from "@motojs_sdk/core";
import { supportsHistory } from "@motojs_sdk/shared";
import { createFeId, formatFeFrom, on, replaceOld, targetHasUnknow } from "@motojs_sdk/utils";
import { getSearchParmams } from "./utils";

export class BrowserFe extends BaseFe {
    constructor(feId?: string, feFrom?: string) {
        const newFeForm = getSearchParmams("feFrom")
        feId = feId || createFeId() || ''
        feFrom = feFrom || (newFeForm ? formatFeFrom(newFeForm as string) : '')
        super(feId, feFrom);
    }
    on() {
        this.historyHandler()
        this.hashHandler()
    }

    historyHandler() {
        if (!supportsHistory()) return
        const self = this
        const oldOnpopstate = window.onpopstate
        window.onpopstate = function (this: any, ...args: any) {
            self.handler()
            oldOnpopstate && oldOnpopstate.apply(this, args)
        }
        function historyReplaceFn(originalHistoryFn) {
            return function (this: History, ...args: any[]): void {
                const url = location.origin + (args.length > 2 ? args[2] : '/')
                self.handler(url)
                return originalHistoryFn.apply(this, args)
            }
        }
        // 以下两个事件是人为调用，但是不触发onpopstate
        replaceOld(window.history, 'pushState', historyReplaceFn)
        replaceOld(window.history, 'replaceState', historyReplaceFn)
    }
    hashHandler() {
        if (!targetHasUnknow(window, 'onpopstate')) return
        const self = this
        on(window, 'hashchange', () => {
            self.handler()
        })
    }

    handler(url?: string) {
        const feFrom = formatFeFrom(getSearchParmams("feFrom", url) as string || this.getFeId())
        const feId = createFeId()
        this.setFeId(feId)
        this.setFeFrom(feFrom)
    }
}