import { IDataSource, ITreeEntity, ITreeEntityOptions, IWordEntity, IWordEntityOptions, ISentenceEntity, ISentenceEntityOptions } from "./interfaces/idatasource";
import { Low } from "lowdb/lib";
import { AsyncOSSAdaptor } from "./async-oss-adapter";
import _ from 'lodash';
import { nanoid } from "nanoid";
// 
export interface IDatabase {
    tree: ITreeEntity[];
    word: IWordEntity[];
    sentence: ISentenceEntity[];
}
const db: Low<IDatabase> = new Low<IDatabase>(new AsyncOSSAdaptor<IDatabase>());
// 
function getDb(): Promise<_.ObjectChain<IDatabase>> {
    if (db.data) {
        return Promise.resolve(_.chain(db.data));
    }
    // db.data ||= {
    //     tree: [{
    //         id: nanoid(16),
    //         title: 'English',
    //         createTime: Date.now(),
    //         parentId: '',
    //         type: 'root'
    //     }],
    //     word: [],
    //     sentence: []
    // };
    return db.read().then(getDb);
}

export const dataSource: IDataSource = {
    findTrees(condition: ITreeEntityOptions): Promise<ITreeEntity[] | undefined> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => chain.get('tree').filter(condition).value());
    },

    findOneTree(condition: ITreeEntityOptions): Promise<ITreeEntity | undefined> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => chain.get('tree').find(condition).value());
    },
    saveTree(title: string, parentId: string): Promise<ITreeEntity> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => {
                const record: ITreeEntity = {
                    id: nanoid(16),
                    title,
                    parentId,
                    type: 'trunk',
                    createTime: new Date(),
                    modifyTime: new Date()
                };
                chain.get('tree').push(record).value();
                return db.write().then(() => record);
            });
    },
    updateTree(id: string, title): Promise<ITreeEntity> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => {
                chain.get('tree')
                    .find({id})
                    .assign({
                        title,
                        modifyTime: new Date()
                    })
                    .value()
                return db.write().then(() => chain.get('tree').find({id}).value());
            });
    },
    async deleteTrees(ids: string[]): Promise<0 | 1> {
        return getDb()
            .then(async (chain: _.ObjectChain<IDatabase>) => {
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
                chain.get('tree').remove((record: ITreeEntity) => ids.includes(record.id)).value();
                return db.write().then(() => 0);
            });
    },
    // 
    findWords(condition: IWordEntityOptions): Promise<IWordEntity[] | undefined> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => chain.get('word').filter(condition).value());
    },
    findOneWord(condition: IWordEntityOptions): Promise<IWordEntity | undefined> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => chain.get('word').find(condition).value());
    },
    saveWord(word: string, treeNodeId: string): Promise<IWordEntity> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => {
                const record: IWordEntity = {
                    id: nanoid(16),
                    word,
                    treeNodeId,
                    createTime: new Date(),
                    modifyTime: new Date()
                };
                chain.get('word').push(record).value();
                return db.write().then(() => record);
            });
    },
    updateWord(id: string, word: string): Promise<IWordEntity> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => {
                chain.get('word')
                    .find({id})
                    .assign({
                        word,
                        modifyTime: new Date()
                    })
                    .value();
                return db.write().then(() => chain.get('word').find({id}).value());
            });
    },
    async deleteWords(ids: string[]): Promise<0 | 1> {
        return getDb()
            .then(async (chain: _.ObjectChain<IDatabase>) => {
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
                chain.get('word').remove((record: IWordEntity) => ids.includes(record.id)).value();
                return db.write().then(() => 0);
            });
    },
    // 
    findSentences(condition: ISentenceEntityOptions): Promise<ISentenceEntity[] | undefined> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => chain.get('sentence').filter(condition).value());
    },
    findOneSentence(condition: ISentenceEntityOptions): Promise<ISentenceEntity | undefined> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => chain.get('sentence').find(condition).value());
    },
    saveSentence(enUS: string, zhCN: string, wordId: string): Promise<ISentenceEntity> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => {
                const record: ISentenceEntity = {
                    id: nanoid(16),
                    enUS,
                    zhCN,
                    wordId,
                    createTime: new Date(),
                    modifyTime: new Date()
                };
                chain.get('sentence').push(record).value();
                return db.write().then(() => record);
            });
    },
    updateSentence(id: string, enUS: string, zhCN: string): Promise<ISentenceEntity | undefined> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => {
                chain.get('sentence')
                    .find({id})
                    .assign({
                        enUS,
                        zhCN,
                        modifyTime: new Date()
                    })
                    .value();
                return db.write().then(() => chain.get('sentence').find({id}).value());
            });
    },
    deleteSentences(ids: string[]): Promise<0 | 1> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => {
                chain.get('sentence').remove((record: ISentenceEntity) => ids.includes(record.id)).value();
                return db.write().then(() => 0);
            });
    },
    // 
    getAllData(): Promise<IDatabase> {
        return getDb()
            .then((chain: _.ObjectChain<IDatabase>) => chain.toJSON());
    }
};
