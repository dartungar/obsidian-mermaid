import MermaidPlugin from "main";
import { App, PluginSettingTab, Setting, loadMermaid } from "obsidian";
import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";
import { EditMermaidElementModal } from "./editMermaidElementModal";


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
    var copy = [...plugin.settings.elements];
    let elements = copy.filter(e => e.category === category);
    let header = parentEl.createEl('h4', { text: category });
    
    header.addClass("mermaid-tools-element-category-header", "collapsed");

    let containerEl = parentEl.createDiv();
    containerEl.addClass("mermaid-tools-element-category-container");
    containerEl.hidden = true;

    header.onClickEvent(() => {
        header.classList.toggle("collapsed");
        containerEl.hidden = !containerEl.hidden;
     });


    elements
    .sort((a, b) => a.sortingOrder - b.sortingOrder)
    .forEach(async (element, index) => {
        let settingContainer = containerEl.createDiv("mermaid-tools-element-container");

        const setting = new Setting(settingContainer);

        setting.setName(element.description);

        setting.addExtraButton(cb => {
            cb.setIcon('edit')
            .setTooltip("edit element")
            .onClick(() => {
                new EditMermaidElementModal(plugin.app, plugin, mermaid, element).open();
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('arrow-up')
            .setTooltip("move element up")
            .onClick(() => {
                // TODO
                if (index > 0) {
                    const temp = elements[index - 1].sortingOrder;
                    elements[index - 1].sortingOrder = element.sortingOrder;
                    element.sortingOrder = temp;
                    plugin.settings.elements = elements;
                    plugin.saveSettings();
                    renderElements(containerEl, plugin);
                }
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('arrow-down')
            .setTooltip("move element down")
            .onClick(() => {
                if (index < elements.length - 1) {
                    const temp = elements[index - 1].sortingOrder;
                    elements[index - 1].sortingOrder = element.sortingOrder;
                    element.sortingOrder = temp;
                    plugin.settings.elements = elements;
                    plugin.saveSettings();
                    renderElements(containerEl, plugin);
                }
            })
        });

        setting.addExtraButton(cb => {
            cb.setIcon('trash-2')
            .setTooltip("delete element")
            .onClick(() => {
                plugin.settings.elements = plugin.settings.elements.filter(e => e.id !== element.id);
                plugin.saveSettings();
                renderElements(containerEl, plugin);
            })
        });

    });
}

function createAddButton(parentEl: HTMLElement, plugin: MermaidPlugin): void {
    const addButton = parentEl.createEl("button", {text: "Add"})
    addButton.innerHTML = "New element";

    addButton.onclick = () => {
        // TODO: show add element modal

        let newElement: IMermaidElement = { 
            id: crypto.randomUUID(),
            description: "New element",
            content: `flowchart TD\nStart --> Stop`,
            category: ElementCategory.Flowchart,
            sortingOrder: plugin.settings.elements.length,
            isPinned: false
        };
        
        new EditMermaidElementModal(plugin.app, plugin, null, newElement).open();
    };
}
