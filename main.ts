import {  Editor, Notice, Plugin } from 'obsidian';
import { MermaidElementService } from 'src/core/elementService';
import { TextEditorService } from 'src/core/textEditorService';
import { MermaidPluginSettings } from 'src/settings/settings';
import { addTridentIcon } from 'src/trident-icon';
import { MermaidToolbarView } from 'src/ui/toolbarView/mermaidToolbarView';

export const TRIDENT_ICON_NAME = "trident-custom";


export default class MermaidPlugin extends Plugin {
	settings: MermaidPluginSettings;
	private activeEditor: Editor;
	public _mermaidElementService = new MermaidElementService();
    private _textEditorService = new TextEditorService();
	
    async onload(): Promise<void> {
        await this.loadSettings();

		addTridentIcon();

		this.registerView(
			MermaidToolbarView.VIEW_TYPE,
			(leaf) => new MermaidToolbarView(leaf, this)
		);

		// keep track of last active editor
		// cannot simply call this.app.workspace.activeEditor ad hoc 
		// because Editor will be null when using Mermaid toolbar view
		this.app.workspace.on('active-leaf-change', (leaf) => {
            this.activeEditor = this.app.workspace.activeEditor?.editor ?? this.activeEditor;
        });

		this.addRibbonIcon(TRIDENT_ICON_NAME, "Open Mermaid Toolbar", () => {
			this.activateView();
		});

		this.addCommand({
			id: "open-toolbar",
			name: "Open Toolbar View",
			callback: () => {
				this.activateView();
			},
		});
    }

    async onunload(): Promise<void> {
        this.app.workspace.detachLeavesOfType(MermaidToolbarView.VIEW_TYPE);
    }

    async loadSettings() {
		this.settings = Object.assign(
			{},
			MermaidPluginSettings.DefaultSettings(),
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(MermaidToolbarView.VIEW_TYPE);
	
		await this.app.workspace.getRightLeaf(false).setViewState({
		  type: MermaidToolbarView.VIEW_TYPE,
		  active: true,
		});
	
		this.app.workspace.revealLeaf(
		  this.app.workspace.getLeavesOfType(MermaidToolbarView.VIEW_TYPE)[0]
		);
	}

	public insertTextAtCursor(text: string) {
		this._textEditorService.insertTextAtCursor(this.activeEditor, text);
	}
}