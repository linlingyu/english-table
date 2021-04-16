import React, { useState, useEffect } from "react";
import { Collapse } from "antd";
import { ISentence } from "./interfaces/iword";
import { sentenceService } from "../service/sentence-service";
import { ISentenceEntity } from "../db/interfaces/idatasource";
import style from "../assets/less/sentence-table.less";
// 
interface ISentenceProps {
    wordId: string
}
// 
function toSentence(sentenceEntity: ISentenceEntity): ISentence {
    return {
        key: sentenceEntity.id,
        enUS: sentenceEntity.enUS,
        zhCN: sentenceEntity.zhCN
    };
}
// 
export const SentenceTable: React.FC<ISentenceProps> = (props: ISentenceProps): JSX.Element => {
    const [dataSource, setDataSource] = useState<ISentence[]>([]);
    // 
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

    return <div className={style.container}>
        <Collapse>
            {
                dataSource.map((item: ISentence) =>
                    <Collapse.Panel header={item.zhCN} key={item.key}>
                        <p>{item.enUS}</p>
                    </Collapse.Panel>
                )
            }
        </Collapse>
    </div>;
};