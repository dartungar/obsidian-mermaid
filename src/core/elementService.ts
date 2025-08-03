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

    public saveElement(element: IMermaidElement, plugin: MermaidPlugin): void {

        const elementExists = plugin.settings.elements.some(el => el.id === element.id);

        if (elementExists) {
            const index = plugin.settings.elements.findIndex(el => el.id === element.id);
            if (index !== -1) {
                plugin.settings.elements[index] = element;
            }

        } else {
            this.fixSortOrder(element, plugin);
            plugin.settings.elements.push(element);
        }

        plugin.saveSettings();       
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
            console.warn(`[Mermaid Tools] No category found for ID: ${categoryId}, using default sample`);
            return this.wrapForPastingIntoEditor(this.wrapWithMermaidBlock("flowchart TD\nStart --> End"));
        }
        
        const sampleKey = category.name as keyof typeof sampleDiagrams;
        const sample = sampleDiagrams[sampleKey];
        if (sample) {
            return this.wrapForPastingIntoEditor(this.wrapWithMermaidBlock(sample));
        }
        
        console.warn(`[Mermaid Tools] No sample diagram found for category: ${category.name}, using default sample`);
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
            console.warn(`[Mermaid Tools] No wrapping data found for category: ${element.categoryId}`);
            return element.content;
        }
        
        // Check if content already contains the wrapping
        const contentAlreadyWrapped = wrapping.wrappings 
                ? wrapping.wrappings.some(w => element.content.contains(w)) 
                : element.content.contains(wrapping.defaultWrapping);
                
        if (contentAlreadyWrapped) {
            return element.content;
        }
        
        // Add the default wrapping
        const wrappedContent = wrapping.defaultWrapping + "\n" + element.content;
        
        // Log a warning if the wrapping might be invalid
        const firstWord = wrapping.defaultWrapping.trim().split(/\s+/)[0];
        const validDiagramTypes = [
            'flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 'stateDiagram-v2', 
            'erDiagram', 'journey', 'gantt', 'pie', 'requirementDiagram', 'gitGraph',
            'mindmap', 'timeline', 'quadrantChart', 'C4Context', 'sankey-beta', 
            'xychart-beta', 'packet-beta', 'kanban', 'block-beta', 'architecture-beta'
        ];
        
        if (!validDiagramTypes.includes(firstWord)) {
            console.warn(`[Mermaid Tools] Potentially invalid diagram type "${firstWord}" in category ${element.categoryId}. This may cause rendering errors.`);
        }
        
        return wrappedContent;
    }
}