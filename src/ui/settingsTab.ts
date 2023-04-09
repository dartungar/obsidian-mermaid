import MermaidPlugin from "main";
import { App, PluginSettingTab, Setting, loadMermaid } from "obsidian";
import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";
import { EditMermaidElementModal } from "./editMermaidElementModal";
import { MermaidElementBase } from "src/core/mermaidElementBase";


export class MermaidToolsSettingsTab extends PluginSettingTab {

    /**
     *
     */
    constructor(private _app: App, private _plugin: MermaidPlugin) {
        super(_app, _plugin);
    
    }

    async display() {
        await renderElements(this.containerEl, this._plugin);
    }

}


async function renderElements(containerEl: HTMLElement, plugin: MermaidPlugin) {
    let mermaid = await loadMermaid();
    
    containerEl.empty();

    containerEl.createEl('h1', { text: 'Mermaid Tools Settings' });

    containerEl.createEl('h2', { text: 'Manage elements' });

    createAddButton(containerEl, plugin);

    for (let category in ElementCategory) { 
        renderElementCategory(category as ElementCategory, plugin, containerEl, mermaid);
    };        

}

function renderElementCategory(category: ElementCategory, plugin: MermaidPlugin, parentEl: HTMLElement, mermaid: any) {
    let copy = [...plugin.settings.elements];
    let elements = copy.filter(e => e.category === category);

    // for re-rendering
    let containerEl = document.getElementById(category + "-container");
    let isFirstRender = !containerEl;
    containerEl ??= parentEl.createDiv();
    containerEl.id = category + "-container";
    containerEl.innerHTML = ""

    let header = containerEl.createEl('h3', { text: category });
    
    header.addClass("mermaid-tools-element-category-header");

    let elementsContainerEl = containerEl.createDiv();
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
        let settingContainer = elementsContainerEl.createDiv("mermaid-tools-element-container");

        const setting = new Setting(settingContainer);

        setting.setName(element.description);

        setting.addExtraButton(cb => {
            cb.setIcon('edit')
            .setTooltip("edit element")
            .onClick(() => {
                let modal = new EditMermaidElementModal(plugin.app, plugin, mermaid, element);
                modal.open();
                modal.onClose = () => {  renderElementCategory(category, plugin, parentEl, mermaid); }
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('copy')
            .setTooltip("create a duplicate of this element")
            .onClick(() => {
                let duplicate : IMermaidElement =  {
                    id: crypto.randomUUID(),
                    category: element.category,
                    description: element.description + " (copy)",
                    content: element.content,
                    sortingOrder: plugin.settings.elements.filter(el => el.category === element.category).length,
                    isPinned: element.isPinned,
                };
                plugin._mermaidElementService.saveElement(duplicate, plugin);
                plugin.saveSettings();
                renderElementCategory(category, plugin, parentEl, mermaid);
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
                    plugin.settings.elements = plugin.settings.elements.filter(el => el.category !== category).concat(elements);
                    plugin.saveSettings();
                    renderElementCategory(category, plugin, parentEl, mermaid);
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
                    plugin.settings.elements = plugin.settings.elements.filter(el => el.category !== category).concat(elements);
                    plugin.saveSettings();
                    renderElementCategory(category, plugin, parentEl, mermaid);
                }
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('trash-2')
            .setTooltip("delete element")
            .onClick(() => {
                plugin.settings.elements = plugin.settings.elements.filter(e => e.id !== element.id);
                plugin.saveSettings();
                renderElementCategory(category, plugin, parentEl, mermaid);
            })
        });

    });
}

function createAddButton(parentEl: HTMLElement, plugin: MermaidPlugin): void {
    const addButton = parentEl.createEl("button", {text: "Add"})
    addButton.innerHTML = "Add an element";

    addButton.onclick = () => {
        let newElement: IMermaidElement = { 
            id: crypto.randomUUID(),
            description: "New element",
            content: `flowchart TD\nStart --> Stop`,
            category: ElementCategory.Flowchart,
            sortingOrder: 0,
            isPinned: false
        };

        let modal = new EditMermaidElementModal(plugin.app, plugin, null, newElement);
        modal.open();
        modal.onClose = () => {  renderElementCategory(modal._element.category, plugin, parentEl, null); }
        
    };
}
