import MermaidPlugin from "main";
import { App, Modal, Notice, PluginSettingTab, Setting, loadMermaid, setIcon } from "obsidian";
import type { IconName } from "obsidian";
import { IMermaidElement } from "src/core/IMermaidElement";
import { EditMermaidElementModal } from "./editMermaidElementModal";
import { EditCategoryModal } from "./editCategoryModal";
import { CategoryService } from "src/core/categoryService";
import { IElementCategory } from "src/core/IElementCategory";
import { MermaidRenderer } from "src/core/mermaidRenderer";
import { DEFAULT_CATEGORIES } from "src/core/defaultCategories";

const expandedCategoryIds = new Set<string>();

export class MermaidToolsSettingsTab extends PluginSettingTab {

    constructor(private _app: App, private _plugin: MermaidPlugin) {
        super(_app, _plugin);
    }

    async display() {
        await renderSettings(this.containerEl, this._plugin);
    }
}

async function renderSettings(containerEl: HTMLElement, plugin: MermaidPlugin) {
    const mermaid: MermaidRenderer = await loadMermaid();
    const categoryService = CategoryService.getInstance();
    
    // Load custom categories into category service
    categoryService.loadCategories(
        plugin.settings.customCategories,
        plugin.settings.defaultCategorySortOrders,
        plugin.settings.categoryModifications);
    
    containerEl.empty();

    containerEl.createEl('h1', { text: 'Mermaid Tools Settings' });

    // Combined Elements and Categories Management Section
    containerEl.createEl('h2', { text: 'Manage Elements & Categories' });
    
    // Add buttons row
    const buttonsContainer = containerEl.createDiv();
    buttonsContainer.addClass("mermaid-tools-actions-row");

    // Add element button
    const addElementButton = buttonsContainer.createEl("button", {text: "Add Element"});
    addElementButton.addClass("mod-cta");
    addElementButton.onclick = () => {
        const newElement: IMermaidElement = { 
            id: crypto.randomUUID(),
            description: "New element",
            content: `flowchart TD\nStart --> Stop`,
            categoryId: "flowchart", // Default to flowchart category ID
            sortingOrder: 0,
            isPinned: false
        };

        const modal = new EditMermaidElementModal(plugin.app, plugin, mermaid, newElement, categoryService);
        modal.open();
        modal.onClose = () => {  
            void renderSettings(containerEl, plugin);
        }
    };

    // Add category button
    const addCategoryButton = buttonsContainer.createEl("button", {text: "Add Category"});
    addCategoryButton.addClass("mod-cta");
    addCategoryButton.onclick = () => {
        const modal = new EditCategoryModal(plugin.app, null, async (category: IElementCategory) => {
            try {
                // Ensure new categories get proper sort order in unified system
                if (category.sortOrder === undefined || category.sortOrder === null) {
                    category.sortOrder = categoryService.getNextSortOrder();
                }
                categoryService.addCategory(category);
                await saveAllCategoryChanges(plugin, categoryService);
                await renderSettings(containerEl, plugin);
            } catch (error) {
                new Notice(`Error adding category: ${getErrorMessage(error)}`);
            }
        });
        modal.open();
    };

    // Display categories with integrated element management
    createIntegratedCategorySection(containerEl, plugin, categoryService, mermaid);
}

async function saveAllCategoryChanges(plugin: MermaidPlugin, categoryService: CategoryService): Promise<void> {
    // Save custom categories
    plugin.settings.customCategories = categoryService.getCustomCategories();
    
    // Save default category sort orders and editable metadata
    plugin.settings.defaultCategorySortOrders = {};
    plugin.settings.categoryModifications = {};

    const defaultCategories = categoryService.getCategories().filter(cat => !cat.isCustom);
    defaultCategories.forEach(cat => {
        const originalCategory = DEFAULT_CATEGORIES.find(defaultCategory => defaultCategory.id === cat.id);
        if (!originalCategory) {
            return;
        }

        if (cat.sortOrder !== originalCategory.sortOrder) {
            plugin.settings.defaultCategorySortOrders[cat.id] = cat.sortOrder;
        }

        const categoryModification: Partial<IElementCategory> = {};
        if (cat.name !== originalCategory.name) {
            categoryModification.name = cat.name;
        }
        if (cat.defaultWrapping !== originalCategory.defaultWrapping) {
            categoryModification.defaultWrapping = cat.defaultWrapping;
        }
        if (!areNullableStringArraysEqual(cat.wrappings ?? null, originalCategory.wrappings ?? null)) {
            categoryModification.wrappings = cat.wrappings ?? null;
        }

        if (Object.keys(categoryModification).length > 0) {
            plugin.settings.categoryModifications[cat.id] = categoryModification;
        }
    });
    
    await plugin.saveSettings();
}

