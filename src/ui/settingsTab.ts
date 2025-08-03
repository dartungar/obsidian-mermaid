import MermaidPlugin from "main";
import { App, PluginSettingTab, Setting, loadMermaid } from "obsidian";
import { IMermaidElement } from "src/core/IMermaidElement";
import { EditMermaidElementModal } from "./editMermaidElementModal";
import { EditCategoryModal } from "./editCategoryModal";
import { CategoryService } from "src/core/categoryService";
import { IElementCategory } from "src/core/IElementCategory";

export class MermaidToolsSettingsTab extends PluginSettingTab {

    constructor(private _app: App, private _plugin: MermaidPlugin) {
        super(_app, _plugin);
    }

    async display() {
        await renderSettings(this.containerEl, this._plugin);
    }
}

async function renderSettings(containerEl: HTMLElement, plugin: MermaidPlugin) {
    const mermaid = await loadMermaid();
    const categoryService = CategoryService.getInstance();
    
    // Load custom categories into category service
    categoryService.loadCategories(plugin.settings.customCategories);
    
    containerEl.empty();

    containerEl.createEl('h1', { text: 'Mermaid Tools Settings' });

    // Category Management Section
    containerEl.createEl('h2', { text: 'Manage Categories' });
    createCategoryManagementSection(containerEl, plugin, categoryService);

    // Element Management Section
    containerEl.createEl('h2', { text: 'Manage Elements' });
    createAddButton(containerEl, plugin);

    const categories = categoryService.getCategories();
    for (const category of categories) { 
        renderElementCategory(category, plugin, containerEl, mermaid, categoryService);
    }
}

function createCategoryManagementSection(containerEl: HTMLElement, plugin: MermaidPlugin, categoryService: CategoryService) {
    const categoryContainer = containerEl.createDiv();
    categoryContainer.addClass("mermaid-tools-category-management");

    // Add category button
    const addCategoryButton = categoryContainer.createEl("button", { text: "Add Custom Category" });
    addCategoryButton.addClass("mod-cta");
    addCategoryButton.onclick = () => {
        const modal = new EditCategoryModal(plugin.app, plugin, null, (category: IElementCategory) => {
            try {
                categoryService.addCategory(category);
                // Save to plugin settings
                plugin.settings.customCategories = categoryService.getCustomCategories();
                plugin.saveSettings();
                // Re-render settings
                renderSettings(containerEl, plugin);
            } catch (error) {
                console.error("Error adding category:", error);
            }
        });
        modal.open();
    };

    // List existing custom categories
    const customCategories = categoryService.getCustomCategories();
    if (customCategories.length > 0) {
        const customCategoriesContainer = categoryContainer.createDiv();
        customCategoriesContainer.createEl('h3', { text: 'Custom Categories' });

        customCategories.forEach(category => {
            const categorySetting = new Setting(customCategoriesContainer);
            categorySetting.setName(category.name);
            categorySetting.setDesc(`ID: ${category.id} | Wrapping: ${category.defaultWrapping}`);

            categorySetting.addExtraButton(button => {
                button.setIcon('edit')
                    .setTooltip('Edit category')
                    .onClick(() => {
                        const modal = new EditCategoryModal(plugin.app, plugin, category, (updatedCategory: IElementCategory) => {
                            try {
                                categoryService.updateCategory(updatedCategory);
                                plugin.settings.customCategories = categoryService.getCustomCategories();
                                plugin.saveSettings();
                                renderSettings(containerEl, plugin);
                            } catch (error) {
                                console.error("Error updating category:", error);
                            }
                        });
                        modal.open();
                    });
            });

            categorySetting.addExtraButton(button => {
                button.setIcon('trash-2')
                    .setTooltip('Delete category')
                    .onClick(() => {
                        // Check if category has elements
                        const elementsInCategory = plugin.settings.elements.filter(el => el.categoryId === category.id);
                        if (elementsInCategory.length > 0) {
                            alert(`Cannot delete category '${category.name}' because it contains ${elementsInCategory.length} element(s). Please move or delete these elements first.`);
                            return;
                        }

                        if (confirm(`Are you sure you want to delete the category '${category.name}'?`)) {
                            try {
                                categoryService.deleteCategory(category.id);
                                plugin.settings.customCategories = categoryService.getCustomCategories();
                                plugin.saveSettings();
                                renderSettings(containerEl, plugin);
                            } catch (error) {
                                console.error("Error deleting category:", error);
                            }
                        }
                    });
            });
        });
    }
}

