import MermaidPlugin from "main";
import { App, Modal, loadMermaid } from "obsidian";
import { IMermaidElement } from "src/core/IMermaidElement";
import { CategoryService } from "src/core/categoryService";
import { MermaidRenderer } from "src/core/mermaidRenderer";
import { setMermaidSvgContent } from "./renderMermaidSvg";

export class EditMermaidElementModal extends Modal {
    private _element: IMermaidElement;

    constructor(
        app: App, 
        private _plugin: MermaidPlugin, 
        private _mermaid: MermaidRenderer | null,
        element: IMermaidElement,
        private _categoryService: CategoryService
    ) {
        super(app);
        this._element = { ...element };
    }
        
    // TODO: styling
    async onOpen() {
        const {contentEl} = this;
        contentEl.addClass("mermaid-tools-edit-element-modal")
        contentEl.createEl('h2', { text: "Edit element" });

        const renderContainerEl = contentEl.createDiv();
        const renderEl = renderContainerEl.createDiv({ text: "rendered diagram" });
        renderEl.addClass("mermaid-tools-element-preview");

        if (!this._mermaid) {
            this._mermaid = await loadMermaid();
        }
        const mermaid = this._mermaid;
        if (!mermaid) {
            throw new Error("Unable to load Mermaid renderer.");
        }

        // dropdown element
        const elementCategoryContainerEl = contentEl.createDiv();
        elementCategoryContainerEl.createEl("label", {text: "Category"});
        const elementCategoryEl = elementCategoryContainerEl.createEl("select");
        
        const categories = this._categoryService.getCategories();
        for (const category of categories) { 
            const option = elementCategoryEl.createEl("option", {text: category.name});
            option.value = category.id;
        }
        elementCategoryEl.value = this._element.categoryId;
        elementCategoryEl.onchange = async () => {
            this._element.categoryId = elementCategoryEl.value;
            await this.renderPreview(mermaid, renderEl);
        }

        // text input
        const elementDescriptionContainerEl = contentEl.createDiv();
        elementDescriptionContainerEl.createEl("label", {text: "Description"});
        const elementDescriptionEl = elementDescriptionContainerEl.createEl("input", {value: this._element.description, type: "text"});
        elementDescriptionEl.addClass("mermaid-tools-element-description-input");
        elementDescriptionEl.onchange = () => { 
            this._element.description = elementDescriptionEl.value; 
        }

        // textbox input
        const elementContentContainerEl = contentEl.createDiv();
        elementContentContainerEl.createEl("label", {text: "Content"});
        const elementContentEl = elementContentContainerEl.createEl("textarea", {text: this._element.content});
        elementContentEl.addClass("mermaid-tools-element-content-input");
        elementContentEl.onchange = async () => { 
            this._element.content = elementContentEl.value;
            await this.renderPreview(mermaid, renderEl);
        }

        // save button
        const saveButtonEl = contentEl.createEl("button", {text: "Save"});
        saveButtonEl.onclick = () => { 
            void this.save();
        }

        await this.renderPreview(mermaid, renderEl);
    }

    async save(): Promise<void> {
        await this._plugin._mermaidElementService.saveElement(this._element, this._plugin);
        this.close();
    }

    private async renderPreview(mermaid: MermaidRenderer, renderEl: HTMLElement): Promise<void> {
        try {
            const { svg } = await mermaid.render(createMermaidPreviewId(), this._plugin._mermaidElementService.wrapAsCompleteDiagram(this._element));
            renderEl.removeClass("mermaid-tools-render-error");
            setMermaidSvgContent(renderEl, svg);
        } catch (error) {
            renderEl.empty();
            renderEl.addClass("mermaid-tools-render-error");
            renderEl.createDiv({ text: "Unable to render preview" });
            const errorEl = renderEl.createDiv({ text: getErrorMessage(error) });
            errorEl.addClass("mermaid-tools-render-error-message");
        }
    }
    
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function createMermaidPreviewId(): string {
    return `mermaid-tools-edit-preview-${crypto.randomUUID()}`;
}
