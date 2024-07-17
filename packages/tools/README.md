# 使用方式
```typescript
    /**
     * webpack
     */
    import {MotojsSDKPlugin,chainWebpackMotojsSDK} from "@motojs_sdk/tools"
    plugin:[
        new MotojsSDKPlugin({
            dsn:'服务端地址',
            fields:'字段'
        })
    ]
    或者
    chainWebpack(chain){
        chainWebpackMotojsSDK(chain,{
            dsn:'服务端地址',
            fields:'字段' 
        })
        return chain
    }

    /**
     * vite
     */
    import {viteMotojsSDK} from "@motojs_sdk/tools"
    
    plugin:[
        viteMotojsSDK({
            dsn:'服务端地址',
            fields:'字段'
        })
    ]
```