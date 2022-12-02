import { App, Editor, MarkdownView } from "obsidian";
import { MermaidElementService } from "./elementService";

export class NoActiveCursorError extends Error { 
    constructor() {
        super();
        this.message = "Mermaid Tools: Error getting cursor position. Make sure you are in editing mode and have an active cursor in file content."
    }
}

export class TextEditorService {
    private _editor: Editor | undefined;
    private _elementService = new MermaidElementService();

    constructor(app: App) {
        this.updateEditor(app);
    }

    public insertTextAtCursor(content: string): void {
        if (!this._editor) 
            throw new NoActiveCursorError();
        content = this._elementService.wrapForPastingIntoEditor(content);
        let cursor = this._editor.getCursor();
        this._editor!!.replaceRange(content, cursor);
        this._editor!!.setCursor(content.length);
    }

    public updateEditor(app: App) {
        let newEditor = app.workspace.getActiveViewOfType(MarkdownView)?.editor;
        if (!newEditor) return;
        this._editor = newEditor;
    }
}