import MermaidPlugin from "main";
import { App, Modal, loadMermaid } from "obsidian";
import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export class EditMermaidElementModal extends Modal {

    /**
     *
     */
    constructor(app: App, private _plugin: MermaidPlugin, private _mermaid: any, private _element: IMermaidElement) {
        super(app);
    }
        
    // TODO: styling
    async onOpen() {
        let {contentEl} = this;
        contentEl.addClass("mermaid-tools-edit-element-modal")
        contentEl.createEl('h2', { text: "Edit element" });

        let renderContainerEl = contentEl.createDiv();
        let renderEl = renderContainerEl.createEl("pre", {text: "rendered diagram"});

        if (!this._mermaid)
            this._mermaid = await loadMermaid();

        renderEl.id = "mermaid-edit-element-modal"

        // dropdown element
        let elementCategoryContainerEl = contentEl.createDiv();
        elementCategoryContainerEl.createEl("label", {text: "Category"});
        let elementCategoryEl = elementCategoryContainerEl.createEl("select");
        for (let category in ElementCategory) { 
            let option = elementCategoryEl.createEl("option", {text: category});
            option.value = category;
        }
        elementCategoryEl.value = this._element.category;
        elementCategoryEl.onchange = (e) => {
            this._element.category = elementCategoryEl.value as ElementCategory;
        }

        // text input
        let elementDescriptionContainerEl = contentEl.createDiv();
        elementDescriptionContainerEl.createEl("label", {text: "Description"});
        let elementDescriptionEl = elementDescriptionContainerEl.createEl("input", {value: this._element.description, type: "text"});
        elementDescriptionEl.style.minWidth = "50%";
        elementDescriptionEl.onchange = (e) => { 
            this._element.description = elementDescriptionEl.value; 
        }

        // textbox input
        let elementContentContainerEl = contentEl.createDiv();
        elementContentContainerEl.createEl("label", {text: "Content"});
        let elementContentEl = elementContentContainerEl.createEl("textarea", {text: this._element.content});
        elementContentEl.style.height = "200px";
        elementContentEl.style.width = "100%";
        elementContentEl.onchange = async (e) => { 
            this._element.content = elementContentEl.value; 
            await this._mermaid.render(renderEl.id, this._plugin._mermaidElementService.wrapAsCompleteDiagram(this._element), (svg: any, bindFunctions: any) => {
                renderEl.innerHTML = svg;
                renderContainerEl.appendChild(renderEl);
            });
        }

        // save button
        let saveButtonEl = contentEl.createEl("button", {text: "Save"});
        saveButtonEl.onclick = (e) => { 
            this.save();
        }


        await this._mermaid.render(renderEl.id, this._plugin._mermaidElementService.wrapAsCompleteDiagram(this._element), (svg: any, bindFunctions: any) => {
            renderEl.innerHTML = svg;
            renderContainerEl.appendChild(renderEl);
        });
    }

    save() {
        this._plugin.settings.elements.forEach(element => {
            if (element.id === this._element.id) {
                element = this._element;
                this._plugin.saveSettings();
                this.close();
            }
        });
        
        this._plugin.settings.elements.push(this._element);
        this.close();
    }
    
}