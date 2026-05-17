import {  Editor, Notice, Plugin } from 'obsidian';
import { MermaidElementService } from 'src/core/elementService';
import { TextEditorService } from 'src/core/textEditorService';
import { architectureElements } from 'src/elements/architecture';
import { blockDiagramElements } from 'src/elements/blockDiagram';
import { c4DiagramElements } from 'src/elements/c4Diagram';
import { kanbanElements } from 'src/elements/kanban';
import { mindMapElements } from 'src/elements/mindMap';
import { packetElements } from 'src/elements/packet';
import { quadrantElements } from 'src/elements/quadrant';
import { sankeyDiagramElements } from 'src/elements/sankeyDiagram';
import { timelineElements } from 'src/elements/timeline';
import { xyChartElements } from 'src/elements/xyChart';
import { MermaidPluginSettings } from 'src/settings/settings';
import { addTridentIcon } from 'src/trident-icon';
import { MermaidToolsSettingsTab } from 'src/ui/settingsTab';
import { MermaidToolbarView } from 'src/ui/toolbarView/mermaidToolbarView';

export const TRIDENT_ICON_NAME = "trident-custom";

interface SaveSettingsOptions {
	refreshToolbar?: boolean;
}

export default class MermaidPlugin extends Plugin {
	settings: MermaidPluginSettings;
	private activeEditor: Editor | null = null;
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
		this.activeEditor = this.app.workspace.activeEditor?.editor ?? null;
		this.registerEvent(this.app.workspace.on('active-leaf-change', (_leaf) => {
            this.activeEditor = this.app.workspace.activeEditor?.editor ?? this.activeEditor;
        }));

		this.addRibbonIcon(TRIDENT_ICON_NAME, "Open Mermaid Toolbar", () => {
			void this.activateView();
		});

		this.addCommand({
			id: "open-toolbar",
			name: "Open Toolbar View",
			callback: () => {
				void this.activateView();
			},
		});

		this.addSettingTab(new MermaidToolsSettingsTab(this.app, this));
    }

    async onunload(): Promise<void> {
        this.app.workspace.detachLeavesOfType(MermaidToolbarView.VIEW_TYPE);
    }

    async loadSettings() {
		const defaultSettings = MermaidPluginSettings.DefaultSettings();
		const loadedSettings = await this.loadData();
		this.settings = Object.assign(
			{},
			defaultSettings,
			loadedSettings
		);

		this.settings.elements = this.settings.elements ?? defaultSettings.elements;
		this.settings.customCategories = this.settings.customCategories ?? defaultSettings.customCategories;
		this.settings.selectedCategoryId = this.settings.selectedCategoryId ?? defaultSettings.selectedCategoryId;
		this.settings.defaultCategorySortOrders = this.settings.defaultCategorySortOrders ?? defaultSettings.defaultCategorySortOrders;
		this.settings.categoryModifications = this.settings.categoryModifications ?? defaultSettings.categoryModifications;
		this.settings.defaultElementCategoryIds = loadedSettings
			? loadedSettings.defaultElementCategoryIds ?? []
			: defaultSettings.defaultElementCategoryIds;

		if (this.addNewCategories()) {
			await this.saveData(this.settings);
		}
	}

	addNewCategories(): boolean {
		const defaultCategoryElementSets = [
			{ categoryId: "mindmap", elements: mindMapElements },
			{ categoryId: "timeline", elements: timelineElements },
			{ categoryId: "quadrantChart", elements: quadrantElements },
			{ categoryId: "c4Diagram", elements: c4DiagramElements },
			{ categoryId: "sankeyDiagram", elements: sankeyDiagramElements },
			{ categoryId: "xyChart", elements: xyChartElements },
			{ categoryId: "packet", elements: packetElements },
			{ categoryId: "kanban", elements: kanbanElements },
			{ categoryId: "block", elements: blockDiagramElements },
			{ categoryId: "architecture", elements: architectureElements },
		];

		const installedCategoryIds = new Set(this.settings.defaultElementCategoryIds);
		let settingsChanged = false;

		for (const defaultCategory of defaultCategoryElementSets) {
			if (installedCategoryIds.has(defaultCategory.categoryId)) {
				continue;
			}

			if (!this.settings.elements.some(element => element.categoryId === defaultCategory.categoryId)) {
				this.settings.elements.push(...defaultCategory.elements);
			}

			installedCategoryIds.add(defaultCategory.categoryId);
			settingsChanged = true;
		}

		this.settings.defaultElementCategoryIds = Array.from(installedCategoryIds);
		return settingsChanged;
	}

	async saveSettings(options: SaveSettingsOptions = {}) {
		await this.saveData(this.settings);
		if (options.refreshToolbar ?? true) {
			await this.refreshToolbarViews();
		}
	}

	private async refreshToolbarViews(): Promise<void> {
		const toolbarLeaves = this.app.workspace.getLeavesOfType(MermaidToolbarView.VIEW_TYPE);
		await Promise.all(toolbarLeaves.map(async (leaf) => {
			if (leaf.view instanceof MermaidToolbarView) {
				await leaf.view.recreateToolbar(this.settings.selectedCategoryId);
			}
		}));
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(MermaidToolbarView.VIEW_TYPE);

		const leaf = this.app.workspace.getRightLeaf(false) ?? this.app.workspace.getLeaf(true);
		await leaf.setViewState({
			type: MermaidToolbarView.VIEW_TYPE,
			active: true,
		});
	
		await this.app.workspace.revealLeaf(leaf);
	}

	public insertTextAtCursor(text: string) {
		const editor = this.app.workspace.activeEditor?.editor ?? this.activeEditor;
		try {
			this._textEditorService.insertTextAtCursor(editor, text);
			this.activeEditor = editor ?? this.activeEditor;
		} catch (error) {
			new Notice(getErrorMessage(error));
		}
	}
}

function getErrorMessage(error: unknown): string {
	return error instanceof Error ? error.message : String(error);
}
