import { Editor } from "obsidian";
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
        const cursor = editor.getCursor();
        editor.replaceRange(content, cursor);

        const lines = content.split("\n");
        const newCursor = {
        line: cursor.line + lines.length - 1,
        ch: lines.length === 1
            ? cursor.ch + lines[0].length
            : lines[lines.length - 1].length
        };
        editor.setCursor(newCursor); 
        editor.focus();
    }
}