import { Queue } from "./queue"

export abstract class BaseTransport {
    key = ''
    dsn = ''
    private queue: Queue


    constructor() {
        this.queue = new Queue()
    }

    bindOptions(key: string, dsn: string) {
        this.key = key
        this.dsn = dsn
    }

    send(data: any, type: 'image' | 'sendBeacon' | 'request' = 'image', method: 'GET' | 'POST' = 'GET') {
        if (!this.dsn || typeof this.dsn !== 'string') {
            console.error('dsn is empty,pass in when initializing please')
        }
        this.queue.addStack(() => this.sendToServer(data, type, method))
    }

    abstract sendToServer(data: any, type: 'image' | 'sendBeacon' | 'request', method?: 'GET' | 'POST'): void;

    abstract imageSend(data: any): void;

    abstract request(data: any, method?: 'GET' | 'POST'): void;
    // web定制请求
    abstract sendBeacon(data: any): void;

}