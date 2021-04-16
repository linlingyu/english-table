import { ipcRenderer, IpcRendererEvent } from "electron";
import { dataSource, IDatabase } from "./db/datasource";
import { ISentenceEntity, ITreeEntity, IWordEntity } from "./db/interfaces/idatasource";

export const service = {
    initializeEvent() {
        ipcRenderer.on('EXPORT_DATA', (event: IpcRendererEvent, {filePath}) => {
            service.getAllData().then((data: any) => {
                ipcRenderer.send('EXPORT_DATA-REPLY', {filePath, data});
            });
        });
    },

    getAllData(): Promise<IDatabase> {
        return dataSource.getAllData();
    },

    async import(data: IDatabase): Promise<void> {
        const {tree, word, sentence} = data;
        for(let i = 0; i < tree.length; i++) {
            const item: ITreeEntity = tree[i],
                record: ITreeEntity | undefined = await dataSource.findOneTree({id: item.id});
                if (record) {
                    await dataSource.updateTree(item.id, item.title);
                } else {
                    await dataSource.saveTree(item.title, item.parentId);
                }
        }
        for(let i = 0; i < word.length; i++) {
            const item: IWordEntity = word[i],
                record: IWordEntity | undefined = await dataSource.findOneWord({id: item.id});
                if (record) {
                    await dataSource.updateWord(item.id, item.word);
                } else {
                    await dataSource.saveWord(item.word, item.treeNodeId);
                }
        }
        for(let i = 0; i < sentence.length; i++) {
            const item: ISentenceEntity = sentence[i],
                record: ISentenceEntity | undefined = await dataSource.findOneSentence({id: item.id});
                if (record) {
                    await dataSource.updateSentence(item.id, item.enUS, item.zhCN);
                } else {
                    await dataSource.saveSentence(item.enUS, item.zhCN, item.wordId);
                }
        }
    }
}