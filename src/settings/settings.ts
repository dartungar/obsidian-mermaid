import { defaultElements } from "src/elements/defaultElements";
import { IMermaidElement } from "src/core/IMermaidElement";
import { IElementCategory } from "src/core/IElementCategory";

export class MermaidPluginSettings {
    elements: IMermaidElement[];
    customCategories: IElementCategory[];
    selectedCategoryId: string;

    public static DefaultSettings() {
        const settings = new MermaidPluginSettings();
        settings.elements = defaultElements;
        settings.customCategories = [];
        settings.selectedCategoryId = "flowchart"; // Default to flowchart category ID
        return settings;
    }

}