function createIntegratedCategorySection(containerEl: HTMLElement, plugin: MermaidPlugin, categoryService: CategoryService, mermaid: MermaidRenderer) {
    const allCategories = categoryService.getCategories().sort((a, b) => a.sortOrder - b.sortOrder);

    allCategories.forEach(category => {
        const categoryContainer = containerEl.createDiv();
        categoryContainer.addClass("mermaid-tools-category-section");

        // Category header with name and controls
        const categoryHeader = categoryContainer.createDiv();
        categoryHeader.addClass("mermaid-tools-category-header");

        const categoryTitle = categoryHeader.createDiv();
        categoryTitle.addClass("mermaid-tools-category-title");

        const expandIcon = categoryTitle.createSpan();
        expandIcon.addClass("mermaid-tools-expand-icon");
        expandIcon.setText("▼");

        const categoryName = categoryTitle.createEl('h3', { text: category.name });
        categoryName.addClass("mermaid-tools-category-name");

        const categoryInfo = categoryTitle.createSpan();
        const elementCount = plugin.settings.elements.filter(el => el.categoryId === category.id).length;
        categoryInfo.setText(`(${elementCount} elements)`);
        categoryInfo.addClass("mermaid-tools-category-info");

        // Category controls
        const categoryControls = categoryHeader.createDiv();
        categoryControls.addClass("mermaid-tools-category-controls");

        // Add element button for this category
        const addElementButton = createCategoryControlButton(categoryControls, "Add element to this category", "plus");
        addElementButton.onclick = (e) => {
            e.stopPropagation();
            const newElement: IMermaidElement = { 
                id: crypto.randomUUID(),
                description: "New element",
                content: `flowchart TD\nStart --> Stop`,
                categoryId: category.id, // Use the current category's ID
                sortingOrder: plugin.settings.elements.filter(el => el.categoryId === category.id).length,
                isPinned: false
            };

            const modal = new EditMermaidElementModal(plugin.app, plugin, mermaid, newElement, categoryService);
            modal.open();
            modal.onClose = () => {  
                void renderSettings(containerEl, plugin);
            }
        };

        // Move up button
        const moveUpButton = createCategoryControlButton(categoryControls, "Move category up", "arrow-up");
        moveUpButton.onclick = (e) => {
            e.stopPropagation();
            void moveCategory(category, -1, containerEl, plugin, categoryService);
        };

        // Move down button
        const moveDownButton = createCategoryControlButton(categoryControls, "Move category down", "arrow-down");
        moveDownButton.onclick = (e) => {
            e.stopPropagation();
            void moveCategory(category, 1, containerEl, plugin, categoryService);
        };

        // Edit category button
        const editButton = createCategoryControlButton(categoryControls, "Edit category", "edit");
        editButton.onclick = (e) => {
            e.stopPropagation();
            const modal = new EditCategoryModal(plugin.app, category, async (updatedCategory: IElementCategory) => {
                try {
                    categoryService.updateCategory(updatedCategory);
                    await saveAllCategoryChanges(plugin, categoryService);
                    await renderSettings(containerEl, plugin);
                } catch (error) {
                    new Notice(`Error updating category: ${getErrorMessage(error)}`);
                }
            });
            modal.open();
        };

        // Delete category button
        const deleteButton = createCategoryControlButton(categoryControls, "Delete category", "trash-2");
        deleteButton.disabled = !category.isCustom;
        if (!category.isCustom) {
            deleteButton.title = "Default categories cannot be deleted";
            deleteButton.setAttr("aria-label", "Default categories cannot be deleted");
        }
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            if (!category.isCustom) {
                return;
            }
            openDeleteCategoryConfirmation(category, containerEl, plugin, categoryService);
        };

        // Elements container (collapsible)
        const elementsContainer = categoryContainer.createDiv();
        elementsContainer.addClass("mermaid-tools-elements-container");

        // Collapse/expand functionality
        let isCollapsed = !expandedCategoryIds.has(category.id);
        elementsContainer.toggleClass("is-collapsed", isCollapsed);
        expandIcon.toggleClass("is-collapsed", isCollapsed);

        categoryHeader.onclick = () => {
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                expandedCategoryIds.delete(category.id);
            } else {
                expandedCategoryIds.add(category.id);
            }
            elementsContainer.toggleClass("is-collapsed", isCollapsed);
            expandIcon.toggleClass("is-collapsed", isCollapsed);
        };

        // Render elements in this category
        renderCategoryElements(category, plugin, elementsContainer, mermaid, categoryService);
    });
}

