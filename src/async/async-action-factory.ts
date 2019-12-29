import {ActionHandlerDispatcher} from "../action-handler";
import {AsyncFailureAction} from "./action/async-failure-action";
import {AsyncPendingAction} from "./action/async-pending-action";
import {AsyncSuccessAction} from "./action/async-success-action";

export type AsyncAction = (dispatch: ActionHandlerDispatcher) => Promise<void>;

export type ActionRequestCallback = (resp: Response | null, dispatch: ActionHandlerDispatcher) => Promise<void>;

export interface IActionRequestOptions {
    actionType: string;
    request?: {
        handler: (url: string, init?: RequestInit) => Promise<Response>;
        url: string;
        init?: RequestInit;
    };
}

export function AsyncActionFactory(options: IActionRequestOptions, callback?: ActionRequestCallback): AsyncAction {
    return async (dispatch: ActionHandlerDispatcher): Promise<void> => {
        dispatch(AsyncPendingAction.buildAction({
            actionType: options.actionType,
            startedAt: Date.now()
        }));

        try {
            let resp: Response | null = null;

            if (options.request) {
                resp = await options.request.handler(options.request.url, options.request.init);
            }

            if (callback) {
                await callback(resp, dispatch);
            } else {

                // there is no callback defined, so lets go ahead and handle the resp / error ourselves
                // assume this is a failure of some sort
                if (resp && (resp.status < 200 || resp.status >= 300)) {
                    await handleFailureErrorFromResponse(resp, options.actionType, dispatch);
                    return;
                }
            }

            dispatch(AsyncSuccessAction.buildAction({
                actionType: options.actionType,
                finishedAt: Date.now()
            }));
        } catch (err) {
            dispatch(AsyncFailureAction.buildAction({
                actionType: options.actionType,
                finishedAt: Date.now(),
                failure: [err.message]
            }));
        }
    };
}

async function handleFailureErrorFromResponse(resp: Response, actionType: string, dispatch: ActionHandlerDispatcher): Promise<any> {
    let failure: any = null;

    // @todo handle different response types other than just json
    try {
        failure = await resp.json();
    } catch (err) {
        failure = err.message;
    }
    dispatch(AsyncFailureAction.buildAction({
        actionType,
        finishedAt: Date.now(),
        failure
    }));
}
