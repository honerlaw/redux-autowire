import {ActionHandler, AsyncAction} from "../src/action-handler";
import {AsyncActionFactory} from "../src/async/async-action-factory";
import {IRequestAction} from "../src/request-action";

class AsyncActionExample extends ActionHandler<any, any, any, any> {

    public constructor() {
        super({
            reducer: "reducerName",
            dispatcherName: "asyncDispatcherName",
            selectorName: "asyncSelectorName"
        });
    }

    public buildActionPayloadFromRequest(req: any): AsyncAction {
        return AsyncActionFactory({
            actionType: this.getActionType()
        }, async (): Promise<void> => {
            // do something async, also can dispatch other actions from here
        });
    }

    /**
     * can optionally be overriden
     */
    public reduce(state: any, action: IRequestAction<any>): any {
        return undefined;
    }

    /**
     * can optionally be overriden
     */
    public selector(state: any): any {
        return undefined;
    }

}

export const AsyncActionEx: AsyncActionExample = new AsyncActionExample();
