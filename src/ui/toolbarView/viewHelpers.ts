import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";
import { ButtonComponent, DropdownComponent, loadMermaid } from "obsidian";
import { MermaidElementService } from "src/core/elementService";
import { MermaidToolbarButton } from "./mermaidToolbarButtons";
import MermaidPlugin from "main";

export const TOOLBAR_ELEMENT_CLASS_NAME = "mermaid-toolbar-element";
export const TOOLBAR_ELEMENTS_CONTAINER_CLASS_NAME = "mermaid-toolbar-elements-container";
export const TOOLBAR_ELEMENTS_CONTAINER_ID = "mermaid-toolbar-elements-container-id";

export async function createMermaidToolbar(
    topRowButtons: MermaidToolbarButton[],
    items: IMermaidElement[], 
    selectedCategory: ElementCategory,
    onCategoryChanged: (newCategory: ElementCategory) => void, 
    onElementClick: (elementContent: string) => void): Promise<HTMLElement> {
        let container = document.createElement('div');
        // dropdown
        let topRow = container.createDiv();
        topRow.addClass("mermaid-toolbar-top-row");
        // elements
        let elementsContainer = container.createDiv();
        elementsContainer.addClass(TOOLBAR_ELEMENTS_CONTAINER_CLASS_NAME);
        elementsContainer.setAttr("id", TOOLBAR_ELEMENTS_CONTAINER_ID);

        createDropdown(topRow, elementsContainer, items, selectedCategory, onCategoryChanged, onElementClick);
        createTopRowBtns(topRow, topRowButtons);

        await recreateElementsSection(elementsContainer, selectedCategory, items, onElementClick);
        
        return container;
}

function createTopRowBtns(parentEl: HTMLDivElement, buttons: MermaidToolbarButton[]) {
    buttons.forEach(btn => {
        let b = new ButtonComponent(parentEl)
                .setClass("clickable-icon")
                .setIcon(btn.iconName)
                .setTooltip(btn.tooltip)
                .onClick(btn.callback);
    });
}

function createDropdown(
    parentEl: HTMLDivElement, 
    elementsContainer: HTMLDivElement,
    items: IMermaidElement[], 
    selectedCategory: ElementCategory,
    onSelectionChanged: (newCategory: ElementCategory) => void,
    onElClick: (text: string) => void) {
        let categories = Object.keys(ElementCategory);

        let dropdown = new DropdownComponent(parentEl);
        
        categories.forEach(c => {
            dropdown.addOption(c, c);
        })
        dropdown.setValue(selectedCategory);
        
        dropdown.onChange(val => {
            onSelectionChanged(val as ElementCategory);
            recreateElementsSection(elementsContainer, val as ElementCategory, items, onElClick);
        })
}

async function recreateElementsSection(
    sectionContainer: HTMLElement,
    category: ElementCategory, 
    items: IMermaidElement[], 
    onElClick: (elementContent: string) => void) 
{
        sectionContainer.innerHTML = '';
        let elemService = new MermaidElementService();
        let mermaid = await loadMermaid();

        let filteredSortedItems = items.filter(i => i.category == category).sort((a, b) => a.sortingOrder - b.sortingOrder);
        
        filteredSortedItems.forEach(async (elem, index) => {
            let el = createToolbarElement(sectionContainer);
            el.id = `mermaid-toolbar-element-${elem.category}-${index}`;
            let {svg} = await mermaid.render(el.id, elemService.wrapAsCompleteDiagram(elem));
            el.innerHTML = svg;
            el.onclick = (e) => onElClick(elem.content);
            sectionContainer.appendChild(el);
        }); 
}

function createToolbarElement(parentEl: HTMLElement): HTMLElement {
    let itemEl = parentEl.createEl("pre");
    itemEl.addClass(TOOLBAR_ELEMENT_CLASS_NAME);
    return itemEl;
}