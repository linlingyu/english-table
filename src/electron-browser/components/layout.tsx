import React, { useContext, RefObject } from "react";
import { AppContext } from "../store/store";
import { Edit } from "./edit";
import { View } from "./view";
import "antd/dist/antd.dark.css";
import "flexlayout_style/dark.css";
import style from "../assets/less/layout.less";
// 
export function TabLayout(): JSX.Element {
    const {state, dispatch} = useContext(AppContext);
    return state.type === 'view' ? <View/> : <Edit/>;
}