import React, { useState } from "react";
import FlexLayout, { TabNode } from 'flexlayout-react';
import { getLayout } from "./defalut-layout";
import { WordEdit } from "./word-edit";
import { TreePaneEdit } from "./tree-pane-edit";

export function Edit(): JSX.Element {
    const [model, setModel] = useState(getLayout('flexlayout:edit'));

    return <FlexLayout.Layout
        model={model}
        factory={(node: TabNode) => node.getName() === 'Word' ? <WordEdit/> : <TreePaneEdit/>}
    />
}