import { MermaidToolbarItemCategory } from "./MermaidToolbaItemCategory";

export interface IMermaidToolbarItem {
    displayText: string,
    hint: string,
    category: MermaidToolbarItemCategory
    onClick(): void;
}