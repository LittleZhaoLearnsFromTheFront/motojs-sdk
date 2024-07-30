import { init } from "@motojs_sdk/browser"
import { FC, ReactNode, createContext, createElement } from "react"
import OnReactError from "./OnReactError"
import { Args, ResultType } from "./types"


const SDKContext = createContext<{ browser: ResultType | null }>({ browser: null })
const SDKProvider: FC<{
    theme: Args,
    onError?: boolean
    children: ReactNode
}> = ({ theme, children, onError = true }) => {
    let browser: ResultType
    if (Array.isArray(theme)) {
        browser = init(...theme)
    } else {
        browser = theme
    }
    return createElement(
        SDKContext.Provider,
        { value: { browser } },
        onError ? createElement(OnReactError, { browser }, children) : children
    )
}

export { SDKProvider, SDKContext }