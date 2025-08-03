import { IMermaidElement } from "./IMermaidElement";

export class MermaidElementBase implements IMermaidElement {
    id: string = crypto.randomUUID();
    description: string;
    content: string;
    categoryId: string;
    sortingOrder: number;
    isPinned: boolean;
}