import { ItemView, WorkspaceLeaf } from "obsidian";
import { TextEditorService } from "src/core/textEditorService";
import { ElementCategory } from "../../core/ElementCategory";
import {TRIDENT_ICON_NAME} from "main";
import MermaidPlugin from "main";
import { createMermaidToolbar } from "./viewHelpers";
import { IMermaidElement } from "src/core/IMermaidElement";
import { MermaidToolbarButton } from "./mermaidToolbarButtons";

export class MermaidToolbarView extends ItemView {
    static readonly VIEW_TYPE = "mermaid-toolbar-view"; 
    static readonly VIEW_DESCRIPTION = "Mermaid Toolbar";

    private _plugin: MermaidPlugin;
    private items: IMermaidElement[];

    topRowButtons: MermaidToolbarButton[] = [
        new MermaidToolbarButton(
            "insert Mermaid code block with sample diagram",
            "code-2", 
            () => this.insertTextAtCursor(
                this._plugin._mermaidElementService.getSampleDiagram(
                    this._plugin.settings.selectedCategory))
        ),
        new MermaidToolbarButton(
            "open Mermaid.js documentation web page",
            "external-link",
            () => window.open("https://mermaid.js.org/intro/")
        ),
        new MermaidToolbarButton(
            "open settings",
            "settings",
            () => {
                (this.app as any).setting.open();
                (this.app as any).setting.openTabById("mermaid-tools");
            }
        )
    ]

    constructor(leaf: WorkspaceLeaf, plugin: MermaidPlugin) {
        super(leaf);
        this._plugin = plugin;
        this.items = plugin.settings.elements;
        this.containerEl.children[1].addClass("mermaid-toolbar-container");
    }

    async onOpen() {
        await this.recreateToolbar(this._plugin.settings.selectedCategory);
    }
    
    async onClose() {
    // Nothing to clean up.
    }

    async recreateToolbar(selectedCategory: ElementCategory): Promise<any> {
        const container = this.containerEl.children[1];
        container.empty();

        let toolbarElement = await createMermaidToolbar(
            this.topRowButtons,
            this.items, 
            selectedCategory,
            async (newCat) => {
                this._plugin.settings.selectedCategory = newCat;
                this._plugin.saveSettings();
                await this.recreateToolbar(this._plugin.settings.selectedCategory);
            },
            text => this.insertTextAtCursor(text));
        container.appendChild(toolbarElement);
    }

    private insertTextAtCursor(text: string) {
        this._plugin.insertTextAtCursor(text);
    }

    getViewType(): string {
        return MermaidToolbarView.VIEW_TYPE;
    }
    getDisplayText(): string {
        return MermaidToolbarView.VIEW_DESCRIPTION;
    }

    getIcon(): string {
        return TRIDENT_ICON_NAME;
    }


}

