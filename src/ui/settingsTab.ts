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
    categoryService.loadCategories(plugin.settings.customCategories, plugin.settings.defaultCategorySortOrders);
    
    containerEl.empty();

    containerEl.createEl('h1', { text: 'Mermaid Tools Settings' });

    // Combined Elements and Categories Management Section
    containerEl.createEl('h2', { text: 'Manage Elements & Categories' });
    
    // Add buttons row
    const buttonsContainer = containerEl.createDiv();
    buttonsContainer.style.marginBottom = "20px";
    buttonsContainer.style.display = "flex";
    buttonsContainer.style.gap = "10px";

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
            renderSettings(containerEl, plugin);
        }
    };

    // Add category button
    const addCategoryButton = buttonsContainer.createEl("button", {text: "Add Category"});
    addCategoryButton.addClass("mod-cta");
    addCategoryButton.onclick = () => {
        const modal = new EditCategoryModal(plugin.app, plugin, null, (category: IElementCategory) => {
            try {
                // Ensure new categories get proper sort order in unified system
                if (category.sortOrder === undefined || category.sortOrder === null) {
                    category.sortOrder = categoryService.getNextSortOrder();
                }
                categoryService.addCategory(category);
                saveAllCategoryChanges(plugin, categoryService);
                renderSettings(containerEl, plugin);
            } catch (error) {
                console.error("Error adding category:", error);
            }
        });
        modal.open();
    };

    // Display categories with integrated element management
    createIntegratedCategorySection(containerEl, plugin, categoryService, mermaid);
}

function saveAllCategoryChanges(plugin: MermaidPlugin, categoryService: CategoryService) {
    // Save custom categories
    plugin.settings.customCategories = categoryService.getCustomCategories();
    
    // Save default category sort orders
    const defaultCategories = categoryService.getCategories().filter(cat => !cat.isCustom);
    defaultCategories.forEach(cat => {
        plugin.settings.defaultCategorySortOrders[cat.id] = cat.sortOrder;
    });
    
    plugin.saveSettings();
}

