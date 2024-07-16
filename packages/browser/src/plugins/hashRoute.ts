import { Plugin } from "@motojs_sdk/types";
import { BrowserEventType, HashRouteType } from "../types"
import { on, targetHasUnknow } from "@motojs_sdk/utils";
import { BrowserClient } from "../browserClient";

type Result = {
    from: string,
    to: string
}

export const hash_route_plugin: Plugin<BrowserClient> = {
    name: BrowserEventType.HashRoute,
    monitor(notify) {
        if (!targetHasUnknow(window, 'onpopstate')) return
        on(window, 'hashchange', (e: HashChangeEvent) => {
            const { oldURL: from, newURL: to } = e
            const result: Result = {
                from,
                to
            }
            notify(BrowserEventType.HashRoute, result)
        })
    },
    transform(data: Result): HashRouteType {
        return {
            type: BrowserEventType.HistoryRoute,
            name: 'hash路由跳转',
            ...data
        }
    },
    consumer(transformedData) {
        if (transformedData.from === transformedData.to) return
        this.breadcrumb.addStack(transformedData)
    },
}