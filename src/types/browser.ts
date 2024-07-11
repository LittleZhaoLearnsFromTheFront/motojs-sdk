import { IAnyObject } from "./base"

export enum BrowserEventType {
    Error = 'error',
    Fetch = 'fetch',
    Xhr = 'xhr',
    Promise = 'promise',
    HashRoute = 'hashRoute',
    HistoryRoute = 'historyRoute',
    Performance = 'performance'
}

export type BrowserPluginConfigType = Record<BrowserEventType, boolean>
export type PartialBrowserPluginConfigType = Partial<Record<BrowserEventType, false>>

type BaseSendInfo = {
    type: string, //与name一致
    name: string,
}

export type ErrorType = BaseSendInfo & {
    resource_msg?: string,
    err_info?: IAnyObject
}

export type RequestType = BaseSendInfo & {
    method: string,
    request_url: string,
    status: number,
    ok: boolean,
    message?: string,
    err?: any
    body?: any
}

export type HashRouteType = BaseSendInfo & {
    from: string,
    to: string
}
export type HistoryRouteType = BaseSendInfo & {
    from: string,
    to: string
}

export type PerformanceType = BaseSendInfo & {
    FP: string,
    FCP: string,
    LCP: string,
    browserWidth: number,
    browserHeight: number
}
export type PromiseType = BaseSendInfo & {
    err: string
}
