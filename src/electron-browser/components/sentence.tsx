import { Table, Button, Modal, Form, Input, Descriptions } from "antd";
import React, { useEffect, useState } from "react";
import { ISentence } from "./interfaces/iword";
import style from "../assets/less/sentence.less";
import { DeleteOutlined, FileAddOutlined, FormOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { sentenceService } from "../service/sentence-service";
import { ISentenceEntity } from "../db/interfaces/idatasource";
// 
interface ISentenceProps {
    wordId: string
}

function toSentence(sentenceEntity: ISentenceEntity): ISentence {
    return {
        key: sentenceEntity.id,
        enUS: sentenceEntity.enUS,
        zhCN: sentenceEntity.zhCN
    };
}

export const Sentence: React.FC<ISentenceProps> = (props: ISentenceProps): JSX.Element => {
    const [dataSource, setDataSource] = useState<ISentence[]>([]),
        [dialogVisible, setDialogVisible] = useState<boolean>(false),
        [currentSentence, setCurrentSentence] = useState<ISentence>(),
        [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        loadSentences(props.wordId);
    }, []);

    function loadSentences(wordId: string) {
        sentenceService.find({wordId})
            .then((sentenceEntities: ISentenceEntity[] | undefined) => {
                if (!sentenceEntities) {
                    return;
                }
                setDataSource(sentenceEntities.map((item: ISentenceEntity) => toSentence(item)));
            });
    }

    function onSubmit(values: ISentence) {
        setLoading(true);
        function onSuccess() {
            loadSentences(props.wordId);
            setLoading(false);
            setDialogVisible(false);
        }
        if (currentSentence) {
            sentenceService.update(values.key, values.enUS, values.zhCN)
                .then(onSuccess);
        } else {
            sentenceService.saveSentence(values.enUS, values.zhCN, props.wordId)
                .then(onSuccess);
        }
    }

    function onDelete(sentence: ISentence) {
        const modal = Modal.confirm({
            title: 'This sentence will be delete?',
            icon: <ExclamationCircleOutlined />,
            content: 'Do you want to delete this sentence?',
            cancelButtonProps: {disabled: false},
            keyboard: false,
            onOk(): Promise<0 | 1> {
                modal.update({
                    cancelButtonProps: {disabled: true}
                });
                return sentenceService.delete([sentence.key])
                    .then(() => {
                        loadSentences(props.wordId);
                        return 0;
                    });
            }
        });
    }

    return <div className={style.table}>
        <div className={style.operationBar}>
            <Button
                type="primary"
                icon={<FileAddOutlined />}
                onClick={() => {
                    setCurrentSentence(undefined);
                    setDialogVisible(true);
                }}
            >
                Create Sentence
            </Button>
        </div>
        <Table
            dataSource={dataSource}
            bordered={true}
            showHeader={false}
            pagination={false}
        >
            <Table.Column title="Sentences" key="sentences" dataIndex="sentences"
                render={(value: undefined, record: ISentence, index: number) => {
                    return <Descriptions
                        bordered
                        size="small"
                        column={1}
                    >
                        <Descriptions.Item label="EN:" labelStyle={{width: 50}}>{record.enUS || ''}</Descriptions.Item>
                        <Descriptions.Item label="ZH:">{record.zhCN || ''}</Descriptions.Item>
                    </Descriptions>
                }}
            />
            <Table.Column title="Operation" key="operation" dataIndex="operation" width={80} align="center"
                render={(value: undefined, record: ISentence, index: number) => {
                    return <>
                        <Button
                            size="small"
                            icon={<FormOutlined />}
                            onClick={() => {
                                setCurrentSentence(record);
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
            title={currentSentence ? 'Edit Sentence' : 'Create Sentence'}
            destroyOnClose
            visible={dialogVisible}
            footer={null}
            onCancel={() => setDialogVisible(false)}
        >
            <Form
                name="sentence-form"
                onFinish={onSubmit}
            >
                <Form.Item name="key" initialValue={currentSentence?.key} hidden/>
                <Form.Item
                    label="en"
                    name="enUS"
                    initialValue={currentSentence?.enUS}
                    rules={[{
                        required: true,
                        message: 'Please input an english sentence'
                    }]}
                >
                    <Input.TextArea placeholder="Input an english sentence" ref={(input: Input | null) => input?.focus()} />
                </Form.Item>
                <Form.Item
                    label="zh"
                    name="zhCN"
                    initialValue={currentSentence?.zhCN}
                    rules={[{
                        required: true,
                        message: 'Please input a chinese sentence'
                    }]}
                >
                    <Input.TextArea placeholder="Input a chinese sentence" />
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
    </div>
}