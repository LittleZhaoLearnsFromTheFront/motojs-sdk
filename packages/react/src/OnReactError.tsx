import { Component, ReactNode } from "react";
import { Plugin } from "@motojs_sdk/types";
import { ResultType } from "./types";


class OnReactError extends Component<{
    children: ReactNode;
    browser: ResultType
}> {
    constructor(props: any) {
        super(props);
    }
    componentDidCatch(error: any, { componentStack }) {
        const { browser } = this.props;
        const Plugin: Plugin = {
            once: true,
            name: "react",
            monitor(notify) {
                notify("react", {
                    error,
                    componentStack
                })
            },
            transform(data) {
                return data;
            },
            consumer(transformedData) {
                browser?.transport?.send(transformedData)
            }
        }
        browser?.addPlugins(Plugin)
    }
    render() {
        const { children } = this.props
        return children;
    }
}
export default OnReactError