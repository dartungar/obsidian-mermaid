import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export let mindMapElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.Mindmap,
		description: "a simple mindmap",
		content: `mindmap
        Root
            A
              B
              C`,
		sortingOrder: 1,
		isPinned: false,
	},
    {
		id: crypto.randomUUID(),
		category: ElementCategory.Mindmap,
		description: "square",
		content: `id[I am a square]`,
		sortingOrder: 2,
		isPinned: false,
	},
    {
		id: crypto.randomUUID(),
		category: ElementCategory.Mindmap,
		description: "rounded square",
		content: `id(I am a rounded square)`,
		sortingOrder: 3,
		isPinned: false,
	},
    {
		id: crypto.randomUUID(),
		category: ElementCategory.Mindmap,
		description: "circle",
		content: `id((I am a circle))`,
		sortingOrder: 4,
		isPinned: false,
	},
    {
		id: crypto.randomUUID(),
		category: ElementCategory.Mindmap,
		description: "bang",
		content: `id))I am a bang((`,
		sortingOrder: 5,
		isPinned: false,
	},
    {
		id: crypto.randomUUID(),
		category: ElementCategory.Mindmap,
		description: "cloud",
		content: `id)I am a cloud(`,
		sortingOrder: 6,
		isPinned: false,
	},
    {
		id: crypto.randomUUID(),
		category: ElementCategory.Mindmap,
		description: "hexagon",
		content: `id{{I am a hexagon}}`,
		sortingOrder: 7,
		isPinned: false,
	},
    {
		id: crypto.randomUUID(),
		category: ElementCategory.Mindmap,
		description: "default",
		content: `I am the default shape`,
		sortingOrder: 8,
		isPinned: false,
	},
    {
		id: crypto.randomUUID(),
		category: ElementCategory.Mindmap,
		description: "sample mindmap",
		content: `mindmap
        root((mindmap))
          Origins
            Long history
            Popularisation
              British popular psychology author Tony Buzan
          Research
            On effectiveness<br/>and features
            On Automatic creation
              Uses
                  Creative techniques
                  Strategic planning
                  Argument mapping
          Tools
            Pen and paper
            Mermaid`,
		sortingOrder: 9,
		isPinned: false,
	},

];
