import {ActionHandler} from "../../action-handler";
import {IRequestAction} from "../../request-action";
import {ASYNC_REDUCER_NAME, IAsyncState} from "../async-state";

export type AsyncPendingActionSelector = (actionType: string) => undefined | number;

export interface IAsyncPendingMapStateToProps {
    getAsyncPending: AsyncPendingActionSelector;
}

export interface IAsyncPendingMapDispatchToProps {
    setAsyncPending: (req: IAsyncPendingActionPayload) => void;
}

export interface IAsyncPendingActionPayload {
    actionType: string;
    startedAt: number;
}

class AsyncPendingActionImpl extends ActionHandler<IAsyncState, IAsyncPendingActionPayload, IAsyncPendingActionPayload, AsyncPendingActionSelector> {

    public constructor() {
        super({
            reducer: ASYNC_REDUCER_NAME,
            selectorName: "getAsyncPending",
            dispatcherName: "setAsyncPending"
        });
    }

    public reduce(state: IAsyncState, action: IRequestAction<IAsyncPendingActionPayload>): IAsyncState {
        state = this.clone(state);

        if (!state.pending) {
            state.pending = {};
        }

        const actionType: string = action.payload.actionType;
        const startedAt: number = action.payload.startedAt;

        if (state.failure) {
            delete state.failure[actionType];
        }
        if (state.success) {
            delete state.success[actionType];
        }
        state.pending[actionType] = startedAt;

        return state;
    }

    public selector(state: IAsyncState): AsyncPendingActionSelector {
        return (actionType: string): undefined | number => {
            return state.pending ? state.pending[actionType] : undefined;
        };
    }

}

export const AsyncPendingAction: AsyncPendingActionImpl = new AsyncPendingActionImpl();
