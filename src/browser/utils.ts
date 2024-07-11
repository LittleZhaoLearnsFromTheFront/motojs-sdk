export const newRequestIdleCallback = (callback: (...arg: any[]) => void) => {
    if (!!requestIdleCallback!) {
        requestIdleCallback(callback)
    } else {
        setTimeout(callback)
    }
}