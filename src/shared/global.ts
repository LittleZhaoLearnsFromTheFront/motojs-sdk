

export const isNodeEnv = typeof process !== 'undefined' ? Object.prototype.toString.call(process) === "[object process]" : false
export const isBrowserEnv = typeof window !== 'undefined' ? Object.prototype.toString.call(window) === "[object Window]" : 0
/**
 * 获取全局变量
 *
 * ../returns Global scope object
 */
export function getGlobal() {
  if (isBrowserEnv) return window as unknown as Window
  // it's true when run e2e
  if (isNodeEnv) return process as unknown as NodeJS.Process
  return window
}
// whether it is right use &
const _global = getGlobal()

export { _global }

// _support.replaceFlag = _support.replaceFlag || {}
// const replaceFlag = _support.replaceFlag
// export function setFlag(replaceType: EventTypes, isSet: boolean): void {
//   if (replaceFlag[replaceType]) return
//   replaceFlag[replaceType] = isSet
// }

// export function getFlag(replaceType: EventTypes): boolean {
//   return replaceFlag[replaceType] ? true : false
// }

export function supportsHistory(): boolean {
  // borrowed from: https://github.com/angular/angular.js/pull/13945/files
  const chrome = (_global as any).chrome
  const isChromePackagedApp = chrome && chrome.app && chrome.app.runtime
  const hasHistoryApi = 'history' in _global && !!_global.history.pushState && !!_global.history.replaceState
  return !isChromePackagedApp && hasHistoryApi
}
