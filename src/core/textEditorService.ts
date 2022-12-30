import { App, Editor, MarkdownView } from "obsidian";
import { MermaidElementService } from "./elementService";

export class NoActiveCursorError extends Error { 
    constructor() {
        super();
        this.message = "Mermaid Tools: Error getting cursor position. Make sure you are in editing mode and have an active cursor in file content."
    }
}

export class TextEditorService {
    private _elementService = new MermaidElementService();

    public insertTextAtCursor(editor: Editor, content: string): void {
        if (!editor) 
            throw new NoActiveCursorError();
        content = this._elementService.wrapForPastingIntoEditor(content);
        let cursor = editor.getCursor();
        editor.replaceRange(content, cursor);
        editor.setCursor(content.length);
    }
}