import { sampleDiagrams } from "src/elements/sampleDiagrams";
import { defaultElements } from "../elements/defaultElements"
import { IMermaidElement } from "./IMermaidElement";
import { CategoryService } from "./categoryService";
import MermaidPlugin from "main";

export class MermaidElementService {
    private categoryService: CategoryService;

    constructor() {
        this.categoryService = CategoryService.getInstance();
    }

    static DefaultElements(): IMermaidElement[] {
        return defaultElements;
    }

    public async saveElement(element: IMermaidElement, plugin: MermaidPlugin): Promise<void> {

        const existingElement = plugin.settings.elements.find(el => el.id === element.id);
        const elementExists = existingElement !== undefined;

        if (elementExists) {
            if (existingElement.categoryId !== element.categoryId) {
                this.fixSortOrder(element, plugin);
            }

            const index = plugin.settings.elements.findIndex(el => el.id === element.id);
            if (index !== -1) {
                plugin.settings.elements[index] = element;
            }

        } else {
            this.fixSortOrder(element, plugin);
            plugin.settings.elements.push(element);
        }

        await plugin.saveSettings();       
    }

    public fixSortOrder(element: IMermaidElement, plugin: MermaidPlugin) {
        const elementsFromSameCategory = plugin.settings.elements.filter(el => el.categoryId === element.categoryId);
        if (elementsFromSameCategory.some(el => el.sortingOrder === element.sortingOrder)) {
            element.sortingOrder = elementsFromSameCategory.length;
        }
    }

    public getSampleDiagram(categoryId: string): string {
        // Try to get sample diagram by category ID, fallback to category name for backward compatibility
        const category = this.categoryService.getCategoryById(categoryId);
        if (!category) {
            return this.wrapForPastingIntoEditor(this.wrapWithMermaidBlock("flowchart TD\nStart --> End"));
        }
        
        const sampleKey = category.name as keyof typeof sampleDiagrams;
        const sample = sampleDiagrams[sampleKey];
        if (sample) {
            return this.wrapForPastingIntoEditor(this.wrapWithMermaidBlock(sample));
        }
        
        // Default sample
        return this.wrapForPastingIntoEditor(this.wrapWithMermaidBlock("flowchart TD\nStart --> End"));
    }

    public wrapForPastingIntoEditor(text: string): string {
        return `${text}\n`
    }

    public wrapWithMermaidBlock(text: string): string {
        return `\`\`\`mermaid\n${text}\n\`\`\``;
    }

    public wrapAsCompleteDiagram(element: IMermaidElement): string {
        const wrapping = this.categoryService.getWrappingData(element.categoryId);
        if (!wrapping) {
            return element.content;
        }
        
        // Check if content already contains the wrapping
        const contentAlreadyWrapped = wrapping.wrappings
                ? wrapping.wrappings.some(w => element.content.includes(w))
                : element.content.includes(wrapping.defaultWrapping);
                
        if (contentAlreadyWrapped) {
            return element.content;
        }
        
        // Add the default wrapping
        const wrappedContent = wrapping.defaultWrapping + "\n" + element.content;
        
        return wrappedContent;
    }
}
