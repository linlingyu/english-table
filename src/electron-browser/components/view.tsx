import React, { useState } from "react";
import { getLayout } from "./defalut-layout";
import FlexLayout, { TabNode } from 'flexlayout-react';
import { WordView } from "./word-view";
import { TreePaneView } from './tree-pane-view';

export function View(): JSX.Element {
    const [model, setModel] = useState(getLayout('flexlayout:view'));

    return <FlexLayout.Layout
        model={model}
        factory={(node: TabNode) => node.getName() === 'Word' ? <WordView/> : <TreePaneView/>}
    />
}