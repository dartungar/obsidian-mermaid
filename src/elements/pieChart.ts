import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export const pieChartElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.PieChart,
		description: "sample pie chart",
		content: `pie title /r/obsidianmd posts by type
        "Graphs" : 85
        "Dashboards" : 14
        "Tips" : 1`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.PieChart,
		description: "sample pie chart with values shown in legend",
		content: `pie showData title /r/obsidianmd posts by type
        "Graphs" : 85
        "Dashboards" : 14
        "Tips" : 1`,
		sortingOrder: 1,
		isPinned: false,
	},
];
