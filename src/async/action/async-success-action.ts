import {ActionHandler} from "../../action-handler";
import {IRequestAction} from "../../request-action";
import {ASYNC_REDUCER_NAME, IAsyncState} from "../async-state";

export type AsyncSuccessActionSelector = (actionType: string) => number | undefined;

export interface IAsyncSuccessMapStateToProps {
    getAsyncSuccess: AsyncSuccessActionSelector;
}

export interface IAsyncSuccessMapDispatchToProps {
    setAsyncSuccess: (req: IAsyncSuccessActionPayload) => void;
}

export interface IAsyncSuccessActionPayload {
    actionType: string;
    finishedAt: number;
}

class AsyncSuccessActionImpl extends ActionHandler<IAsyncState, IAsyncSuccessActionPayload, IAsyncSuccessActionPayload, AsyncSuccessActionSelector> {

    public constructor() {
        super({
            reducer: ASYNC_REDUCER_NAME,
            selectorName: "getAsyncSuccess",
            dispatcherName: "setAsyncSuccess"
        });
    }

    public reduce(state: IAsyncState, action: IRequestAction<IAsyncSuccessActionPayload>): IAsyncState {
        state = this.clone(state);

        if (!state.success) {
            state.success = {};
        }

        const actionType: string = action.payload.actionType;
        const finishedAt: number = action.payload.finishedAt;

        if (state.pending) {
            delete state.pending[actionType];
        }
        if (state.failure) {
            delete state.failure[actionType];
        }
        state.success[actionType] = finishedAt;

        return state;
    }

    public selector(state: IAsyncState): AsyncSuccessActionSelector {
        return (actionType: string): number | undefined => {
            return state.success ? state.success[actionType] : undefined;
        };
    }

}

export const AsyncSuccessAction: AsyncSuccessActionImpl = new AsyncSuccessActionImpl();
