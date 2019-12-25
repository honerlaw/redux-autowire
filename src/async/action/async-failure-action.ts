import {ActionHandler} from "../../action-handler";
import {IRequestAction} from "../../request-action";
import {ASYNC_REDUCER_NAME, IAsyncFailure, IAsyncState} from "../async-state";

export type AsyncFailureActionSelector = (actionType: string) => IAsyncFailure | undefined;

export interface IAsyncFailureMapStateToProps {
    getAsyncFailure: AsyncFailureActionSelector;
}

export interface IAsyncFailureMapDispatchToProps {
    setAsyncFailure: (req: IAsyncFailureActionPayload) => void;
}

export interface IAsyncFailureActionPayload extends IAsyncFailure {
    actionType: string;
}

class AsyncFailureActionImpl extends ActionHandler<IAsyncState, IAsyncFailureActionPayload, IAsyncFailureActionPayload, AsyncFailureActionSelector> {

    public constructor() {
        super({
            reducer: ASYNC_REDUCER_NAME,
            selectorName: "getAsyncFailure",
            dispatcherName: "setAsyncFailure"
        });
    }

    public reduce(state: IAsyncState, action: IRequestAction<IAsyncFailureActionPayload>): IAsyncState {
        state = this.clone(state);

        if (!state.failure) {
            state.failure = {};
        }

        const actionType: string = action.payload.actionType;
        const finishedAt: number = action.payload.finishedAt;
        const failures: string[] = action.payload.failures;

        if (state.pending) {
            delete state.pending[actionType];
        }
        if (state.success) {
            delete state.success[actionType];
        }
        state.failure[actionType] = {
            finishedAt,
            failures
        };

        return state;
    }

    public selector(state: IAsyncState): AsyncFailureActionSelector {
        return (actionType: string): IAsyncFailure | undefined => {
            return state.failure ? state.failure[actionType] : undefined;
        };
    }

}

export const AsyncFailureAction: AsyncFailureActionImpl = new AsyncFailureActionImpl();
