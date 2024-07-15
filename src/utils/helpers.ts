export const on = (target: { addEventListener: Function },
    eventName: keyof WindowEventMap,
    handler: Function,
    opitons: boolean | unknown = false) => {
    target.addEventListener(eventName, handler, opitons)
}

export const off = (target: { removeEventListener: Function },
    eventName: keyof WindowEventMap,
    handler: Function,
    opitons: boolean | unknown = false) => {
    target.removeEventListener(eventName, handler, opitons)
}

export const getLocationHref = (): string => {
    if (typeof document === 'undefined' || document.location == null) return ''
    return document.location.href
}

export const getTimestamp = (): number => {
    return Date.now()
}

/**
 * 取一定数量的字符串，超出的则不展示
 * @param str 
 * @param interceptLength 
 * @returns 
 */
export const interceptStr = (str: string, interceptLength: number): string => {
    if (typeof str === 'string') {
        return str.slice(0, interceptLength) + (str.length > interceptLength ? `;slice the first ${interceptLength} characters` : '')
    }
    return ''
}

/**
 * 安全的转换对象，包括循环引用，如果是循环引用就返回Loop
 *
 * @export
 * @param {object} obj 需要转换的对象
 * @return {*}  {string}
 */
export const safeStringify = (obj: object): string => {
    const set = new Set()
    const str = JSON.stringify(obj, function (_key, value) {
        if (value in File) return 'File'
        if (set.has(value)) {
            return 'Loop'
        }
        typeof value === 'object' && set.add(value)
        return value
    })
    set.clear()
    return str
}

/**
 * 进行校验网址是否合法
 * @param url 
 * @returns 
 */
export const validateUrl = (url: string) => {
    if (!url) return false
    const regUrl = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+(:\d{1,5})?$/

    return regUrl.test(url) || true
}

/**
 * 将未知的类型转化为字符串，number boolear 除外
 * @param data 
 * @returns 
 */
export const unknowtoString = (data: any) => {
    if (typeof data === 'object' && data !== null) {
        return safeStringify(data)
    }
    return data
}
/**
 * 重写一些内置方法
 * @param source 
 * @param name 
 * @param replacement 
 * @param isForce 
 * @returns 
 */
export const replaceOld = <T>(source: T, name: keyof T, replacement: (...args: any[]) => any, isForce?: boolean) => {
    if (!source) return
    if (Reflect.has(source, name) || isForce) {
        const original = source[name]
        const wrapped = replacement(original)
        if (typeof wrapped === 'function') {
            source[name] = wrapped
        }
    }
}

/**
 * 返回包含id、class、innerTextde字符串的标签
 * @param target html节点
 */
export const htmlElementAsString = (target: HTMLElement): string => {
    const tagName = target.tagName.toLowerCase()
    if (tagName === 'body') {
        return ''
    }
    let classNames = target.classList.value
    classNames = classNames !== '' ? ` class="${classNames}"` : ''
    const id = target.id ? ` id="${target.id}"` : ''
    const innerText = target.innerText
    return `<${tagName}${id}${classNames !== '' ? classNames : ''}>${innerText}</${tagName}>`
}

export const supportsHistory = (): boolean => {
    // borrowed from: https://github.com/angular/angular.js/pull/13945/files
    const chrome = (window as any).chrome
    const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime
    const hasHistoryApi = 'history' in window && !!window.history.pushState && !!window.history.replaceState
    return !isChromePackagedApp && hasHistoryApi
}

export const targetHasUnknow = (target: any, name: string) => {
    return Reflect.has(target, name) || (name in target)
}
