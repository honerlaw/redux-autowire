import {connect, MapDispatchToPropsNonObject, MapStateToPropsParam, Options} from "react-redux";

type MapToProps = MapStateToPropsParam<any, any, any> | MapDispatchToPropsNonObject<any, any> | undefined;

export interface IMapStateToProps<Map> {
    selector: Map;
}

export interface IMapDispatchToProps<Map> {
    dispatch: Map;
}

export interface IConnectPropsOptions {
    selector?: MapToProps[];
    dispatch?: MapToProps[];
    connectOptions?: Options;
}

export function ConnectProps(options: IConnectPropsOptions): ClassDecorator {
    const opts: Options = { pure: false, ...options.connectOptions};

    let mapStateToProps: any = options.selector ? mergeMapToProps(...options.selector) : null;
    let mapDispatchToProps: any = options.dispatch ? mergeMapToProps(...options.dispatch) : null;

    if (mapStateToProps) {
        mapStateToProps = wrap("selector", mapStateToProps);
    }

    if (mapDispatchToProps) {
        mapDispatchToProps = wrap("dispatch", mapDispatchToProps);
    }

    return connect(mapStateToProps, mapDispatchToProps, null, opts) as any;
}

/**
 * Merges two or more map functions to a single function. This works with both state or dispatch
 *
 * Basically this is a higher order function that takes the map functions, wraps them and when that function is called
 * executates all of the map functions to get the object that is then injected into the props....
 *
 * So returns wrapper function -> when called, calls all the passed map functions -> merges the results of those
 * functions together -> returns the merged results and injects into props
 */
function mergeMapToProps(...mapFunctions: MapToProps[]): MapToProps {
    return (stateOrDispatch: any, ownProps: any): { [key: string]: object } => {
        const mappedFunctions: any[] = mapFunctions.map((mapFunction: MapToProps) => {
            if (!mapFunction) {
                return {};
            }
            return mapFunction(stateOrDispatch, ownProps);
        });

        return Object.assign({}, ...mappedFunctions);
    };
}

/**
 * We want the dispatchers / selectors to live on their own props, this way we don't polluate the entire react props
 * so we create a wrapper function that simply returns the correct prop => selectors / dispatchers map
 */
function wrap(prop: string, mergedMap: MapToProps): MapToProps {
    return (stateOrDispatch: any, ownProps: any): { [key: string]: object } => {
        return {
            [prop]: mergedMap ? mergedMap(stateOrDispatch, ownProps) : null
        };
    };
}
