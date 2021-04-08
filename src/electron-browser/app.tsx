import React, { useReducer } from "react";
import { AppContext, reducer } from "./store/store";
import { TabLayout } from "./components/layout";
//
export function App(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, {
        type: 'edit',
        selectedKey: undefined
    });
    // return <div>💖 Hello World</div>;
    return <AppContext.Provider value={{state, dispatch}}>
        <TabLayout/>
    </AppContext.Provider>;
}