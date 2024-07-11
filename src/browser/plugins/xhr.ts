import { header_sdk_name, header_sdk_version } from "../../shared";
import { Plugin, BrowserEventType, RequestType } from "../../types";
import { on, replaceOld } from "../../utils";
import { BrowserClient } from "../browserClient";
type Result = {
    method: string,
    request_url: string,
    status: number,
    ok: boolean,
    message?: string,
    err?: any
    body?: any
}
export const xhr_plugin: Plugin<BrowserClient> = {
    name: BrowserEventType.Xhr,
    monitor(notify) {
        const originalXhrProto = XMLHttpRequest.prototype
        let result: Result = {
            method: '',
            request_url: '',
            status: 0,
            ok: false,
        }
        const sdk_name = this.SDK_NAME
        const sdk_version = this.SDK_VERSION
        replaceOld(originalXhrProto, 'open', (originalOpen: Function) => {
            return function (this: XMLHttpRequest, method: string, url: string | URL, async?: boolean) {
                result['method'] = method?.toUpperCase() || 'GET'
                result['request_url'] = url as string
                originalOpen.call(this, method, url, async)
            }
        })
        replaceOld(originalXhrProto, 'send', (originalSend: Function) => {
            return function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null | undefined) {
                this.setRequestHeader(header_sdk_name, sdk_name)
                this.setRequestHeader(header_sdk_version, sdk_version)
                if (body) {
                    if (typeof body === 'object') {
                        body = JSON.stringify(body)
                        result['body'] = body
                    } else {
                        result['body'] = body
                    }
                }
                const self = this
                on(this, 'load', function () {
                    const { status, statusText } = self
                    result['status'] = status
                    result['err'] = statusText
                    if (status < 400) return
                    notify(BrowserEventType.Xhr, result)
                })
                originalSend.call(this, body)
            }
        })
    },
    transform(data): RequestType {
        if (data.status === 0) {
            data['messgae'] = '请求失败，请求跨域或者请求超时'
        }
        return data
    },
    consumer(transformedData) {
        this.transport?.send(transformedData)
    },
}