import { ElementCategory } from "./ElementCategory";

export interface IMermaidElement {
    id: string,
    description: string,
    content: string,
    category: ElementCategory,
    sortingOrder: number,
    isPinned: boolean
}