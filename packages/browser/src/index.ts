import { BaseOptionsType, Plugin } from "@motojs_sdk/types";
import { PartialBrowserPluginConfigType } from "./types"
import { BrowserClient } from "./browserClient";
import { error_plugin } from "./plugins/error";
import { fetch_plugin } from "./plugins/fetch";
import { hash_route_plugin } from "./plugins/hashRoute";
import { history_route_plugin } from "./plugins/historyRoute";
import { performance_plugin } from "./plugins/performance";
import { promise_plugin } from "./plugins/promise";
import { xhr_plugin } from "./plugins/xhr";

const createBrowserInstance = (options: BaseOptionsType, plugins_options?: PartialBrowserPluginConfigType, custom?: Plugin[]): BrowserClient => {
    const defaultPlugins = [
        error_plugin,
        fetch_plugin,
        hash_route_plugin,
        history_route_plugin,
        performance_plugin,
        promise_plugin,
        xhr_plugin
    ]
    const browser = new BrowserClient(options, plugins_options)
    browser.addPlugins([...defaultPlugins, ...(custom || [])] as Plugin[])
    return browser
}

const init = createBrowserInstance
export { init, createBrowserInstance, BrowserClient }
export default createBrowserInstance