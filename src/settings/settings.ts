import { defaultElements } from "src/elements/defaultElements";
import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export class MermaidPluginSettings {
    elements: IMermaidElement[];
    categories = ElementCategory;
    selectedCategory: ElementCategory;

    public static DefaultSettings() {
        let settings = new MermaidPluginSettings();
        settings.elements = defaultElements;
        settings.selectedCategory = ElementCategory.Flowchart;
        return settings;
    }

}