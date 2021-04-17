import React, { useContext, useState, useEffect } from "react";
import { Button, Empty, Modal, Form, Input, Table } from "antd";
import { FileAddOutlined, DeleteOutlined, FormOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { AppContext } from "../store/store";
import { Sentence } from "./sentence";
import { IWord } from "./interfaces/iword";
import style from "../assets/less/word-edit.less";
import { wordService } from "../service/word-service";
import { IWordEntity } from "../db/interfaces/idatasource";
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
        [currentWord, setCurrentWord] = useState<IWord>(),
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

    function onSubmit(values: IWord) {
        if (!state.selectedKey) {
            return;
        }
        setLoading(true);
        function onSuccess() {
            loadWords(state.selectedKey);
            setLoading(false);
            setDialogVisible(false);
        }
        if (currentWord) {
            wordService.update(values.key, values.word).then(onSuccess);
        } else {
            wordService.save(values.word, state.selectedKey).then(onSuccess);
        }
    }
    // 
    function onDelete(word: IWord) {
        const modal = Modal.confirm({
            title: 'Delete Word',
            icon: <ExclamationCircleOutlined />,
            content: `Do you want to delete the word: ${word.word}`,
            cancelButtonProps: {disabled: false},
            keyboard: false,
            onOk(): Promise<0 | 1> {
                modal.update({
                    cancelButtonProps: {disabled: true}
                });
                return wordService.delete(word.key)
                    .then(() => {
                        loadWords(state.selectedKey);
                        return 0;
                    });
            }
        });
    }
    // 
    return state.selectedKey ?
        <div className={style.container}>
            <div className={style.operationBar}>
                <Button
                    type="primary"
                    icon={<FileAddOutlined />}
                    onClick={() => {
                        setCurrentWord(undefined);
                        setDialogVisible(true);
                    }}
                >Create Key Word</Button>
            </div>
            <Table
                bordered
                size="small"
                showHeader={false}
                pagination={false}
                dataSource={dataSource}
                expandable={{
                    expandedRowRender: (record: IWord) => {
                        return <Sentence wordId={record.key} />;
                    }
                }}
            >
                <Table.Column title="Key Word" dataIndex="word"/>
                <Table.Column title="Operation" dataIndex="operation" width={80} align="center"
                    render={(value: undefined, record: IWord, index: number) => {
                        return <>
                            <Button
                                size="small"
                                icon={<FormOutlined />}
                                onClick={() => {
                                    setCurrentWord(record);
                                    setDialogVisible(true);
                                }}
                            />
                            <Button
                                danger
                                size="small"
                                type="primary"
                                icon={<DeleteOutlined />}
                                onClick={() => onDelete(record)}
                            />
                        </>
                    }}
                />
            </Table>
            <Modal
                title={currentWord ? 'Edit Word' : 'Create Word'}
                visible={dialogVisible}
                onCancel={() => setDialogVisible(false)}
                footer={null}
                destroyOnClose
            >
                <Form
                    name="word-form"
                    onFinish={onSubmit}
                >
                    <Form.Item name="key" initialValue={currentWord?.key} hidden/>
                    <Form.Item
                        label="key word"
                        name="word"
                        initialValue={currentWord ? currentWord.word : ''}
                        rules={[{
                            required: true,
                            message: 'Please input a word'
                        }]}
                    >
                        <Input placeholder="Input a word" ref={(input: Input | null) => input?.focus()}/>
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