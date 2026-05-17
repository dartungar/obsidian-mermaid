import { IMermaidElement } from "src/core/IMermaidElement";
import { CategoryService } from "src/core/categoryService";
import { ButtonComponent, DropdownComponent, loadMermaid } from "obsidian";
import { MermaidElementService } from "src/core/elementService";
import { MermaidRenderer } from "src/core/mermaidRenderer";
import { MermaidToolbarButton } from "./mermaidToolbarButtons";
import { setMermaidSvgContent } from "../renderMermaidSvg";

export const TOOLBAR_ELEMENT_CLASS_NAME = "mermaid-toolbar-element";
export const TOOLBAR_ELEMENTS_CONTAINER_CLASS_NAME = "mermaid-toolbar-elements-container";
export const TOOLBAR_ELEMENTS_CONTAINER_ID = "mermaid-toolbar-elements-container-id";

export async function createMermaidToolbar(
    topRowButtons: MermaidToolbarButton[],
    items: IMermaidElement[], 
    selectedCategoryId: string,
    onCategoryChanged: (newCategoryId: string) => Promise<void> | void, 
    onElementClick: (elementContent: string) => void,
    categoryService: CategoryService): Promise<HTMLElement> {
        const container = document.createElement('div');
        // dropdown
        const topRow = container.createDiv();
        topRow.addClass("mermaid-toolbar-top-row");
        // elements
        const elementsContainer = container.createDiv();
        elementsContainer.addClass(TOOLBAR_ELEMENTS_CONTAINER_CLASS_NAME);
        elementsContainer.setAttr("id", TOOLBAR_ELEMENTS_CONTAINER_ID);

        createDropdown(topRow, elementsContainer, items, selectedCategoryId, onCategoryChanged, onElementClick, categoryService);
        createTopRowBtns(topRow, topRowButtons);

        await recreateElementsSection(elementsContainer, selectedCategoryId, items, onElementClick);
        
        return container;
}

function createTopRowBtns(parentEl: HTMLDivElement, buttons: MermaidToolbarButton[]) {
    buttons.forEach(btn => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const b = new ButtonComponent(parentEl)
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
    selectedCategoryId: string,
    onSelectionChanged: (newCategoryId: string) => Promise<void> | void,
    onElClick: (text: string) => void,
    categoryService: CategoryService) {
        const categories = categoryService.getCategories();

        const dropdown = new DropdownComponent(parentEl);
        
        categories.forEach(category => {
            dropdown.addOption(category.id, category.name);
        })
        dropdown.setValue(selectedCategoryId);
        
        dropdown.onChange(val => {
            void handleCategoryChanged(elementsContainer, val, items, onSelectionChanged, onElClick);
        })
}

async function handleCategoryChanged(
    elementsContainer: HTMLDivElement,
    categoryId: string,
    items: IMermaidElement[],
    onSelectionChanged: (newCategoryId: string) => Promise<void> | void,
    onElClick: (text: string) => void
): Promise<void> {
    await onSelectionChanged(categoryId);
    await recreateElementsSection(elementsContainer, categoryId, items, onElClick);
}

async function recreateElementsSection(
    sectionContainer: HTMLElement,
    categoryId: string, 
    items: IMermaidElement[], 
    onElClick: (elementContent: string) => void) 
{
        sectionContainer.empty();
        const elemService = new MermaidElementService();
        const mermaid: MermaidRenderer = await loadMermaid();

        const filteredSortedItems = items.filter(i => i.categoryId === categoryId).sort((a, b) => a.sortingOrder - b.sortingOrder);
        
        for (const [index, elem] of filteredSortedItems.entries()) {
            const el = createToolbarElement(sectionContainer);
            el.id = `mermaid-toolbar-element-${elem.categoryId}-${index}`;
            const diagram = elemService.wrapAsCompleteDiagram(elem);
            el.title = elem.description;
            try {
                const {svg} = await mermaid.render(createMermaidPreviewId(), diagram);
                setMermaidSvgContent(el, svg);
            } catch (error) {
                renderToolbarElementError(el, elem.description, error);
            }
            el.onclick = () => onElClick(elem.content);
            sectionContainer.appendChild(el);
        }
}

function createToolbarElement(parentEl: HTMLElement): HTMLElement {
    const itemEl = parentEl.createEl("pre");
    itemEl.addClass(TOOLBAR_ELEMENT_CLASS_NAME);
    return itemEl;
}

function renderToolbarElementError(el: HTMLElement, description: string, error: unknown): void {
    el.empty();
    el.addClass("mermaid-toolbar-element-error");
    el.title = `${description}: ${getErrorMessage(error)}`;
    el.createDiv({ text: description });
    const errorEl = el.createDiv({ text: "Preview unavailable" });
    errorEl.addClass("mermaid-toolbar-element-error-message");
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function createMermaidPreviewId(): string {
    return `mermaid-tools-toolbar-preview-${crypto.randomUUID()}`;
}
