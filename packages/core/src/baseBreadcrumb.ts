import { IAnyObject } from "@motojs_sdk/types";
import { BaseTransport } from "./baseTransport";

export abstract class BaseBreadcrumb {
    maxStackLen: number = 20
    isLeaveReport: boolean = true
    abstract transport: BaseTransport
    constructor() { }

    bindConfig(maxStackLen?: number, isLeaveReport?: boolean) {
        this.maxStackLen = maxStackLen ?? 20
        this.isLeaveReport = isLeaveReport ?? true
    }

    abstract addStack(t: IAnyObject): void

    abstract report(data: any): void;
}