import { IAction } from "./interfaces/iaction";
import { Dispatch, Context, createContext } from "react";

export interface IState {
    type: string;
    selectedKey: string | undefined;
}
export interface IRedux {
    state: IState;
    dispatch: Dispatch<IAction>;
}
// // default value
// export const initialState: IState = {
//     type: 'view'
// }
// 
export function reducer(state: IState, action: IAction): IState {
    let newState: IState = {...state};
    switch(action.type) {
        case 'UPDATE':
            newState = {...state, ...action.payload};
            break;
        default:
            break;
    }
    return newState;
}
export const AppContext: Context<IRedux> = createContext({} as IRedux);