import {  Notice, Plugin } from 'obsidian';
import { TextEditorService } from 'src/core/textEditorService';
import { MermaidPluginSettings } from 'src/settings/settings';
import { MermaidTolbar } from 'src/ui/mermaidToolbar';

export default class MermaidPlugin extends Plugin {
	settings: MermaidPluginSettings;
    private _textEditorService = new TextEditorService(this.app);
    private toolbar = MermaidTolbar.DefaultToolbar(this._textEditorService);
	readonly openModalIconName: string = "simple-note-review-icon";
	
    async onload(): Promise<void> {
        
        this.registerEvent(this.app.workspace.on('click', () => {
            this._textEditorService.updateEditor(this.app);
        }));

		this.addCommand({
			id: "show-toolbar",
			name: "Show Toolbar",
			callback: () => {
				this.toolbar.show();
			},
		});

		this.addCommand({
			id: "hide-tolbar",
			name: "Hide Toolbar",
			callback: () => {
				this.toolbar.hide();
			},
		});

    }

    async onunload(): Promise<void> {
        
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

	public showNotice(message: string) : void {
		new Notice(message);
	}

}