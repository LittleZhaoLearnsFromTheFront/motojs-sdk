import { Plugin, BrowserEventType, ErrorType } from "../../types";
import { interceptStr, on } from "../../utils";
import { BrowserClient } from "../browserClient";
export interface ResourceErrorTarget {
    src?: string
    href?: string
    localName?: string
}
export const error_plugin: Plugin<BrowserClient> = {
    name: BrowserEventType.Error,
    monitor(notify) {
        on(window, 'error', (e: ErrorEvent) => {
            notify(BrowserEventType.Error, e)
        }, true)
    },
    transform(data: ErrorEvent): ErrorType {
        const target = data.target as ResourceErrorTarget
        if (target.localName) {
            // resource error
            return resourceTransform(data.target as ResourceErrorTarget)
        }
        // code error
        return codeErrorTransform(data)
    },
    consumer(transformedData) {
        this.transport.send(transformedData, 'image')
    },
}

const resourceMap = {
    img: '图片',
    script: 'JS脚本'
}

const resourceTransform = (target: ResourceErrorTarget): ErrorType => {
    return {
        type: `load-${BrowserEventType.Error}`,
        resource_msg: '资源地址: ' + (interceptStr(target.src ?? '', 120) || interceptStr(target.href ?? '', 120)),
        name: `${resourceMap[target.localName as string] || target.localName}加载失败`
    }
}

const codeErrorTransform = (errorEvent: ErrorEvent): ErrorType => {
    const { message, filename, lineno, colno, error } = errorEvent
    return {
        type: `exec-${BrowserEventType.Error}`,
        name: '代码执行错误',
        err_info: {
            message,
            filename,
            lineno,
            colno,
            error
        }
    }
}