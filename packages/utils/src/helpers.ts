import { connection_symbol, expire_time } from "@motojs_sdk/shared"
/**
 * 绑定事件监听器
 *
 * @param target 目标对象，需要包含 addEventListener 方法
 * @param eventName 事件名称，需要是 WindowEventMap 类型的键
 * @param handler 事件处理函数
 * @param options 是否使用捕获方式或传递事件对象的其他选项，默认为 false
 */
export const on = (target: { addEventListener: Function },
    eventName: keyof WindowEventMap,
    handler: Function,
    opitons: boolean | unknown = false) => {
    target.addEventListener(eventName, handler, opitons)
}

/**
 * 移除目标元素的事件监听器
 *
 * @param target 目标元素，包含 removeEventListener 方法的对象
 * @param eventName 事件名，属于 WindowEventMap 的键
 * @param handler 事件处理函数
 * @param options 可选参数，事件监听器的选项，默认为 false
 */
export const off = (target: { removeEventListener: Function },
    eventName: keyof WindowEventMap,
    handler: Function,
    opitons: boolean | unknown = false) => {
    target.removeEventListener(eventName, handler, opitons)
}

/**
 * 获取当前页面的 URL 地址
 *
 * @returns 返回当前页面的 URL 地址字符串，如果当前环境不是浏览器则返回空字符串
 */
export const getLocationHref = (): string => {
    if (typeof document === 'undefined' || document.location == null) return ''
    return document.location.href
}

/**
 * 获取当前时间戳（毫秒级）
 *
 * @returns 返回当前时间戳
 */
export const getTimestamp = (): number => {
    return Date.now()
}

/**
 * 截取字符串前n个字符，并在原字符串长度大于n时添加提示信息
 *
 * @param str 要截取的字符串
 * @param interceptLength 截取长度
 * @returns 截取后的字符串，如果原字符串长度大于截取长度，则在末尾添加提示信息
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
 * 将未知的类型转化为字符串，number boolear 除外
 * 
 * @param data 
 * @returns 
 */
export const unknowtoString = (data: any) => {
    if (typeof data === 'object' && data !== null) {
        return safeStringify(data)
    }
    return String(data)
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

/**
 * 判断当前环境是否支持历史记录API
 *
 * @returns 如果支持历史记录API则返回true，否则返回false
 */
export const supportsHistory = (): boolean => {
    // borrowed from: https://github.com/angular/angular.js/pull/13945/files
    const chrome = (window as any).chrome
    const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime
    const hasHistoryApi = 'history' in window && !!window.history.pushState && !!window.history.replaceState
    return !isChromePackagedApp && hasHistoryApi
}

/**
 * 判断目标对象是否包含未知属性
 *
 * @param target 目标对象
 * @param name 属性名称
 * @returns 如果目标对象包含未知属性，则返回true；否则返回false
 */
export const targetHasUnknow = (target: any, name: string) => {
    return Reflect.has(target, name) || (name in target)
}

const customAlphabet = (alphabet: string) => {
    return (size: number) => {
        let id = '';
        // A compact alternative for `for (var i = 0; i < step; i++)`.
        let i = size;
        while (i--) {
            // `| 0` is more compact and faster than `Math.floor()`.
            id += alphabet[(Math.random() * alphabet.length) | 0];
        }
        return id;
    };
};

export const nanoid = customAlphabet(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz',
);

/**
 * 生成唯一的FeId
 *
 * @returns 返回一个字符串类型的FeId
 */
export const createFeId = (): string => {
    const t = getTimestamp()
    const r = nanoid(10) + btoa(t.toString())
    const c = connection_symbol
    return r + c + t
}


/**
 * 解析前端ID
 *
 * @param feid 前端ID字符串
 * @returns 包含时间戳和FE Token的对象
 */
export const parseFe = (feId: string = ''): { feTime: number; feToken: string } => {
    const [r1, r2] = feId.split(connection_symbol)
    return {
        feTime: parseInt(r2),
        feToken: r1,
    }
}

/**
 * 格式化 feFrom 字符串
 *
 * @param feFrom 待格式化的 feFrom 字符串
 * @returns 格式化后的 feFrom 字符串
 */
export const formatFeFrom = (feFrom: string): string => {
    if (!feFrom) return ''
    let newFeFrom = feFrom
    const { feTime } = parseFe(feFrom)
    if (!feTime) return newFeFrom
    const time = getTimestamp()
    if (timeDifference(feTime, time) > expire_time) {
        newFeFrom += `${connection_symbol}expire`
    }
    return newFeFrom
}

/**
 * 计算两个时间戳之间的差值（毫秒数）
 *
 * @param time1 第一个时间戳，可以是数字或字符串类型
 * @param time2 第二个时间戳，可以是数字或字符串类型
 * @returns 返回两个时间戳之间的差值（毫秒数）
 */
export const timeDifference = (time1: number | string, time2: number | string) => {
    if (typeof time1 === 'string') time1 = Number(time1)
    if (typeof time2 === 'string') time2 = Number(time2)
    const t1 = new Date(time1).getTime()
    const t2 = new Date(time2).getTime()
    return Math.abs(t1 - t2)
}
