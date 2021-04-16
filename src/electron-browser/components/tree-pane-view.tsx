import React, { useContext, useState, useEffect, Key } from "react";
import { Tree } from "antd";
import { FolderOutlined } from "@ant-design/icons";
import { ITreeNode } from "./interfaces/itree";
import { treeService } from "../service/tree-service";
import { ITreeEntity } from "../db/interfaces/idatasource";
import { AppContext } from "../store/store";
import { utility } from "../utility/utility";

function toTreeNode(treeEntity: ITreeEntity): ITreeNode {
    const treeNode: ITreeNode = {
        key: treeEntity.id,
        title: treeEntity.title,
        icon: <FolderOutlined />
    };
    if (treeEntity.children) {
        treeNode.children = treeEntity.children.map((item: ITreeEntity) => toTreeNode(item));
    }
    return treeNode;
}
// 
export function TreePaneView(): JSX.Element {
    const {dispatch} = useContext(AppContext),
        [treeData, setTreeData] = useState<ITreeNode[]>([{
        title: 'English',
        key: 'root',
        disableCheckbox: true
    }]),
    [selectedKeys, setSelectedKeys] = useState<Key[]>([]);
    // 
    useEffect(() => {
        treeService.findOne({type: 'root'})
            .then((root: ITreeEntity | undefined) => {
                if (!root) {return;}
                setTreeData([{...toTreeNode(root), disableCheckbox: true}]);
                setSelectedKeys([root.id]);
            });
    }, []);
    function updateTreeData(treeNodes: ITreeNode[], key: string, children: ITreeNode[]): ITreeNode[] {
        return treeNodes.map((treeNode: ITreeNode) => {
            if (treeNode.key === key) {
                return {
                    ...treeNode,
                    children,
                };
            }
            if (treeNode.children) {
                return {
                    ...treeNode,
                    children: updateTreeData(treeNode.children, key, children)
                }
            }
            return treeNode;
        });
    }
    async function onLoadData({key, children}: any) {
        if (children) {
            return;
        }
        const treeEntities: ITreeEntity[] = await treeService.find({parentId: key}) || [];
        setTreeData((origin: ITreeNode[]) => updateTreeData(origin, key, treeEntities.map((treeEntity: ITreeEntity) => toTreeNode(treeEntity))));
    }
    function onSelect(keys: Key[], info: any) {
        setSelectedKeys(keys);
        dispatch({type: 'UPDATE', payload: {selectedKey: utility.lastItem(keys)}})
    }
    // 
    return <Tree.DirectoryTree
        loadData={onLoadData}
        treeData={treeData}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
    />
}