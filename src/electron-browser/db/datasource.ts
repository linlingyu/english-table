import path from "path";
import { IDataSource, ITreeEntity, ITreeEntityOptions, IWordEntity, IWordEntityOptions, ISentenceEntity, ISentenceEntityOptions } from "./interfaces/idatasource";
import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { nanoid } from "nanoid";
// 
export interface IDatabase {
    tree: ITreeEntity[];
    word: IWordEntity[];
    sentence: ISentenceEntity[];
}

const db = low(new FileSync<IDatabase>(path.join(__dirname, 'db.json')));
db.defaults({
    tree: [{
        id: nanoid(16),
        title: 'English',
        createTime: Date.now(),
        parentId: undefined,
        type: 'root'
    }],
    word: [],
    sentence: []
}).write();

export const dataSource: IDataSource = {
    findTrees(condition: ITreeEntityOptions): Promise<ITreeEntity[] | undefined> {
        return Promise.resolve(db.get('tree').filter(condition).value());
    },

    findOneTree(condition: ITreeEntityOptions): Promise<ITreeEntity | undefined> {
        return Promise.resolve(db.get('tree').find(condition).value());
    },
    saveTree(title: string, parentId: string): Promise<ITreeEntity> {
        const record: ITreeEntity = {
            id: nanoid(16),
            title,
            parentId,
            type: 'trunk',
            createTime: new Date(),
            modifyTime: new Date()
        }
        db.get('tree').push(record).write();
        return Promise.resolve(record);
    },
    updateTree(id: string, title): Promise<ITreeEntity> {
        db.get('tree')
            .find({id})
            .assign({
                title,
                modifyTime: new Date()
            })
            .write();
        return Promise.resolve(db.get('tree').find({id}).value());
    },
    async deleteTrees(ids: string[]): Promise<0 | 1> {
        let words: IWordEntity[] = [];
        for(let i = 0; i < words.length; i++) {
            const children: IWordEntity[] | undefined = await this.findWords({treeNodeId: ids[i]});
            if (!children) {
                continue;
            }
            words = words.concat(children);
        }
        const code: 0 | 1 = await this.deleteWords(words.map((item: IWordEntity) => item.id));
        if (code) {
            return code;
        }
        db.get('tree').remove((record: ITreeEntity) => ids.includes(record.id)).write();
        return 0;
    },
    // 
    findWords(condition: IWordEntityOptions): Promise<IWordEntity[] | undefined> {
        return Promise.resolve(db.get('word').filter(condition).value());
    },
    findOneWord(condition: IWordEntityOptions): Promise<IWordEntity | undefined> {
        return Promise.resolve(db.get('word').find(condition).value());
    },
    saveWord(word: string, treeNodeId: string): Promise<IWordEntity> {
        const record: IWordEntity = {
            id: nanoid(16),
            word,
            treeNodeId,
            createTime: new Date(),
            modifyTime: new Date()
        }
        db.get('word').push(record).write();
        return Promise.resolve(record);
    },
    updateWord(id: string, word: string): Promise<IWordEntity> {
        db.get('word')
            .find({id})
            .assign({
                word,
                modifyTime: new Date()
            })
            .write();
        return Promise.resolve(db.get('word').find({id}).value());
    },
    async deleteWords(ids: string[]): Promise<0 | 1> {
        let sentences: ISentenceEntity[] = [];
        for(let i = 0; i < ids.length; i++) {
            const children: ISentenceEntity[] | undefined = await this.findSentences({wordId: ids[i]});
            if (!children) {
                continue;
            }
            // 
            sentences = sentences.concat(children);
        }
        const code: 0 | 1 = await this.deleteSentences(sentences.map((item: ISentenceEntity) => item.id));
        if (code) {
            return code;
        }
        db.get('word').remove((record: IWordEntity) => ids.includes(record.id)).write();
        return 0;
    },
    // 
    findSentences(condition: ISentenceEntityOptions): Promise<ISentenceEntity[] | undefined> {
        return Promise.resolve(db.get('sentence').filter(condition).value());
    },
    findOneSentence(condition: ISentenceEntityOptions): Promise<ISentenceEntity | undefined> {
        return Promise.resolve(db.get('sentence').find(condition).value());
    },
    saveSentence(enUS: string, zhCN: string, wordId: string): Promise<ISentenceEntity> {
        const record: ISentenceEntity = {
            id: nanoid(16),
            enUS,
            zhCN,
            wordId,
            createTime: new Date(),
            modifyTime: new Date()
        }
        db.get('sentence').push(record).write();
        return Promise.resolve(record);
    },
    updateSentence(id: string, enUS: string, zhCN: string): Promise<ISentenceEntity | undefined> {
        db.get('sentence')
            .find({id})
            .assign({
                enUS,
                zhCN,
                modifyTime: new Date()
            })
            .write();
        return Promise.resolve(db.get('sentence').find({id}).value());
    },
    deleteSentences(ids: string[]): Promise<0 | 1> {
        db.get('sentence').remove((record: ISentenceEntity) => ids.includes(record.id)).write();
        return Promise.resolve(0);
    },
    // 
    getAllData(): Promise<IDatabase> {
        const data: IDatabase = db.getState();
        return Promise.resolve(data);
    }
};
