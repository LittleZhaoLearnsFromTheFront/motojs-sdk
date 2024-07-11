import { BaseBreadcrumb } from "../core/baseBreadcrumb";
import { BaseClient } from "../core/baseClient";
import { BaseOptionsType, PartialBrowserPluginConfigType } from "../types";
import { BrowserBreadcrumb } from "./browserBreadcrumb";
import { BrowserTransport } from "./browserTransport";

export class BrowserClient<
    T extends BaseOptionsType = BaseOptionsType,
    O extends PartialBrowserPluginConfigType = PartialBrowserPluginConfigType
> extends BaseClient {

    private plugin_config: O
    transport: BrowserTransport
    breadcrumb: BaseBreadcrumb;
    constructor(options: T, plugin_config?: O) {
        super(options)
        this.plugin_config = plugin_config || {} as O
        this.transport = new BrowserTransport(options)
        this.breadcrumb = new BrowserBreadcrumb(options, this.transport)
    }

    isPluginEnable(name: string): boolean {
        if (this.plugin_config[name as string] === false) return false
        return true
    }
}