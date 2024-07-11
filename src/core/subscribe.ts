import { nativeTryCatch } from "../utils"
type MonitorCallback = (data: any) => void

export class Subscribe<T> {
    private list: Map<T, MonitorCallback[]> = new Map()

    sub(name: T, handler: MonitorCallback) {
        const list = this.list
        if (!list.has(name)) {
            list.set(name, [handler])
            return
        }
        const curList = list.get(name) ?? []
        list.set(name, [...curList, handler])
    }

    pub(name: T, data: any) {
        const handlers = this.list.get(name)
        if (!handlers?.length) {
            console.log('暂无可执行event_name,' + 'event_name:' + name);
            return
        }
        nativeTryCatch(() => {
            handlers.forEach(t => {
                t(data)
            })
        })
    }

    once(name: T, handler: MonitorCallback) {
        const newHandler: MonitorCallback = (data: any) => {
            handler(data)
            this.clear(name, newHandler)
        }
        const list = this.list
        if (!list.has(name)) {
            list.set(name, [newHandler])
            return
        }
        const curList = list.get(name) ?? []
        list.set(name, [...curList, newHandler])
    }

    clear(name: T, handler: MonitorCallback) {
        if (!this.list.has(name)) {
            return
        }
        const oldHandlers = this.list.get(name)
        const newHandlers = oldHandlers?.filter(it => it !== handler)
        this.list.set(name, newHandlers ?? [])
    }
}


