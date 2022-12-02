import { defaultElements } from "../elements/defaultElements"
import { ElementCategory } from "./ElementCategory";
import { IMermaidElement } from "./IMermaidElement";

interface IWrappingData {
    defaultWrapping: string,
    wrappings: string[] | null
}

let wrappingsForElementCategories: Record<ElementCategory, IWrappingData> = {
    Flowchart: { defaultWrapping: "flowchart LR", wrappings: ["flowchart LR", "flowchart TD"] },
    SequenceDiagram: { defaultWrapping: "sequenceDiagram", wrappings: null },
    ClassDiagram: { defaultWrapping: "classDiagram", wrappings: null },
    StateDiagram: { defaultWrapping: "stateDiagram-v2", wrappings: null },
    EntityRelationshipDiagram: { defaultWrapping: "erDiagram", wrappings: null },
    UserJourneyDiagram: { defaultWrapping: "journey", wrappings: null },
    GanttChart: { defaultWrapping: "gantt", wrappings: null },
    PieChart: { defaultWrapping: "pie", wrappings: null },
    RequirementDiagram: { defaultWrapping: "requirementDiagram", wrappings: null },
    GitGraph: { defaultWrapping: "gitGraph", wrappings: null }
}

export class MermaidElementService {
    static DefaultElements() {
        return defaultElements;
    }

    public wrapForPastingIntoEditor(text: string): string {
        return `${text}\n`
    }

    public wrapWithMermaidBlock(text: string): string {
        return `\`\`\`mermaid\n${text}\n\`\`\``;
    }

    // title for mermaid.js
    public withTitle(title: string, text: string): string {
        return `${text}\naccTitle: ${title}\n`
    }

    public wrapAsCompleteDiagram(element: IMermaidElement): string {
        let wrapping = wrappingsForElementCategories[element.category];
        let content = this.withTitle(element.description, element.content);
        return (wrapping.wrappings 
                ? wrapping.wrappings.some(w => element.content.contains(w)) 
                : element.content.contains(wrapping.defaultWrapping))
            ? content
            : wrapping.defaultWrapping 
                + "\n" 
                + content;
    }
}