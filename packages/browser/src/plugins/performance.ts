import {  BrowserEventType, PerformanceType } from "../types";
import {Plugin} from "@motojs_sdk/types"
import { targetHasUnknow } from "@motojs_sdk/utils";
import { BrowserClient } from "../browserClient";

type Result = {
    FP: string,
    FCP: string,
    LCP: string
    browserHeight: number,
    browserWidth: number
}

export const performance_plugin: Plugin<BrowserClient> = {
    name: BrowserEventType.Performance,
    monitor(notify) {
        const browserHeight = window.innerHeight
        const browserWidth = window.innerWidth
        const size = { browserHeight, browserWidth }
        if (!targetHasUnknow(window, 'PerformanceObserver')) {
            notify(BrowserEventType.Performance, size)
            return
        }
        const entryObj: Result = { FCP: '', LCP: '', FP: '', ...size }
        const entryMap = {
            'first-paint': 'FP',
            'first-contentful-paint': 'FCP',
            'largest-contentful-paint': 'LCP'
        }
        const entryHandler: PerformanceObserverCallback = (list) => {
            for (const entry of list.getEntries()) {
                const entryMapValue = entryMap[entry.name] || entryMap[entry.entryType]
                if (!entryMapValue) continue;
                entryObj[entryMapValue] = entry.startTime
            }
            const values = Object.values(entryObj)
            if (!values.every(t => !!t)) return
            notify(BrowserEventType.Performance, entryObj)
            observer.disconnect()
        }

        const observer = new PerformanceObserver(entryHandler)
        // buffered 属性表示是否观察缓存数据，也就是说观察代码添加时机比事情触发时机晚也没关系。
        // largest-contentful-paint LCP 是最大内容渲染完成时触发
        // paint  FCP 只要任意内容绘制完成就触发
        observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'], buffered: true })
    },
    transform(data: Result): PerformanceType {
        return {
            type: BrowserEventType.Performance,
            name: '性能相关',
            ...data
        }
    },
    consumer(transformedData) {
        this.breadcrumb.addStack(transformedData)
    },

}