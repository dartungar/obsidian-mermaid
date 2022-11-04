import { ItemView, WorkspaceLeaf } from "obsidian";
import { TextEditorService } from "src/core/textEditorService";
import { IMermaidToolbarItem } from "./IMermaidToolbarItem";
import { MermaidToolbarItemCategory } from "./MermaidToolbaItemCategory";


export class MermaidTolbarView extends ItemView {
    static readonly VIEW_TYPE = "mermaid-toolbar-view"; 
    static readonly VIEW_DESCRIPTION = "Mermaid Toolbar";

    private _textEditorService: TextEditorService;

    private items: IMermaidToolbarItem[];
    private current_category: MermaidToolbarItemCategory;

    /**
     *
     */
    constructor(leaf: WorkspaceLeaf, textEditorService: TextEditorService) {
        super(leaf);
        this._textEditorService = textEditorService;
    }

    getViewType(): string {
        return MermaidTolbarView.VIEW_TYPE;
    }
    getDisplayText(): string {
        return MermaidTolbarView.VIEW_DESCRIPTION;
    }

    
}