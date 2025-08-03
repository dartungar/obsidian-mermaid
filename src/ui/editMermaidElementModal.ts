import MermaidPlugin from "main";
import { App, Modal, loadMermaid } from "obsidian";
import { IMermaidElement } from "src/core/IMermaidElement";
import { CategoryService } from "src/core/categoryService";

export class EditMermaidElementModal extends Modal {
    constructor(
        app: App, 
        private _plugin: MermaidPlugin, 
        private _mermaid: any, // Mermaid instance type
        public _element: IMermaidElement,
        private _categoryService: CategoryService
    ) {
        super(app);
    }
        
    // TODO: styling
    async onOpen() {
        const {contentEl} = this;
        contentEl.addClass("mermaid-tools-edit-element-modal")
        contentEl.createEl('h2', { text: "Edit element" });

        const renderContainerEl = contentEl.createDiv();
        const renderEl = renderContainerEl.createEl("pre", {text: "rendered diagram"});

        if (!this._mermaid)
            this._mermaid = await loadMermaid();

        renderEl.id = "mermaid-edit-element-modal"

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
        elementCategoryEl.onchange = (e) => {
            this._element.categoryId = elementCategoryEl.value;
        }

        // text input
        const elementDescriptionContainerEl = contentEl.createDiv();
        elementDescriptionContainerEl.createEl("label", {text: "Description"});
        const elementDescriptionEl = elementDescriptionContainerEl.createEl("input", {value: this._element.description, type: "text"});
        elementDescriptionEl.style.minWidth = "50%";
        elementDescriptionEl.onchange = (e) => { 
            this._element.description = elementDescriptionEl.value; 
        }

        // textbox input
        const elementContentContainerEl = contentEl.createDiv();
        elementContentContainerEl.createEl("label", {text: "Content"});
        const elementContentEl = elementContentContainerEl.createEl("textarea", {text: this._element.content});
        elementContentEl.style.height = "200px";
        elementContentEl.style.width = "100%";
        elementContentEl.onchange = async (e: any) => { 
            this._element.content = elementContentEl.value;
            const {svg} = await this._mermaid.render(renderEl.id, this._plugin._mermaidElementService.wrapAsCompleteDiagram(this._element));
            renderEl.innerHTML = svg;
            renderContainerEl.appendChild(renderEl);
        }

        // save button
        const saveButtonEl = contentEl.createEl("button", {text: "Save"});
        saveButtonEl.onclick = (e) => { 
            this.save();
        }

        const {svg} = await this._mermaid.render(renderEl.id, this._plugin._mermaidElementService.wrapAsCompleteDiagram(this._element));
        renderEl.innerHTML = svg;
        renderContainerEl.appendChild(renderEl);
    }

    save() {
        this._plugin._mermaidElementService.saveElement(this._element, this._plugin);
        this.close();
    }
    
}