function createIntegratedCategorySection(containerEl: HTMLElement, plugin: MermaidPlugin, categoryService: CategoryService, mermaid: any) {
    const allCategories = categoryService.getCategories().sort((a, b) => a.sortOrder - b.sortOrder);

    allCategories.forEach(category => {
        const categoryContainer = containerEl.createDiv();
        categoryContainer.addClass("mermaid-tools-category-section");
        categoryContainer.style.marginBottom = "20px";
        categoryContainer.style.border = "1px solid var(--background-modifier-border)";
        categoryContainer.style.borderRadius = "8px";
        categoryContainer.style.padding = "15px";

        // Category header with name and controls
        const categoryHeader = categoryContainer.createDiv();
        categoryHeader.style.display = "flex";
        categoryHeader.style.alignItems = "center";
        categoryHeader.style.justifyContent = "space-between";
        categoryHeader.style.marginBottom = "10px";
        categoryHeader.style.cursor = "pointer";

        const categoryTitle = categoryHeader.createDiv();
        categoryTitle.style.display = "flex";
        categoryTitle.style.alignItems = "center";
        categoryTitle.style.gap = "10px";

        const expandIcon = categoryTitle.createSpan();
        expandIcon.innerHTML = "▼";
        expandIcon.style.fontSize = "12px";
        expandIcon.style.transition = "transform 0.2s";

        const categoryName = categoryTitle.createEl('h3', { text: category.name });
        categoryName.style.margin = "0";
        categoryName.style.fontSize = "16px";

        const categoryInfo = categoryTitle.createSpan();
        const elementCount = plugin.settings.elements.filter(el => el.categoryId === category.id).length;
        categoryInfo.textContent = `(${elementCount} elements)`;
        categoryInfo.style.color = "var(--text-muted)";
        categoryInfo.style.fontSize = "12px";

        // Category controls
        const categoryControls = categoryHeader.createDiv();
        categoryControls.style.display = "flex";
        categoryControls.style.gap = "2px";

        // Move up button
        const moveUpButton = categoryControls.createEl("button");
        moveUpButton.title = "Move category up";
        moveUpButton.style.background = "none";
        moveUpButton.style.border = "none";
        moveUpButton.style.cursor = "pointer";
        moveUpButton.style.padding = "4px";
        moveUpButton.style.display = "flex";
        moveUpButton.style.alignItems = "center";
        moveUpButton.style.borderRadius = "3px";
        moveUpButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18,15 12,9 6,15"></polyline></svg>`;
        moveUpButton.onmouseenter = () => moveUpButton.style.backgroundColor = "var(--background-modifier-hover)";
        moveUpButton.onmouseleave = () => moveUpButton.style.backgroundColor = "transparent";
        moveUpButton.onclick = (e) => {
            e.stopPropagation();
            const categories = categoryService.getCategories().sort((a, b) => a.sortOrder - b.sortOrder);
            const currentIndex = categories.findIndex(cat => cat.id === category.id);
            if (currentIndex > 0) {
                // Swap sort orders
                const temp = categories[currentIndex - 1].sortOrder;
                categories[currentIndex - 1].sortOrder = category.sortOrder;
                category.sortOrder = temp;
                
                // Update both categories
                categoryService.updateCategory(categories[currentIndex - 1]);
                categoryService.updateCategory(category);
                
                // Save changes for all categories (both default and custom)
                saveAllCategoryChanges(plugin, categoryService);
                renderSettings(containerEl, plugin);
            }
        };

        // Move down button
        const moveDownButton = categoryControls.createEl("button");
        moveDownButton.title = "Move category down";
        moveDownButton.style.background = "none";
        moveDownButton.style.border = "none";
        moveDownButton.style.cursor = "pointer";
        moveDownButton.style.padding = "4px";
        moveDownButton.style.display = "flex";
        moveDownButton.style.alignItems = "center";
        moveDownButton.style.borderRadius = "3px";
        moveDownButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg>`;
        moveDownButton.onmouseenter = () => moveDownButton.style.backgroundColor = "var(--background-modifier-hover)";
        moveDownButton.onmouseleave = () => moveDownButton.style.backgroundColor = "transparent";
        moveDownButton.onclick = (e) => {
            e.stopPropagation();
            const categories = categoryService.getCategories().sort((a, b) => a.sortOrder - b.sortOrder);
            const currentIndex = categories.findIndex(cat => cat.id === category.id);
            if (currentIndex < categories.length - 1) {
                const temp = categories[currentIndex + 1].sortOrder;
                categories[currentIndex + 1].sortOrder = category.sortOrder;
                category.sortOrder = temp;
                
                // Update both categories
                categoryService.updateCategory(categories[currentIndex + 1]);
                categoryService.updateCategory(category);
                
                // Save changes for all categories (both default and custom)
                saveAllCategoryChanges(plugin, categoryService);
                renderSettings(containerEl, plugin);
            }
        };

        // Edit category button
        const editButton = categoryControls.createEl("button");
        editButton.title = "Edit category";
        editButton.style.background = "none";
        editButton.style.border = "none";
        editButton.style.cursor = "pointer";
        editButton.style.padding = "4px";
        editButton.style.display = "flex";
        editButton.style.alignItems = "center";
        editButton.style.borderRadius = "3px";
        editButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
        editButton.onmouseenter = () => editButton.style.backgroundColor = "var(--background-modifier-hover)";
        editButton.onmouseleave = () => editButton.style.backgroundColor = "transparent";
        editButton.onclick = (e) => {
            e.stopPropagation();
            const modal = new EditCategoryModal(plugin.app, plugin, category, (updatedCategory: IElementCategory) => {
                try {
                    categoryService.updateCategory(updatedCategory);
                    saveAllCategoryChanges(plugin, categoryService);
                    renderSettings(containerEl, plugin);
                } catch (error) {
                    console.error("Error updating category:", error);
                }
            });
            modal.open();
        };

        // Delete category button
        const deleteButton = categoryControls.createEl("button");
        deleteButton.title = "Delete category";
        deleteButton.style.background = "none";
        deleteButton.style.border = "none";
        deleteButton.style.cursor = "pointer";
        deleteButton.style.padding = "4px";
        deleteButton.style.display = "flex";
        deleteButton.style.alignItems = "center";
        deleteButton.style.borderRadius = "3px";
        deleteButton.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"></polyline><path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path></svg>`;
        deleteButton.onmouseenter = () => deleteButton.style.backgroundColor = "var(--background-modifier-hover)";
        deleteButton.onmouseleave = () => deleteButton.style.backgroundColor = "transparent";
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            const elementsInCategory = plugin.settings.elements.filter(el => el.categoryId === category.id);
            if (elementsInCategory.length > 0) {
                alert(`Cannot delete category '${category.name}' because it contains ${elementsInCategory.length} element(s). Please move or delete these elements first.`);
                return;
            }

            const confirmMessage = category.isCustom 
                ? `Are you sure you want to delete the category '${category.name}'?`
                : `Are you sure you want to delete the default category '${category.name}'? This action cannot be undone.`;
                
            if (confirm(confirmMessage)) {
                try {
                    categoryService.deleteCategory(category.id);
                    if (category.isCustom) {
                        plugin.settings.customCategories = categoryService.getCustomCategories();
                    }
                    plugin.saveSettings();
                    renderSettings(containerEl, plugin);
                } catch (error) {
                    console.error("Error deleting category:", error);
                    if (!category.isCustom) {
                        alert(`Cannot delete default category: ${error.message}`);
                    }
                }
            }
        };

        // Elements container (collapsible)
        const elementsContainer = categoryContainer.createDiv();
        elementsContainer.addClass("mermaid-tools-elements-container");
        elementsContainer.style.display = "none"; // Start collapsed

        // Collapse/expand functionality
        let isCollapsed = true; // Start collapsed
        categoryHeader.onclick = () => {
            isCollapsed = !isCollapsed;
            elementsContainer.style.display = isCollapsed ? "none" : "block";
            expandIcon.style.transform = isCollapsed ? "rotate(-90deg)" : "rotate(0deg)";
        };

        // Set initial state
        expandIcon.style.transform = "rotate(-90deg)"; // Show collapsed state

        // Render elements in this category
        renderCategoryElements(category, plugin, elementsContainer, mermaid, categoryService);
    });
}

