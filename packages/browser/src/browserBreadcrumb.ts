import { BaseOptionsType, IAnyObject } from "@motojs_sdk/types";
import { BaseBreadcrumb } from "@motojs_sdk/core";
import { _global } from "@motojs_sdk/shared";
import { BrowserTransport } from "./browserTransport";
import { behavior_stack_name } from "@motojs_sdk/shared";
import { getLocationHref, getTimestamp, nativeTryCatch, on, safeStringify } from "@motojs_sdk/utils";
import { IndexedDBCache } from "./indexedDBCache";
import { newRequestIdleCallback } from "./utils";
import { BrowserFe } from "./browserFe";

export class BrowserBreadcrumb extends BaseBreadcrumb {
    private fe: BrowserFe
    private db: IndexedDBCache = new IndexedDBCache({
        dbName: 'motojs_sdk',
        tableName: behavior_stack_name,
    })
    private loc = (_global as unknown as { localStorage: WindowLocalStorage['localStorage'] }).localStorage || null
    transport: BrowserTransport

    constructor(options: BaseOptionsType, transport: BrowserTransport, fe: BrowserFe) {
        super()
        this.fe = fe
        this.transport = transport
        this.bindConfig(options.maxStackLen)
        this.init()
    }

    addStack(t: IAnyObject): void {
        const work = (deadline?: IdleDeadline) => {
            if (!deadline || deadline?.timeRemaining() > 2) {
                const triggerTime = getTimestamp()
                const triggerUrl = getLocationHref()
                const tiggerFeId = this.fe.getFeId()
                const tiggerFeFrom = this.fe.getFeFrom()
                const item = { triggerTime, triggerUrl, tiggerFeId, tiggerFeFrom, ...t }
                if (this.db.hasIndexedDB()) {
                    this.indexedDBHandler(item)
                    return
                }
                if (this.loc) {
                    this.localStorageHandler(item)
                    return
                }
                this.report(item)
            }
            newRequestIdleCallback(work)
        }
        newRequestIdleCallback(work)
    }

    private indexedDBHandler(data: IAnyObject) {
        nativeTryCatch(async () => {
            const db = this.db
            const oldData: any[] | undefined = await db.getDataByKey() as any[] | undefined
            if (!oldData?.length) {
                await db.add(data)
                return
            }
            const newData = [...oldData, data]
            if (newData.length <= this.maxStackLen) {
                await db.add(data)
                return
            }
            this.report(oldData)
            await db.clear()
            db.add(data)
        })
    }

    private localStorageHandler(data: IAnyObject) {
        const loc = this.loc
        const oldData = loc.getItem(behavior_stack_name)
        if (!oldData) {
            const newData = [data]
            loc.setItem(behavior_stack_name, safeStringify(newData))
            return
        }
        const oldDataParse = JSON.parse(oldData)
        const newDataParse = [...oldDataParse, data]
        const newDataStringify = safeStringify(newDataParse)
        if (newDataParse.length <= this.maxStackLen) {
            loc.setItem(behavior_stack_name, newDataStringify)
            return
        }
        this.report(oldDataParse)
        loc.removeItem(behavior_stack_name)
        loc.setItem(behavior_stack_name, safeStringify([data]))
    }

    report(data: IAnyObject) {
        this.transport.send(data, 'sendBeacon')
    }

    private init() {
        if (!this.isLeaveReport) return
        if (!('addEventListener' in _global)) return

        const beforeunloadHandler = async () => {
            const db = this.db
            const loc = this.loc
            let data: any[] = []
            if (db.hasIndexedDB()) {
                data = await db.getDataByKey() as any[] | undefined || []
                await db.clear()
                db.closeDB()
            } else if (!!loc) {
                const stringifyData = loc.getItem(behavior_stack_name)
                data = stringifyData ? JSON.parse(stringifyData) : []
                loc.removeItem(behavior_stack_name)
            }
            if (!data.length) return
            this.report(data)
        }
        on(_global, 'beforeunload', beforeunloadHandler)
    }
}