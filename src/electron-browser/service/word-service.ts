import { dataSource } from "../db/datasource";
import { IWordEntity, IWordEntityOptions, ISentenceEntity } from "../db/interfaces/idatasource";

export const wordService = {
    find(condition: IWordEntityOptions): Promise<IWordEntity[] | undefined> {
        return dataSource.findWords(condition);
    },

    save(word: string, treeNodeId: string): Promise<IWordEntity> {
        return dataSource.saveWord(word, treeNodeId);
    }
}