function renderElementCategory(category: IElementCategory, plugin: MermaidPlugin, parentEl: HTMLElement, mermaid: any, categoryService: CategoryService) {
    const copy = [...plugin.settings.elements];
    const elements = copy.filter(e => e.categoryId === category.id);

    // for re-rendering
    let containerEl = document.getElementById(category.id + "-container");
    const isFirstRender = !containerEl;
    containerEl ??= parentEl.createDiv();
    containerEl.id = category.id + "-container";
    containerEl.innerHTML = ""

    const header = containerEl.createEl('h3', { text: category.name });
    
    header.addClass("mermaid-tools-element-category-header");

    const elementsContainerEl = containerEl.createDiv();
    elementsContainerEl.addClass("mermaid-tools-element-category-container");

    header.removeClass("collapsed");
    elementsContainerEl.hidden = false;

    // collapse category by default
    if (isFirstRender) {
        header.addClass("collapsed");
        elementsContainerEl.hidden = true;
    }

    header.onClickEvent(() => {
        header.classList.toggle("collapsed");
        elementsContainerEl.hidden = !elementsContainerEl.hidden;
     });

    elements
    .sort((a, b) => a.sortingOrder - b.sortingOrder)
    .forEach(async (element, index) => {
        const settingContainer = elementsContainerEl.createDiv("mermaid-tools-element-container");

        const setting = new Setting(settingContainer);

        setting.setName(element.description);

        setting.addExtraButton(cb => {
            cb.setIcon('edit')
            .setTooltip("edit element")
            .onClick(() => {
                const modal = new EditMermaidElementModal(plugin.app, plugin, mermaid, element, categoryService);
                modal.open();
                modal.onClose = () => {  renderElementCategory(category, plugin, parentEl, mermaid, categoryService); }
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('copy')
            .setTooltip("create a duplicate of this element")
            .onClick(() => {
                const duplicate : IMermaidElement =  {
                    id: crypto.randomUUID(),
                    categoryId: element.categoryId,
                    description: element.description + " (copy)",
                    content: element.content,
                    sortingOrder: plugin.settings.elements.filter(el => el.categoryId === element.categoryId).length,
                    isPinned: element.isPinned,
                };
                plugin._mermaidElementService.saveElement(duplicate, plugin);
                plugin.saveSettings();
                renderElementCategory(category, plugin, parentEl, mermaid, categoryService);
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('arrow-up')
            .setTooltip("move element up in the sidebar")
            .onClick(() => {
                if (index > 0) {
                    const temp = elements[index - 1].sortingOrder;
                    elements[index - 1].sortingOrder = element.sortingOrder;
                    element.sortingOrder = temp;
                    plugin.settings.elements = plugin.settings.elements.filter(el => el.categoryId !== category.id).concat(elements);
                    plugin.saveSettings();
                    renderElementCategory(category, plugin, parentEl, mermaid, categoryService);
                }
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('arrow-down')
            .setTooltip("move element down in the sidebar")
            .onClick(() => {
                if (index < elements.length - 1) {
                    const temp = elements[index + 1].sortingOrder;
                    elements[index + 1].sortingOrder = element.sortingOrder;
                    element.sortingOrder = temp;
                    plugin.settings.elements = plugin.settings.elements.filter(el => el.categoryId !== category.id).concat(elements);
                    plugin.saveSettings();
                    renderElementCategory(category, plugin, parentEl, mermaid, categoryService);
                }
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('trash-2')
            .setTooltip("delete element")
            .onClick(() => {
                plugin.settings.elements = plugin.settings.elements.filter(e => e.id !== element.id);
                plugin.saveSettings();
                renderElementCategory(category, plugin, parentEl, mermaid, categoryService);
            })
        });

    });
}

function createAddButton(parentEl: HTMLElement, plugin: MermaidPlugin): void {
    const addButton = parentEl.createEl("button", {text: "Add"})
    addButton.innerHTML = "Add an element";

    addButton.onclick = () => {
        const newElement: IMermaidElement = { 
            id: crypto.randomUUID(),
            description: "New element",
            content: `flowchart TD\nStart --> Stop`,
            categoryId: "flowchart", // Default to flowchart category ID
            sortingOrder: 0,
            isPinned: false
        };

        const categoryService = CategoryService.getInstance();
        const modal = new EditMermaidElementModal(plugin.app, plugin, null, newElement, categoryService);
        modal.open();
        modal.onClose = () => {  
            const category = categoryService.getCategoryById(modal._element.categoryId);
            if (category) {
                renderElementCategory(category, plugin, parentEl, null, categoryService); 
            }
        }
        
    };
}
