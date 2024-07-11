import { BrowserEventType, Plugin, PromiseType } from "../../types";
import { on, unknowtoString } from "../../utils";
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