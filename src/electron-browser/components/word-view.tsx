import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../store/store";
import { Button, Table } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { wordService } from "../service/word-service";
import { IWord } from "./interfaces/iword";
import { IWordEntity } from "../db/interfaces/idatasource";
import { SentenceTable } from "./sentence-table";
// 
import style from "../assets/less/word-view.less";
// 
function toWord(wordEntity: IWordEntity): IWord {
    return {
        key: wordEntity.id,
        word: wordEntity.word,
        show: false
    };
}
// 
export function WordView(): JSX.Element {
    const {state} = useContext(AppContext),
        [dataSource, setDataSource] = useState<IWord[]>([]);

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
    function onSetWordVisible(record: IWord) {
        record.show = !record.show;
        setDataSource([...dataSource]);
    }

    return <div className={style.container}>
        <Table
            bordered
            size="small"
            showHeader={false}
            pagination={false}
            dataSource={dataSource}
        >
            <Table.Column title="Key Word" render={(value: undefined, record: IWord, index: number) => {
                return <>
                    <Button icon={record.show ? <EyeInvisibleOutlined /> : <EyeOutlined />} size="small" onClick={() => onSetWordVisible(record)}/>&nbsp;&nbsp;
                    {record.show ? record.word : '******' }
                    <SentenceTable wordId={record.key} />
                </>;
            }}/>
        </Table>
    </div>;
}