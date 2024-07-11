import { BaseTransport } from "../core/baseTransport";
import { header_sdk_flag } from "../shared";
import { _global } from "../shared/global";
import { BaseOptionsType } from "../types";
import { getLocationHref, getTimestamp, safeStringify } from "../utils";
import { newRequestIdleCallback } from "./utils";

export class BrowserTransport extends BaseTransport {
    constructor(options: BaseOptionsType) {
        super()
        this.bindOptions(options.key, options.dsn)
    }

    sendToServer(data: any, type: "image" | "sendBeacon" | "request", method: "GET" | "POST"): void {
        const time = getTimestamp()
        const location = getLocationHref()
        const newData = { key: this.key, time, location, result: data }
        const stringifyData = encodeURIComponent(safeStringify(newData))
        const work = (deadline?: IdleDeadline) => {
            if (!deadline || deadline.timeRemaining() > 1) {
                if (type === 'image') {
                    this.imageSend(stringifyData)
                    return
                }
                if (type === 'sendBeacon') {
                    this.sendBeacon(stringifyData)
                    return
                }
                if (type === 'request') {
                    this.request(safeStringify, method)
                }
                console.error('type is not inludes ["image","sendBeacon","request"]');
                return
            }
            newRequestIdleCallback(work)
        }
        newRequestIdleCallback(work)
    }

    imageSend(data: any): void {
        const dsn = this.dsn
        let image = new Image()
        const spliceStr = dsn.indexOf('?') === -1 ? '?' : '&'
        image.src = `${dsn}${spliceStr}data=${data}`
        image = null!
    }

    sendBeacon(data: any): void {
        if (!('navigator' in _global)) {
            console.error('navigator is not defined');
            this.request(data, 'POST')
            return
        }
        const dsn = this.dsn
        navigator.sendBeacon(dsn, data)
    }

    request(data: any, method?: "GET" | "POST" | undefined): void {
        if (!('fetch' in _global)) {
            console.error('fetch is not defined');
            return
        }
        const dsn = this.dsn

        fetch(dsn, {
            headers: {
                "Content-Type": 'application/json;charset=UTF-8',
                [header_sdk_flag]: 'true'
            },
            method,
            [method === 'GET' ? 'query' : 'body']: data
        })
    }
}