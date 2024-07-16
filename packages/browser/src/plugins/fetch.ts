import { header_sdk_flag, header_sdk_name, header_sdk_version } from "@motojs_sdk/shared";
import { BrowserEventType, RequestType } from "../types";
import { Plugin } from "@motojs_sdk/types";
import { replaceOld } from "@motojs_sdk/utils";
import { BrowserClient } from "../browserClient";

type Result = {
    method: string,
    request_url: string,
    status: number,
    ok: boolean,
    message?: string,
    err?: any
}

export const fetch_plugin: Plugin<BrowserClient> = {
    name: BrowserEventType.Fetch,
    monitor(notify) {
        const replacement = (originalFetch: Function) => {
            return (url: string, config: Partial<Request> = {}) => {
                const headers = {
                    ...config.headers,
                    [header_sdk_name]: this.SDK_NAME,
                    [header_sdk_version]: this.SDK_VERSION,
                }
                const newConfig = Object.assign(config, { headers })
                return originalFetch.call(window, url, newConfig).then((res: Response) => {
                    if (newConfig.headers?.[header_sdk_flag] === 'true') return res
                    if (res.ok) return res
                    const result: Result = {
                        method: config.method ? config.method.toUpperCase() : 'GET',
                        request_url: res.url || url,
                        status: res.status || 0,
                        ok: res.ok
                    }
                    const body = config['body']
                    if (!!body) {
                        if (typeof body === 'object') {
                            const obj: { [key in string]: any } = {};
                            (body as unknown as { forEach: (callback: (value: string | File, key: string) => void) => void })?.forEach((value, key) => {
                                obj[key] = value
                            })
                            result['body'] = obj
                        } else {
                            result['body'] = body
                        }
                    }
                    notify(BrowserEventType.Fetch, result)
                    return res
                }, (e) => {
                    const result: Result = {
                        method: config.method ? config.method.toUpperCase() : 'GET',
                        request_url: url,
                        status: 0,
                        ok: false,
                        err: e
                    }
                    notify(BrowserEventType.Fetch, result)
                })
            }
        }
        replaceOld(window, 'fetch', replacement)
    },
    transform(data: Result): RequestType {
        if (data.status === 0) {
            data['messgae'] = '请求失败，请求跨域或者请求超时'
        }
        return {
            type: BrowserEventType.Fetch,
            name: 'fetch请求',
            ...data
        }
    },
    consumer(transformedData) {
        this.transport?.send(transformedData)
    },
}