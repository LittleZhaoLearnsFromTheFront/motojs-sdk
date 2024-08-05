import { _global } from "@motojs_sdk/shared";
import { IAnyObject } from "@motojs_sdk/types";

export const newRequestIdleCallback = (callback: (...arg: any[]) => void) => {
    if (!!requestIdleCallback!) {
        requestIdleCallback(callback)
    } else {
        setTimeout(callback)
    }
}

export const getSearchParmams = (key?: string, url?: string) => {
    if (!('location' in _global && 'search' in _global.location)) return null;
    const search = url || _global.location.search;
    if (!search) return null;
    const searchParams = new URLSearchParams(search);
    if (!key) {
        const obj: IAnyObject = {};
        searchParams.forEach((value, key) => {
            obj[key] = value;
        })
        return obj;
    }
    return searchParams.get(key);
}