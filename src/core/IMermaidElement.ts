import { ElementCategory } from "./ElementCategory";

export interface IMermaidElement {
    description: string,
    content: string,
    category: ElementCategory,
    sortingOrder: number,
    isPinned: boolean
}