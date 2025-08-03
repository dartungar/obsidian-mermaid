
import { IMermaidElement } from "src/core/IMermaidElement";

export const sankeyDiagramElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		categoryId: "sankeyDiagram",
		description: "",
		content: `sankey-beta
        %% source,target,value
        Electricity grid,Over generation / exports,104.453
        Electricity grid,Heating and cooling - homes,113.726
        Electricity grid,H2 conversion,27.14`,
		sortingOrder: 0,
		isPinned: false,
	},
]
