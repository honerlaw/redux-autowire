import {Action} from "redux";

export interface IRequestAction<T> extends Action<string> {
    payload: T;
}
