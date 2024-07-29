import { Component, ReactNode, useContext } from "react";
import { SDKContext } from ".";
import { Plugin } from "@motojs_sdk/types";

class OnReactError extends Component<{
    children: ReactNode;
}> {
    constructor(props: any) {
        super(props);
    }
    static browser = useContext(SDKContext).browser
    componentDidCatch(error) {
        const Plugin: Plugin = {
            once: true,
            name: "react",
            monitor(notify) {
                notify("react", {
                    error
                })
            },
            transform(data) {
                return data;
            },
            consumer(transformedData) {
                OnReactError.browser?.transport?.send(transformedData)
            }
        }
        OnReactError.browser?.addPlugins(Plugin)
    }
    render() {
        const { children } = this.props
        return children;
    }
}
export default OnReactError