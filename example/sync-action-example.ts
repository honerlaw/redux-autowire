import {ActionHandler} from "../src/action-handler";
import {IRequestAction} from "../src/request-action";

class SyncActionExample extends ActionHandler<any, any, any, any> {

    public constructor() {
        super({
            reducer: "reducerName",
            dispatcherName: "syncDispatcherName",
            selectorName: "syncSelectorName"
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

export const SyncAction: SyncActionExample = new SyncActionExample();
