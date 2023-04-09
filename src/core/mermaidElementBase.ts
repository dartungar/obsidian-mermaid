import { ElementCategory } from "./ElementCategory";
import { IMermaidElement } from "./IMermaidElement";

export class MermaidElementBase implements IMermaidElement {
    id: string = crypto.randomUUID();
    description: string;
    content: string;
    category: ElementCategory;
    sortingOrder: number;
    isPinned: boolean;
}