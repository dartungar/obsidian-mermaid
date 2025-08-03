import { ItemView, WorkspaceLeaf } from "obsidian";
import { CategoryService } from "src/core/categoryService";
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
    private categoryService: CategoryService;

    topRowButtons: MermaidToolbarButton[] = [
        new MermaidToolbarButton(
            "insert Mermaid code block with sample diagram",
            "code-2", 
            () => this.insertTextAtCursor(
                this._plugin._mermaidElementService.getSampleDiagram(
                    this._plugin.settings.selectedCategoryId))
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
        this.categoryService = CategoryService.getInstance();
        // Load custom categories
        this.categoryService.loadCategories(plugin.settings.customCategories);
        this.containerEl.children[1].addClass("mermaid-toolbar-container");
    }

    async onOpen() {
        await this.recreateToolbar(this._plugin.settings.selectedCategoryId);
    }
    
    async onClose() {
    // Nothing to clean up.
    }

    async recreateToolbar(selectedCategoryId: string): Promise<void> {
        const container = this.containerEl.children[1];
        container.empty();

        const toolbarElement = await createMermaidToolbar(
            this.topRowButtons,
            this.items, 
            selectedCategoryId,
            async (newCategoryId) => {
                this._plugin.settings.selectedCategoryId = newCategoryId;
                this._plugin.saveSettings();
                await this.recreateToolbar(this._plugin.settings.selectedCategoryId);
            },
            text => this.insertTextAtCursor(text),
            this.categoryService);
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

