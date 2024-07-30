import { init } from "@motojs_sdk/browser"
import { FunctionParams } from "@motojs_sdk/types"

export type ResultType = ReturnType<typeof init>
export type Args = FunctionParams<typeof init> | ResultType
