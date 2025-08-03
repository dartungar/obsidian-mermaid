export interface IElementCategory {
    id: string;
    name: string;
    defaultWrapping: string;
    wrappings?: string[] | null;
    isCustom: boolean;
    sortOrder: number;
}

export interface IWrappingData {
    defaultWrapping: string;
    wrappings: string[] | null;
}
