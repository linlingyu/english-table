import { dataSource } from "../db/datasource";
import { ITreeEntity, ITreeEntityOptions } from "../db/interfaces/idatasource";
// 

export const treeService = {
    findOne(condition: ITreeEntityOptions): Promise<ITreeEntity | undefined> {
        return dataSource.findOneTree(condition);
    },

    async find(condition: ITreeEntityOptions): Promise<ITreeEntity[] | undefined> {
        const treeEnitties: ITreeEntity[] | undefined = await dataSource.findTrees(condition);
        if (!treeEnitties) { return; }
        for(let i = 0; i < treeEnitties.length; i++) {
            const treeEntity: ITreeEntity = treeEnitties[i],
                children: ITreeEntity[] | undefined = await dataSource.findTrees({parentId: treeEntity.id});
            if (children) {
                treeEntity.children = children;
            }
        }
        return treeEnitties;
    },

    save(title: string, parentId: string): Promise<ITreeEntity> {
        return dataSource.saveTree(title, parentId);
    },

    update(id: string, title: string): Promise<ITreeEntity> {
        return dataSource.updateTree(id, title);
    },

    delete(ids: string[]): Promise<0 | 1> {
        return dataSource.deleteTrees(ids);
    }
};