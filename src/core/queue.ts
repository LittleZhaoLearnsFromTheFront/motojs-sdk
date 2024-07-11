import { _global } from "../shared/global"

export class Queue {
    private readonly micro?: Promise<void>
    private stack: Function[] = []
    private isFlushing = false
    constructor() {
        if (!('Promise' in _global)) return
        this.micro = Promise.resolve()
    }

    addStack(fn: Function) {
        if (!('Promise' in _global)) {
            fn()
            return
        }
        this.stack.push(fn)
        if (this.isFlushing) return
        this.isFlushing = true
        this.micro?.then(() => this.flushStack())
    }

    clear() {
        this.stack = []
    }

    flushStack() {
        const temp = this.stack.slice(0)
        this.stack.length = 0
        this.isFlushing = false
        for (const fn of temp) {
            fn()
        }
    }
}