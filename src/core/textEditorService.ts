import { App, Editor, MarkdownView } from "obsidian";

export class TextEditorService {
    private _editor: Editor | undefined;

    constructor(app: App) {
        this.updateEditor(app);
    }

    insertContentAtCursor(content: string): void {
        if (!this._editor) return;
        this._editor.replaceRange(content, this._editor.getCursor());
    }

    updateEditor(app: App) {
        this._editor = app.workspace.getActiveViewOfType(MarkdownView)?.editor;
    }
}