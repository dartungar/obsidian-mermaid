import { ItemView, WorkspaceLeaf } from "obsidian";
import { CategoryService } from "src/core/categoryService";
import {TRIDENT_ICON_NAME} from "main";
import MermaidPlugin from "main";
import { createMermaidToolbar } from "./viewHelpers";
import { IMermaidElement } from "src/core/IMermaidElement";
import { MermaidToolbarButton } from "./mermaidToolbarButtons";
import { getMermaidPreviewTheme } from "src/core/mermaidRenderer";

interface SettingsApi {
    open(): void;
    openTabById(id: string): void;
}

interface AppWithSettings {
    setting?: SettingsApi;
}

export class MermaidToolbarView extends ItemView {
    static readonly VIEW_TYPE = "mermaid-toolbar-view"; 
    static readonly VIEW_DESCRIPTION = "Mermaid Toolbar";

    private _plugin: MermaidPlugin;
    private items: IMermaidElement[];
    private categoryService: CategoryService;
    private previewTheme: "dark" | "default";
    private toolbarRenderVersion = 0;

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
            () => window.open("https://mermaid.js.org/intro/", "_blank", "noopener")
        ),
        new MermaidToolbarButton(
            "open settings",
            "settings",
            () => {
                const settings = (this.app as AppWithSettings).setting;
                settings?.open();
                settings?.openTabById("mermaid-tools");
            }
        )
    ]

    constructor(leaf: WorkspaceLeaf, plugin: MermaidPlugin) {
        super(leaf);
        this._plugin = plugin;
        this.items = plugin.settings.elements;
        this.categoryService = CategoryService.getInstance();
        // Load custom categories
        this.categoryService.loadCategories(
            plugin.settings.customCategories,
            plugin.settings.defaultCategorySortOrders,
            plugin.settings.categoryModifications);
        this.containerEl.children[1].addClass("mermaid-toolbar-container");
        this.previewTheme = getMermaidPreviewTheme(this.containerEl.ownerDocument);
        this.registerEvent(this.app.workspace.on("css-change", () => {
            const theme = getMermaidPreviewTheme(this.containerEl.ownerDocument);
            if (theme !== this.previewTheme) {
                void this.recreateToolbar(this._plugin.settings.selectedCategoryId);
            }
        }));
    }

    async onOpen() {
        await this.recreateToolbar(this._plugin.settings.selectedCategoryId);
    }
    
    async onClose() {
        this.toolbarRenderVersion++;
    }

    async recreateToolbar(selectedCategoryId: string): Promise<void> {
        const renderVersion = ++this.toolbarRenderVersion;
        this.previewTheme = getMermaidPreviewTheme(this.containerEl.ownerDocument);
        this.items = this._plugin.settings.elements;
        this.categoryService.loadCategories(
            this._plugin.settings.customCategories,
            this._plugin.settings.defaultCategorySortOrders,
            this._plugin.settings.categoryModifications);

        const container = this.containerEl.children[1];
        container.empty();

        const toolbarElement = await createMermaidToolbar(
            this.topRowButtons,
            this.items, 
            selectedCategoryId,
            (newCategoryId) => {
                this._plugin.settings.selectedCategoryId = newCategoryId;
                void this._plugin.saveSettings({ refreshToolbar: false });
            },
            text => this.insertTextAtCursor(text),
            this.categoryService,
            this.containerEl.ownerDocument);
        // A theme/settings change may have started a newer render while awaiting
        // Mermaid. Only attach the latest toolbar.
        if (renderVersion === this.toolbarRenderVersion) {
            container.appendChild(toolbarElement);
        }
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
