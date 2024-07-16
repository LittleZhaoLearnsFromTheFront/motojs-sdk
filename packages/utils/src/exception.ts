/**
 * 原生try函数
 * ../param fn try中执行的函数体
 * ../param errorFn 报错时执行的函数体，将err传入
 */
export const nativeTryCatch = (fn: () => void, errorFn?: (err: any) => void): void => {
  try {
    fn()
  } catch (err) {
    console.error('出错啦～！', err);
    if (errorFn) {
      errorFn(err)
    }
  }
}
