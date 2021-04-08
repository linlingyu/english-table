import { dataSource } from "../db/datasource";
import { ISentenceEntity, ISentenceEntityOptions } from "../db/interfaces/idatasource";

export const sentenceService = {
    saveSentence(enUS: string, zhCN: string, wordId: string): Promise<ISentenceEntity> {
        return dataSource.saveSentence(enUS, zhCN, wordId);
    },

    find(condition: ISentenceEntityOptions): Promise<ISentenceEntity[] | undefined> {
        return dataSource.findSentences(condition);
    },

    update(id: string, enUS: string, zhCN: string): Promise<ISentenceEntity | undefined> {
        return dataSource.updateSentence(id, enUS, zhCN);
    },

    delete(ids: string[]): Promise<0 | 1> {
        return dataSource.deleteSentences(ids);
    }
}