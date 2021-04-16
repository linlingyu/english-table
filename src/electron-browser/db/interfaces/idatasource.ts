export interface ITreeEntity {
    id: string,
    createTime: Date;
    modifyTime: Date;
    parentId: string;
    type: 'root' | 'trunk' | 'leaf'; // trunk leaf
    title: string;
    children?: ITreeEntity[];
}
export interface ITreeEntityOptions {
    id?: string;
    parentId?: string;
    type?: 'root' | 'trunk' | 'leaf'; // trunk leaf
}
// 
export interface ISentenceEntity {
    id: string;
    wordId: string;
    createTime: Date;
    modifyTime: Date;
    enUS: string;
    zhCN: string;
}
export interface IWordEntity {
    id: string;
    treeNodeId: string;
    createTime: Date;
    modifyTime: Date;
    word: string;
}
export interface IWordEntityOptions {
    id?: string;
    treeNodeId?: string;
    word?: string;
}
export interface ISentenceEntityOptions {
    id?: string;
    wordId?: string;
}

export interface IDataSource {
    // 
    findTrees(condition: ITreeEntityOptions): Promise<ITreeEntity[] | undefined>;
    findOneTree(condition: ITreeEntityOptions): Promise<ITreeEntity | undefined>;
    saveTree(title: string, parentId: string): Promise<ITreeEntity>;
    updateTree(id: string, title: string): Promise<ITreeEntity>;
    deleteTrees(ids: string[]): Promise<0 | 1>;
    // 
    findWords(condition: IWordEntityOptions): Promise<IWordEntity[] | undefined>;
    findOneWord(condition: IWordEntityOptions): Promise<IWordEntity | undefined>;
    saveWord(word: string, treeNodeId: string): Promise<IWordEntity>;
    updateWord(id: string, word: string): Promise<IWordEntity>;
    deleteWords(ids: string[]): Promise<0 | 1>;
    // 
    findSentences(condition: ISentenceEntityOptions): Promise<ISentenceEntity[] | undefined>;
    findOneSentence(condition: ISentenceEntityOptions): Promise<ISentenceEntity | undefined>;
    saveSentence(enUS: string, zhCN: string, wordId: string): Promise<ISentenceEntity>;
    updateSentence(id: string, enUS: string, zhCN: string): Promise<ISentenceEntity | undefined>;
    deleteSentences(ids: string[]): Promise<0 | 1>;
}