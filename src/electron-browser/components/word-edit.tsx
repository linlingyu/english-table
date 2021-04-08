import { Button, Empty, Modal, Form, Input, Table } from "antd";
import { FileAddOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useContext, useState, Key, useEffect } from "react";
import { AppContext } from "../store/store";
import { Sentence } from "./sentence";
import { ISentence, IWord } from "./interfaces/iword";
import style from "../assets/less/word-edit.less";
import { wordService } from "../service/word-service";
import { ISentenceEntity, IWordEntity } from "../db/interfaces/idatasource";
// 
function toWord(wordEntity: IWordEntity): IWord {
    return {
        key: wordEntity.id,
        word: wordEntity.word
    };
}
// 
export function WordEdit(): JSX.Element {
    const {state} = useContext(AppContext),
        [dialogVisible, setDialogVisible] = useState<boolean>(false),
        [loading, setLoading] = useState<boolean>(false),
        [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]),
        [dataSource, setDataSource] = useState<IWord[]>([]);
    // 
    useEffect(() => {
        loadWords(state.selectedKey);
    }, [state.selectedKey]);

    function loadWords(selectedKey: string | undefined) {
        selectedKey && wordService.find({treeNodeId: selectedKey})
            .then((wordEntities: IWordEntity[] | undefined) => {
                if (!wordEntities) {
                    return;
                }
                setDataSource(wordEntities.map((item: IWordEntity) => toWord(item)));
            });
    }

    function onSubmitWrodForm(values: {word: string}) {
        if (!state.selectedKey) {
            return;
        }
        setLoading(true);
        wordService.save(values.word, state.selectedKey)
            .then(() => {
                loadWords(state.selectedKey);
                setLoading(false);
                setDialogVisible(false);
            });

    }

    const rowSelection = {
        selectedRowKeys,
        onChange(selectedRowKeys: Key[]) {
            setSelectedRowKeys(selectedRowKeys);
        }
    };
    // 
    return state.selectedKey ?
        <div className={style.container}>
            <div className={style.operationBar}>
                <Button icon={<FileAddOutlined />} onClick={() => setDialogVisible(true)}/>
                <Button icon={<DeleteOutlined />}/>
            </div>
            <Table
                dataSource={dataSource}
                rowSelection={rowSelection}
                expandable={{
                    expandedRowRender: (record: IWord) => {
                        return <Sentence wordId={record.key} />;
                    }
                }}
            >
                <Table.Column title="Key Word" dataIndex="word"/>
            </Table>
            <Modal
                title="Create a word"
                visible={dialogVisible}
                onCancel={() => setDialogVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form
                    name="node-name"
                    onFinish={onSubmitWrodForm}
                >
                    <Form.Item
                        label="key word"
                        name="word"
                        rules={[{
                            required: true,
                            message: 'Please input a word'
                        }]}
                    >
                        <Input placeholder="Input a word"/>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div> : <div className={style.containerEmpty}><Empty description={false}/></div>
}