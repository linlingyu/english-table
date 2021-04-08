import { Table, Button, Modal, Form, Input, } from "antd";
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

    function onModify(values: ISentence) {
        setLoading(true);
        sentenceService.update(values.key, values.enUS, values.zhCN)
            .then(() => {
                setLoading(false);
                loadSentences(props.wordId);
                setDialogVisible(false);
            });
    }

    function onCreate() {
        sentenceService.saveSentence('', '', props.wordId)
            .then(() => loadSentences(props.wordId));
    }

    function onDelete(sentence: ISentence) {
        const modal = Modal.confirm({
            title: 'This sentence will be delete?',
            icon: <ExclamationCircleOutlined />,
            cancelButtonProps: {disabled: false},
            content: 'Do you want to delete this sentence?',
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
            <Button icon={<FileAddOutlined />} onClick={onCreate}/>
        </div>
        <Table
            dataSource={dataSource}
            bordered={true}
        >
            <Table.Column title="Sentences" key="Sentences"
                render={(value: ISentence) => {
                    return <>
                        <div className={style.sentenceItem}>en: {value.enUS || 'none'}</div>
                        <div className={style.sentenceItem}>zh: {value.zhCN || 'none'}</div>
                    </>;
                }}
            />
            <Table.Column title="Operation" key="operation" width={50} align="center"
                render={(value: ISentence, record: any, index: number) => {
                    return <>
                        <Button
                            size="small"
                            icon={<FormOutlined />}
                            onClick={() => {
                                setCurrentSentence(value);
                                setDialogVisible(true);
                            }}
                        />
                        <Button
                            danger
                            size="small"
                            type="primary"
                            icon={<DeleteOutlined />}
                            onClick={() => onDelete(value)}
                        />
                    </>
                }}
            />
        </Table>
        <Modal
            title="Modify Sentence"
            destroyOnClose
            visible={dialogVisible}
            footer={null}
            onCancel={() => setDialogVisible(false)}
        >
            <Form
                onFinish={onModify}
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
                    <Input.TextArea placeholder="Input an english sentence" />
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