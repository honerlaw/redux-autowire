export const ASYNC_REDUCER_NAME: string = "async_reducer_name";

export interface IAsyncFailure {
    finishedAt: number;
    failure: any;
}

export interface IAsyncState {
    pending: {
        [key: string]: number;
    };
    failure: {
        [key: string]: IAsyncFailure;
    };
    success: {
        [key: string]: number;
    };
}
