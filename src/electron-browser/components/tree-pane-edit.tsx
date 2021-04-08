import React, { useEffect, useState, Key, useContext } from "react";
import { Button, Tree, Modal, Form, Input } from "antd";
import { FolderAddOutlined, DeleteOutlined, FolderOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import style from "../assets/less/tree-pane-edit.less";
import { treeService } from "../service/tree-service";
import { ITreeEntity } from "../db/interfaces/idatasource";
import { ITreeNode } from "./interfaces/itree";
import { utility } from "../utility/utility";
import { AppContext } from "../store/store";
// 
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
export function TreePaneEdit(): JSX.Element {
    const {dispatch} = useContext(AppContext),
        [treeData, setTreeData] = useState<ITreeNode[]>([{
            title: 'English',
            key: 'root',
            disableCheckbox: true
        }]),
        [selectedKeys, setSelectedKeys] = useState<Key[]>([]),
        [checkedKeys, setCheckedKeys] = useState<Key[] | {checked: Key[]; halfChecked: Key[]}>([]),
        [dialogVisible, setDialogVisible] = useState<boolean>(false),
        [dialogTitle, setDialogTitle] = useState<string>('');
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
    function deleteTreeNodes(treeNodes: ITreeNode[], deletedKeys: string[]): ITreeNode[] {
        return treeNodes.filter((treeNode: ITreeNode) => {
            const index: number = deletedKeys.indexOf(treeNode.key);
            if (~index) {
                deletedKeys.splice(index, 1);
            }
            if (!~index && treeNode.children) {
                treeNode.children = deleteTreeNodes(treeNode.children, deletedKeys);
            }
            return !~index;
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
    function onCheck(checkedKeys: Key[] | {checked: Key[]; halfChecked: Key[]}, info: any) {
        setCheckedKeys(checkedKeys);
    }

    function onAdd() {
        const selectedNode: Key | undefined = utility.lastItem(selectedKeys);
        if (!selectedNode) {
            Modal.warning({
                title: 'No node was selected.',
                content: 'Please select a node at first.'
            });
            return;
        }
        // 
        setDialogTitle('Add a node');
        setDialogVisible(true);
    }
    function onDelete() {
        const checkedKeyArray: string[] = checkedKeys as string[];
        if (!checkedKeyArray.length) {
            Modal.info({
                title: 'No node was checked.',
                content: 'Please check some nodes at first'
            });
            return;
        }
        const modal = Modal.confirm({
            title: 'Some nodes will be delete?',
            icon: <ExclamationCircleOutlined />,
            cancelButtonProps: {disabled: false},
            content: 'Do you want to delete these nodes?',
            keyboard: false,
            onOk(): Promise<0 | 1> {
                modal.update({
                    cancelButtonProps: {disabled: true}
                });
                return treeService.delete(checkedKeyArray).then(() => {
                    setTreeData(deleteTreeNodes(treeData, checkedKeyArray));
                    return 0;
                });
            }
        });
        // 
    }
    function onSubmitNodeNameForm({name}: any) {
        const parentId: string = utility.lastItem(selectedKeys) as string;
        treeService.save(name, parentId)
            .then((treeEntity: ITreeEntity) => {
                onLoadData({key: treeEntity.parentId});
                setDialogVisible(false);
            });
    }
    return <div className={style.container}>
        <div className={style.operation}>
            <Button type="link" icon={<FolderAddOutlined />} onClick={onAdd} />
            <Button type="link" icon={<DeleteOutlined />} onClick={onDelete}/>
        </div>
        <div className={style.treePanel}>
            <Tree
                checkable
                showIcon
                loadData={onLoadData}
                treeData={treeData}
                selectedKeys={selectedKeys}
                onSelect={onSelect}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
            />
        </div>
        <Modal
            title={dialogTitle}
            visible={dialogVisible}
            onCancel={() => setDialogVisible(false)}
            footer={null}
            destroyOnClose
        >
            <Form
                name="node-name"
                onFinish={onSubmitNodeNameForm}
            >
                <Form.Item
                    label="name"
                    name="name"
                    rules={[{
                        required: true,
                        message: 'Please input a name'
                    }]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                    >Submit</Button>
                </Form.Item>
            </Form>
        </Modal>
    </div>;
}