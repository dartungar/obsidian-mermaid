import {  Editor, Notice, Plugin } from 'obsidian';
import { ElementCategory } from 'src/core/ElementCategory';
import { MermaidElementService } from 'src/core/elementService';
import { TextEditorService } from 'src/core/textEditorService';
import { c4DiagramElements } from 'src/elements/c4Diagram';
import { mindMapElements } from 'src/elements/mindMap';
import { quadrantElements } from 'src/elements/quadrant';
import { timelineElements } from 'src/elements/timeline';
import { MermaidPluginSettings } from 'src/settings/settings';
import { addTridentIcon } from 'src/trident-icon';
import { MermaidToolsSettingsTab } from 'src/ui/settingsTab';
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

		this.addSettingTab(new MermaidToolsSettingsTab(this.app, this));
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

		this.addNewCategories();
	}

	addNewCategories() {
		if (!this.settings.elements.some(x => x.category === ElementCategory.Mindmap)) {
			this.settings.elements.push(...mindMapElements);
			console.log("[Mermaid Tools] added Mindmap elements");
		};
		if (!this.settings.elements.some(x => x.category === ElementCategory.Timeline)) {
			this.settings.elements.push(...timelineElements);
			console.log("[Mermaid Tools] added Timeline elements");
		};
		if (!this.settings.elements.some(x => x.category === ElementCategory.QuadrantChart)) {
			this.settings.elements.push(...quadrantElements);
			console.log("[Mermaid Tools] added QuadrantChart elements");
		};
		if (!this.settings.elements.some(x => x.category === ElementCategory.C4Diagram)) {
			this.settings.elements.push(...c4DiagramElements);
			console.log("[Mermaid Tools] added C4 diagram elements");
		};
	}

	async saveSettings() {
		await this.saveData(this.settings);
		await this.activateView();
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