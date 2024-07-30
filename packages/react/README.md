# 使用方式
```typescript
    import { SDKProvider } from "motojs_sdk/react"
     const browser=init({
        key:'motojs_sdk',
        dns:'htttp://127.0.0.1:4000',
    },{
        test:false
    },[
        plugin
    ])
    const App = () => {
        return (
            <SDKProvider theme={browser} onError={true} >
                    <div>测试</div>
            </SDKProvider>
        )
    }
```