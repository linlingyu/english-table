import React, { useEffect, useReducer, useState } from "react";
import { Spin } from "antd";
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
        ipcRenderer.on('SWITCH_MODE', (event: IpcRendererEvent, args: {mode: string}) => {
            if (state.type === args.mode) {
                return;
            }
            dispatch({
                type: 'UPDATE',
                payload: {type: args.mode}
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