function renderCategoryElements(category: IElementCategory, plugin: MermaidPlugin, parentEl: HTMLElement, mermaid: MermaidRenderer, categoryService: CategoryService) {
    const elements = plugin.settings.elements
        .filter(e => e.categoryId === category.id)
        .sort((a, b) => a.sortingOrder - b.sortingOrder);

    if (elements.length === 0) {
        const emptyMessage = parentEl.createDiv();
        emptyMessage.setText("No elements in this category");
        emptyMessage.addClass("mermaid-tools-empty-message");
        return;
    }

    elements.forEach((element, index) => {
        const settingContainer = parentEl.createDiv("mermaid-tools-element-container");

        const setting = new Setting(settingContainer);
        setting.setName(element.description);

        setting.addExtraButton(cb => {
            cb.setIcon('edit')
            .setTooltip("edit element")
            .onClick(() => {
                const modal = new EditMermaidElementModal(plugin.app, plugin, mermaid, element, categoryService);
                modal.open();
                modal.onClose = () => { 
                    void renderSettingsFromParent(parentEl, plugin);
                }
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('copy')
            .setTooltip("create a duplicate of this element")
            .onClick(() => {
                void duplicateElement(element, plugin, parentEl);
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('arrow-up')
            .setTooltip("move element up in the sidebar")
            .onClick(() => {
                void moveElement(category, elements, index, -1, plugin, parentEl);
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('arrow-down')
            .setTooltip("move element down in the sidebar")
            .onClick(() => {
                void moveElement(category, elements, index, 1, plugin, parentEl);
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('trash-2')
            .setTooltip("delete element")
            .onClick(() => {
                void deleteElement(element, plugin, parentEl);
            })
        });
    });
}

function createCategoryControlButton(parentEl: HTMLElement, title: string, iconName: IconName): HTMLButtonElement {
    const button = parentEl.createEl("button");
    button.addClass("mermaid-tools-icon-button");
    button.title = title;
    button.setAttr("aria-label", title);
    setIcon(button, iconName);
    return button;
}

async function moveCategory(
    category: IElementCategory,
    direction: -1 | 1,
    containerEl: HTMLElement,
    plugin: MermaidPlugin,
    categoryService: CategoryService
): Promise<void> {
    const categories = categoryService.getCategories().sort((a, b) => a.sortOrder - b.sortOrder);
    const currentIndex = categories.findIndex(cat => cat.id === category.id);
    const nextIndex = currentIndex + direction;

    if (currentIndex === -1 || nextIndex < 0 || nextIndex >= categories.length) {
        return;
    }

    const adjacentCategory = categories[nextIndex];
    const temp = adjacentCategory.sortOrder;
    adjacentCategory.sortOrder = category.sortOrder;
    category.sortOrder = temp;

    categoryService.updateCategory(adjacentCategory);
    categoryService.updateCategory(category);

    await saveAllCategoryChanges(plugin, categoryService);
    await renderSettings(containerEl, plugin);
}

function openDeleteCategoryConfirmation(
    category: IElementCategory,
    containerEl: HTMLElement,
    plugin: MermaidPlugin,
    categoryService: CategoryService
): void {
    const elementsInCategory = plugin.settings.elements.filter(el => el.categoryId === category.id);
    if (elementsInCategory.length > 0) {
        new Notice(`Cannot delete category '${category.name}' because it contains ${elementsInCategory.length} element(s).`);
        return;
    }

    new ConfirmActionModal(
        plugin.app,
        "Delete Category",
        category.isCustom 
            ? `Delete the category '${category.name}'?`
            : `Delete the default category '${category.name}'? This action cannot be undone.`,
        async () => {
            try {
                categoryService.deleteCategory(category.id);
                expandedCategoryIds.delete(category.id);
                if (category.isCustom) {
                    plugin.settings.customCategories = categoryService.getCustomCategories();
                }
                await plugin.saveSettings();
                await renderSettings(containerEl, plugin);
            } catch (error) {
                new Notice(`Error deleting category: ${getErrorMessage(error)}`);
            }
        }
    ).open();
}

async function duplicateElement(element: IMermaidElement, plugin: MermaidPlugin, parentEl: HTMLElement): Promise<void> {
    const duplicate : IMermaidElement =  {
        id: crypto.randomUUID(),
        categoryId: element.categoryId,
        description: element.description + " (copy)",
        content: element.content,
        sortingOrder: plugin.settings.elements.filter(el => el.categoryId === element.categoryId).length,
        isPinned: element.isPinned,
    };

    await plugin._mermaidElementService.saveElement(duplicate, plugin);
    await renderSettingsFromParent(parentEl, plugin);
}

async function moveElement(
    category: IElementCategory,
    elements: IMermaidElement[],
    index: number,
    direction: -1 | 1,
    plugin: MermaidPlugin,
    parentEl: HTMLElement
): Promise<void> {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= elements.length) {
        return;
    }

    const temp = elements[nextIndex].sortingOrder;
    elements[nextIndex].sortingOrder = elements[index].sortingOrder;
    elements[index].sortingOrder = temp;
    plugin.settings.elements = plugin.settings.elements.filter(el => el.categoryId !== category.id).concat(elements);
    expandedCategoryIds.add(category.id);

    await plugin.saveSettings();
    await renderSettingsFromParent(parentEl, plugin);
}

async function deleteElement(element: IMermaidElement, plugin: MermaidPlugin, parentEl: HTMLElement): Promise<void> {
    plugin.settings.elements = plugin.settings.elements.filter(e => e.id !== element.id);
    await plugin.saveSettings();
    await renderSettingsFromParent(parentEl, plugin);
}

async function renderSettingsFromParent(parentEl: HTMLElement, plugin: MermaidPlugin): Promise<void> {
    const settingsContainer = parentEl.closest('.vertical-tab-content');
    if (settingsContainer instanceof HTMLElement) {
        await renderSettings(settingsContainer, plugin);
    }
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function areNullableStringArraysEqual(first: string[] | null, second: string[] | null): boolean {
    if (first === null || second === null) {
        return first === second;
    }

    return first.length === second.length && first.every((value, index) => value === second[index]);
}

class ConfirmActionModal extends Modal {
    constructor(
        app: App,
        private title: string,
        private message: string,
        private onConfirm: () => Promise<void> | void
    ) {
        super(app);
    }

    onOpen(): void {
        const { contentEl } = this;
        contentEl.addClass("mermaid-tools-confirm-modal");
        contentEl.createEl("h2", { text: this.title });
        contentEl.createEl("p", { text: this.message });

        const buttonContainer = contentEl.createDiv("mermaid-tools-modal-button-container");
        const cancelButton = buttonContainer.createEl("button", { text: "Cancel" });
        cancelButton.onclick = () => this.close();

        const confirmButton = buttonContainer.createEl("button", {
            text: "Delete",
            cls: "mod-warning"
        });
        confirmButton.onclick = () => {
            void this.runConfirmedAction();
        };
    }

    private async runConfirmedAction(): Promise<void> {
        await this.onConfirm();
        this.close();
    }
}
