import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export let pieChartElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.PieChart,
		description: "sample pie chart",
		content: `pie title /r/obsidianmd posts by type
        "Look at my awesome graph" : 85
        "Look at my cool dashboard" : 14
        "Moved from Notion, liking it" : 1`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.PieChart,
		description: "sample pie chart with values shown in legend",
		content: `pie showdata
        title /r/obsidianmd posts by type
        "Graphs" : 85
        "Dashboards" : 14
        "Tips" : 1`,
		sortingOrder: 0,
		isPinned: false,
	},
];
