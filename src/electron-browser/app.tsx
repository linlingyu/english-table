import React, { useEffect, useReducer } from "react";
import { AppContext, reducer } from "./store/store";
import { TabLayout } from "./components/layout";
import { ipcRenderer, IpcRendererEvent } from "electron";
import { service } from "./service";
// 

export function App(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, {
            type: 'view',
            selectedKey: undefined
        });
    // 
    useEffect(() => {
        service.initializeEvent();
        // 
        ipcRenderer.on('SWITCH_MODE', (event: IpcRendererEvent, {mode}) => {
            dispatch({
                type: 'UPDATE',
                payload: {type: mode}
            });
        });
        // 
        ipcRenderer.on('IMPORT_DATA', (event: IpcRendererEvent, {data}) => {
            service.import(data);
            ipcRenderer.send('IMPORT_DATA-REPLY');
        });
    }, []);
    // return <div>💖 Hello World</div>;
    return <AppContext.Provider value={{state, dispatch}}>
        <TabLayout/>
    </AppContext.Provider>;
}