import {Dispatch} from "redux";
import {ThunkDispatch} from "redux-thunk";
import {IRequestAction} from "./request-action";
import {StoreManager} from "./store-manager";

export type ActionHandlerDispatcher<T extends IRequestAction<any> = any> = ThunkDispatch<{}, {}, T> | Dispatch<T>;

export type AsyncAction = (dispatch: ActionHandlerDispatcher) => Promise<void>;

export interface IActionHandlerOptions {
    reducer?: string; // the reducer that will handle the dispatched action and where the state is allocated
    selectorName?: string; // the name we use for the selector (e.g. this.props.{selectorName})
    dispatcherName?: string; // the name we use for the dispatcher (e.g. this.props.{dispatcherName})
}

export abstract class ActionHandler<State, RequestActionPayload, ActionRequest, Selector> {

    private readonly options: IActionHandlerOptions;
    private readonly type: string;

    protected constructor(options: IActionHandlerOptions = {}) {
        this.options = options;

        this.type = this.constructor.name;

        this.mapDispatchToProp = this.mapDispatchToProp.bind(this);
        this.mapStateToProp = this.mapStateToProp.bind(this);

        StoreManager.registerAction(this.options.reducer, this.getActionType(), this.reduce.bind(this));
    }

    /**
     * Can be overriden to handle setting state given the action
     */
    public reduce(state: State, action: IRequestAction<RequestActionPayload>): State {
        return state;
    }

    /**
     * Can be overriden to return the correct state for the given selector
     */
    public selector(state: State): Selector {
        return undefined;
    }

    /**
     * Can be overriden to handle custom action payloads
     */
    public buildActionPayloadFromRequest(req: ActionRequest): ActionRequest | RequestActionPayload | AsyncAction {
        return req;
    }

    /**
     * For the most part, we can always assume this is how a mapDispatchToProp would work for any given action
     */
    public mapDispatchToProp(dispatch: ActionHandlerDispatcher): { [key: string]: (req: ActionRequest) => void } {
        if (!this.options.dispatcherName) {
            return {};
        }

        return {
            [this.options.dispatcherName]: (req: ActionRequest): void => {
                dispatch(this.buildAction(req));
            }
        };
    }

    /**
     * For the most part, we can always assume that this is how mapStateToProp would work for any given action
     *
     * We know that the entire app state is always given to us here, we also know that reducers can only be a single
     * level down, so we know that we can always get the correct reducer state to pass and map the props back
     */
    public mapStateToProp(state: any): { [key: string]: Selector | null } {
        if (!this.options.reducer || !this.options.selectorName) {
            return {};
        }

        // we know that reducer is the name of the value on the state, and that State represents that entire reducer
        const reducerState: State = state[this.options.reducer];

        return {
            [this.options.selectorName]: this.selector(reducerState)
        };
    }

    public buildAction(req: ActionRequest): IRequestAction<RequestActionPayload | ActionRequest> | AsyncAction {
        const payload: ActionRequest | RequestActionPayload | AsyncAction = this.buildActionPayloadFromRequest(req);

        if (typeof payload === "function") {
            return payload as AsyncAction;
        }

        return {
            type: this.getActionType(),
            payload
        };
    }

    /**
     * Does a deep clone
     *
     * @todo potentially replace this with something that could handle functions and such
     */
    public clone<T>(value: T): T {
        return JSON.parse(JSON.stringify(value));
    }

    public getActionType(): string {
        return `${this.options.reducer}_${this.type}`;
    }

}
