import { sdk_name, sdk_version } from "../shared";
import { BaseClientType, BaseOptionsType, Plugin } from "../types";
import { BaseTransport } from "./baseTransport";
import { BaseBreadcrumb } from "./baseBreadcrumb";
import { Subscribe } from "./subscribe";

export abstract class BaseClient<T extends BaseOptionsType = BaseOptionsType> implements BaseClientType {
    SDK_NAME = sdk_name
    SDK_VERSION = sdk_version
    options: T
    private plugins: Plugin[] = []
    abstract transport: BaseTransport
    abstract breadcrumb: BaseBreadcrumb
    constructor(options: T) {
        this.options = options
        console.log(`当前版本号:${this.SDK_VERSION}，当前版本名:${this.SDK_NAME}`);
    }

    addPlugins(it: Plugin | Plugin[]) {
        if (Array.isArray(it)) {
            this.plugins = [...this.plugins, ...it]
            this.use()
            return
        }
        this.plugins = [...this.plugins, it]
        this.use()
    }

    private clearPlugins() {
        this.plugins = []

    }

    /**
    * 注册plugin
    */
    private use() {
        if (this.options.disabled) return
        const plugins = this.plugins
        const subscribe = new Subscribe()
        plugins.forEach(it => {
            if (!it.name) return
            if (!this.isPluginEnable(it.name)) return
            const handler = (data: any, name: any) => {
                const newData = it.transform.call(this, data)
                it.consumer.call(this, typeof newData === 'object' ? { type: name, ...(newData || {}) } : { type: name, data: newData })
            }
            it.once ? subscribe.once(it.name, handler) : subscribe.sub(it.name, handler)
            it.monitor.call(this, subscribe.pub.bind(subscribe))
        })
        this.clearPlugins()
    }

    /**
  * 判断当前插件是否启用，每个端的可选字段不同，需要子类实现
  *
  * @abstract
  * @param {EventTypes} name
  * @return {*}  {boolean}
  * @memberof BaseClient
  */
    abstract isPluginEnable(name: string): boolean

    getOptions() {
        return this.options
    }

}