import { dataSource } from "../db/datasource";
import { IWordEntity, IWordEntityOptions, ISentenceEntity } from "../db/interfaces/idatasource";

export const wordService = {
    find(condition: IWordEntityOptions): Promise<IWordEntity[] | undefined> {
        return dataSource.findWords(condition);
    },

    save(word: string, treeNodeId: string): Promise<IWordEntity> {
        return dataSource.saveWord(word, treeNodeId);
    },

    update(id: string, word: string): Promise<IWordEntity> {
        return dataSource.updateWord(id, word);
    },

    delete(id: string): Promise<0 | 1> {
        return dataSource.deleteWords([id]);
    }
}