function renderCategoryElements(category: IElementCategory, plugin: MermaidPlugin, parentEl: HTMLElement, mermaid: any, categoryService: CategoryService) {
    const elements = plugin.settings.elements
        .filter(e => e.categoryId === category.id)
        .sort((a, b) => a.sortingOrder - b.sortingOrder);

    if (elements.length === 0) {
        const emptyMessage = parentEl.createDiv();
        emptyMessage.textContent = "No elements in this category";
        emptyMessage.style.color = "var(--text-muted)";
        emptyMessage.style.fontStyle = "italic";
        emptyMessage.style.padding = "10px";
        return;
    }

    elements.forEach((element, index) => {
        const settingContainer = parentEl.createDiv("mermaid-tools-element-container");
        settingContainer.style.marginBottom = "10px";
        settingContainer.style.padding = "10px";
        settingContainer.style.backgroundColor = "var(--background-secondary)";
        settingContainer.style.borderRadius = "5px";

        const setting = new Setting(settingContainer);
        setting.setName(element.description);

        setting.addExtraButton(cb => {
            cb.setIcon('edit')
            .setTooltip("edit element")
            .onClick(() => {
                const modal = new EditMermaidElementModal(plugin.app, plugin, mermaid, element, categoryService);
                modal.open();
                modal.onClose = () => { 
                    const settingsContainer = parentEl.closest('.vertical-tab-content') as HTMLElement;
                    if (settingsContainer) renderSettings(settingsContainer, plugin);
                }
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
                const settingsContainer = parentEl.closest('.vertical-tab-content') as HTMLElement;
                if (settingsContainer) renderSettings(settingsContainer, plugin);
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
                    const settingsContainer = parentEl.closest('.vertical-tab-content') as HTMLElement;
                    if (settingsContainer) renderSettings(settingsContainer, plugin);
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
                    const settingsContainer = parentEl.closest('.vertical-tab-content') as HTMLElement;
                    if (settingsContainer) renderSettings(settingsContainer, plugin);
                }
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('trash-2')
            .setTooltip("delete element")
            .onClick(() => {
                plugin.settings.elements = plugin.settings.elements.filter(e => e.id !== element.id);
                plugin.saveSettings();
                const settingsContainer = parentEl.closest('.vertical-tab-content') as HTMLElement;
                if (settingsContainer) renderSettings(settingsContainer, plugin);
            })
        });
    });
}
