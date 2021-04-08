export interface ITreeNode {
    title: string;
    key: string;
    disableCheckbox?: boolean;
    icon?: JSX.Element,
    isLeaf?: boolean;
    children?: ITreeNode[];
}