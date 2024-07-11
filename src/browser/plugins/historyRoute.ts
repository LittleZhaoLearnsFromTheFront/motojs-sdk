import { Plugin, BrowserEventType, HistoryRouteType } from "../../types";
import { getLocationHref, replaceOld, supportsHistory } from "../../utils";
import { BrowserClient } from "../browserClient";

type Result = {
    from: string,
    to: string
}

export const history_route_plugin: Plugin<BrowserClient> = {
    name: BrowserEventType.HistoryRoute,
    monitor(notify) {
        if (!supportsHistory()) return
        let lastHref: string
        const oldOnpopstate = window.onpopstate
        window.onpopstate = function (this: any, ...args: any) {
            const to = getLocationHref()
            const from = lastHref
            lastHref = to
            notify(BrowserEventType.HistoryRoute, {
                from,
                to
            } as Result)
            oldOnpopstate && oldOnpopstate.apply(this, args)
        }
        function historyReplaceFn(originalHistoryFn) {
            return function (this: History, ...args: any[]): void {
                const url = location.origin + (args.length > 2 ? args[2] : '/')
                if (url) {
                    const from = lastHref
                    const to = String(url)
                    lastHref = to
                    notify(BrowserEventType.HistoryRoute, {
                        from,
                        to
                    } as Result)
                }
                return originalHistoryFn.apply(this, args)
            }
        }
        // 以下两个事件是人为调用，但是不触发onpopstate
        replaceOld(window.history, 'pushState', historyReplaceFn)
        replaceOld(window.history, 'replaceState', historyReplaceFn)
    },
    transform(data: Result): HistoryRouteType {
        return {
            type: BrowserEventType.HistoryRoute,
            name: 'history路由跳转',
            ...data
        }
    },
    consumer(transformedData) {
        if (transformedData.from === transformedData.to) return
        this.breadcrumb.addStack(transformedData)
    },
}   