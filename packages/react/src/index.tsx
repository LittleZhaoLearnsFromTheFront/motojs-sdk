import { init } from "@motojs_sdk/browser"
import { FunctionParams } from "@motojs_sdk/types"
import { FC, ReactNode, createContext } from "react"
import OnReactError from "./OnReactError"

type ResultType = ReturnType<typeof init>
type Args = FunctionParams<typeof init> | ResultType

const SDKContext = createContext<{ browser: ResultType | null }>({ browser: null })
const SDKProvider: FC<{
    theme: Args,
    children: ReactNode
}> = ({ theme, children }) => {
    let browser: ResultType
    if (Array.isArray(theme)) {
        browser = init(...theme)
    } else {
        browser = theme
    }
    return (
        <SDKContext.Provider value={{ browser: browser }}>
            {children}
        </SDKContext.Provider>
    )
}

SDKProvider.prototype.OnReactError = OnReactError


export { SDKProvider, SDKContext }