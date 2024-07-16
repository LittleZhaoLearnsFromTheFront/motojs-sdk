import { BrowserEventType, PromiseType } from "../types";
import { Plugin } from "@motojs_sdk/types"
import { on, unknowtoString } from "@motojs_sdk/utils";
import { BrowserClient } from "../browserClient";

export const promise_plugin: Plugin<BrowserClient> = {
    name: BrowserEventType.Promise,
    monitor(notify) {
        on(window, 'unhandledrejection', (e) => {
            notify(BrowserEventType.Promise, e)
        })
    },
    transform(data: any): PromiseType {
        const result = {
            type: BrowserEventType.Promise,
            name: 'promise错误',
            err: unknowtoString(data.reason)
        }
        return result

    },
    consumer(transformedData: any) {
        this.transport?.send(transformedData)
    },
}