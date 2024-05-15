import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export const quadrantElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.QuadrantChart,
		description: "sample quadrant chart",
		content: `quadrantChart
		title Reach and engagement of campaigns
		x-axis Low Reach --> High Reach
		y-axis Low Engagement --> High Engagement
		quadrant-1 We should expand
		quadrant-2 Need to promote
		quadrant-3 Re-evaluate
		quadrant-4 May be improved
		Campaign A: [0.3, 0.6]
		Campaign B: [0.45, 0.23]
		Campaign C: [0.57, 0.69]
		Campaign D: [0.78, 0.34]
		Campaign E: [0.40, 0.34]
		Campaign F: [0.35, 0.78]`,
		sortingOrder: 1,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.QuadrantChart,
		description: "themed quadrant chart",
		content: `%%{init: {"quadrantChart": {"chartWidth": 400, "chartHeight": 400}, "themeVariables": {"quadrant1TextFill": "#ff0000"} }}%%
		quadrantChart
		  x-axis Urgent --> Not Urgent
		  y-axis Not Important --> "Important ❤"
		  quadrant-1 Plan
		  quadrant-2 Do
		  quadrant-3 Delegate
		  quadrant-4 Delete`,
		sortingOrder: 1,
		isPinned: false,
	},
];
