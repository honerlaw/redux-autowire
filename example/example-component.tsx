import * as React from "react";
import {ConnectProps} from "../src/decorator/connect-props";
import {AsyncActionEx} from "./async-action-example";

@ConnectProps({
    selector: [AsyncActionEx.mapStateToProp],
    dispatch: [AsyncActionEx.mapDispatchToProp]
})
export class ExampleComponent extends React.Component<{}, {}> {

    public render(): JSX.Element {
        return <button onClick={() => this.props.dispatch.asyncDispatcherName()}>
            {this.props.selector.asyncSelectorName}
        </button>;
    }

}
