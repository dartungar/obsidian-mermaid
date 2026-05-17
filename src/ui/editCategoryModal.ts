import { App, Modal, Notice, Setting } from "obsidian";
import { IElementCategory } from "src/core/IElementCategory";
import { CategoryService } from "src/core/categoryService";

export class EditCategoryModal extends Modal {
    private category: IElementCategory;
    private isNewCategory: boolean;
    private categoryService: CategoryService;
    private onSave: (category: IElementCategory) => Promise<void> | void;

    constructor(
        app: App, 
        existingCategory: IElementCategory | null, 
        onSave: (category: IElementCategory) => Promise<void> | void
    ) {
        super(app);
        this.categoryService = CategoryService.getInstance();
        this.onSave = onSave;
        this.isNewCategory = !existingCategory;
        
        if (existingCategory) {
            this.category = { ...existingCategory };
        } else {
            this.category = {
                id: "",
                name: "",
                defaultWrapping: "",
                wrappings: null,
                isCustom: true,
                sortOrder: this.categoryService.getNextSortOrder()
            };
        }
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.addClass("mermaid-tools-edit-category-modal");
        
        contentEl.createEl('h2', { 
            text: this.isNewCategory ? "Create Custom Category" : "Edit Category" 
        });

        // Category ID
        new Setting(contentEl)
            .setName('Category ID')
            .setDesc(this.isNewCategory
                ? 'Unique identifier for this category (lowercase, no spaces)'
                : 'Category IDs cannot be changed after creation')
            .addText(text => {
                text
                    .setPlaceholder('my-custom-category')
                    .setValue(this.category.id)
                    .setDisabled(!this.isNewCategory)
                    .onChange((value) => {
                        this.category.id = value.toLowerCase().replace(/\s+/g, '-');
                    });
            });

        // Category Name
        new Setting(contentEl)
            .setName('Category Name')
            .setDesc('Display name for this category')
            .addText(text => text
                .setPlaceholder('My Custom Category')
                .setValue(this.category.name)
                .onChange((value) => {
                    this.category.name = value;
                })
            );

        // Default Wrapping
        new Setting(contentEl)
            .setName('Default Wrapping')
            .setDesc('Default mermaid syntax to wrap elements (e.g., "flowchart TD", "sequenceDiagram")')
            .addText(text => text
                .setPlaceholder('flowchart TD')
                .setValue(this.category.defaultWrapping)
                .onChange((value) => {
                    this.category.defaultWrapping = value;
                })
            );

        // Additional Wrappings
        new Setting(contentEl)
            .setName('Additional Wrappings (Optional)')
            .setDesc('Comma-separated list of alternative wrappings (e.g., "flowchart LR, flowchart TB")')
            .addText(text => text
                .setPlaceholder('flowchart LR, flowchart TB')
                .setValue(this.category.wrappings ? this.category.wrappings.join(', ') : '')
                .onChange((value) => {
                    if (value.trim()) {
                        this.category.wrappings = value.split(',').map(w => w.trim()).filter(w => w);
                    } else {
                        this.category.wrappings = null;
                    }
                })
            );

        // Sort Order
        new Setting(contentEl)
            .setName('Sort Order')
            .setDesc('Determines the order in which categories appear')
            .addText(text => text
                .setPlaceholder('0')
                .setValue(this.category.sortOrder.toString())
                .onChange((value) => {
                    const num = parseInt(value, 10);
                    if (!isNaN(num)) {
                        this.category.sortOrder = num;
                    }
                })
            );

        // Buttons
        const buttonContainer = contentEl.createDiv('mermaid-tools-modal-button-container');

        const cancelButton = buttonContainer.createEl('button', { text: 'Cancel' });
        cancelButton.onclick = () => this.close();

        const saveButton = buttonContainer.createEl('button', { 
            text: this.isNewCategory ? 'Create' : 'Save',
            cls: 'mod-cta'
        });
        saveButton.onclick = () => {
            void this.save();
        };
    }

    private async save(): Promise<void> {
        // Validation
        if (!this.category.id.trim()) {
            new Notice('Category ID is required');
            return;
        }

        if (!this.category.name.trim()) {
            new Notice('Category name is required');
            return;
        }

        if (!this.category.defaultWrapping.trim()) {
            new Notice('Default wrapping is required');
            return;
        }

        // Basic validation for common Mermaid diagram types
        const commonDiagramTypes = [
            'flowchart', 'graph', 'sequenceDiagram', 'classDiagram', 'stateDiagram-v2', 
            'erDiagram', 'journey', 'gantt', 'pie', 'requirementDiagram', 'gitGraph',
            'mindmap', 'timeline', 'quadrantChart', 'C4Context', 'sankey-beta', 
            'xychart-beta', 'packet-beta', 'kanban', 'block-beta', 'architecture-beta'
        ];

        const wrapping = this.category.defaultWrapping.trim().split(/\s+/)[0];
        if (!commonDiagramTypes.includes(wrapping)) {
            new Notice(`"${wrapping}" is not a recognized Mermaid diagram type. The category will still be saved.`);
        }

        // Check for duplicate ID (only for new categories)
        if (this.isNewCategory && this.categoryService.getCategoryById(this.category.id)) {
            new Notice(`A category with ID '${this.category.id}' already exists`);
            return;
        }

        try {
            await this.onSave(this.category);
            this.close();
        } catch (error) {
            new Notice(`Error saving category: ${getErrorMessage(error)}`);
        }
    }
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
