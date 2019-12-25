import {applyMiddleware, combineReducers, createStore, Middleware, Reducer, Store} from "redux";
import thunk from "redux-thunk";
import {IRequestAction} from "./request-action";

interface IReducerMap<State> {
    [reducer: string]: Reducer<State, IRequestAction<any>>;
}

const noop: () => void = () => {
    // do nothing, it is a noop
};

/**
 * This manages 2 things
 *
 * 1. The reducer map that is used by the store
 * 2. The correct dispatching of actions to the correct reducers
 */
export class StoreManagerImpl<State> {

    // this map is used to generate the combinedReducer map, so state can be stored in separate objects
    private readonly reducerMap: IReducerMap<State>;

    // this is used to map the action to the reducer to use, so the proper state is passed through
    private readonly actionReducerMap: { [action: string]: Reducer<State, IRequestAction<any>> };

    private store: Store<State>;
    private initialState: State;

    public constructor() {
        this.reducerMap = {};
        this.actionReducerMap = {};

        this.reduce = this.reduce.bind(this);
    }

    public init(initialState: State, middlewares: Middleware[] = [thunk]): void {
        this.initialState = initialState;
        this.store = createStore<any, any, any, any>(noop, applyMiddleware(...middlewares));
    }

    public getStore(): Store<State> {
        return this.store;
    }

    // this will register the action as
    public registerAction(reducerName: string | undefined, actionType: string, reducer: Reducer<State, IRequestAction<any>>): void {
        // no reducer, so do nothing since this may be an async or side effect action
        if (!reducerName) {
            return;
        }

        // add the reducer to the map of reducers we need to maintain
        // this basically is just so that the correct parent reducer is called for each action
        if (!this.reducerMap[reducerName]) {
            this.reducerMap[reducerName] = this.reduce;
        }

        // add the action type to the reducer;
        this.actionReducerMap[actionType] = reducer;

        // replace the
        this.store.replaceReducer(combineReducers<any>(this.reducerMap));
    }

    // this reducer is shared
    private reduce(state: State = this.initialState, action: IRequestAction<any>): State {
        const actionReducer: Reducer<State, IRequestAction<any>> | undefined = this.actionReducerMap[action.type];

        if (!actionReducer) {
            return state;
        }

        return actionReducer(state, action);
    }

}

export const StoreManager: StoreManagerImpl<any> = new StoreManagerImpl<any>();
