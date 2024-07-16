import { BaseClient } from "@motojs_sdk/core"

export type Plugin<O extends BaseClient = BaseClient> = {
    once?: boolean,
    name: string
    monitor: (this: O, notify: (name: string, data: any) => void) => void,
    transform: (this: O, data: any) => any,
    consumer: (this: O, transformedData: any) => void
}