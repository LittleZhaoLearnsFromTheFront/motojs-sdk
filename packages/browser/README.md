# 上报参数类型
```typescript
type BaseSendInfo={
  type:string,
  name:string
}

type Error=BaseSendInfo & {
  // 资源加载错误
  resource_msg?: string,
  // 代码执行错误
  err_info?: IAnyObject
}

type Request = BaseSendInfo & {
    method: string,
    //请求地址
    request_url: string,
    //状态码
    status: number,
    ok: boolean,
    //超时或跨域提示
    message?: string,
    err?: any
    //post请求body传参
    body?: any
}

type HashRoute = BaseSendInfo & {
    from: string,
    to: string
}

type HistoryRoute = BaseSendInfo & {
    from: string,
    to: string
}

type Performance = BaseSendInfo & {
    // 白屏时间
    FP: string,
    // 首次渲染时间
    FCP: string,
    // 渲染元素最长时间
    LCP: string,
    // 浏览器宽度
    browserWidth: number,
    // 浏览器高度
    browserHeight: number
}

type Promise = BaseSendInfo & {
    err: string
}
```

# 传递参数
```typescript
type Options={
    //唯一key
    key: string,
    //服务端地址
    dsn: string,
    //是否禁用 默认为false
    disabled?: boolean,
    //行为栈保存最大长度 默认为20
    maxStackLen?: number,
    //是否开启离开页面自动上报行为栈 默认为true
    isLeaveReport?: boolean
}

//配置监控插件是否关闭
type ConfigOptions={
    error?:false,
    fetch?:false,
    hashRoute?:false,
    historyRoute?:false,
    performance?:false,
    promise?:false
    xhr?:false,
    自定义Plugin_Name?:false
}

//初始化时自定义Plugin
type CustomPlugin=Plugin[]

//Plugin
type Plugin<O extends BaseClient = BaseClient> = {
    //Plugin只执行一次
    once?: boolean,
    //Plugin Name
    name: string
    //注册收集事件 notify方法将data数据发送给transform
    monitor: (this: O, notify: (name: string, data: any) => void) => void,
    //进行数据转换 return的数据会给consumer
    transform: (this: O, data: any) => any,
    //进行上报等相对应处理
    consumer: (this: O, transformedData: any) => void
}
```
# 使用方式
```typescript
    import {init} from "motojs-sdk"
    const plugin:Plugin={
        name:'test',
        monitor: (notify)=>{
            notify('test',{name:'test'})
        },
        transform: ( data: any) => {
            retrun {
                type:'test',
                name:'测试',
                ...data
            }
        },
        consumer: ( transformedData: any) => {
            this.transport?.send(transformedData)
        }
    }
    /**
     * 初始化sdk
     * Options 必填
     * ConfigOptions 可选
     * CustomPlugin 可选
     */
    const browser=init({
        key:'motojs_sdk',
        dns:'htttp://127.0.0.1:4000',
    },{
        test:false
    },[
        plugin
    ])

    /**
     * 动态添加Plugin
     */
    browser.addPlugins(plugin) || browser.addPlugins([plugin])
```