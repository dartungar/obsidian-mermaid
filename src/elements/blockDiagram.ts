import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export const blockDiagramElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.Block,
		description: "a sample block diagram",
		content: `block-beta
columns 1
  db(("DB"))
  blockArrowId6<["&nbsp;&nbsp;&nbsp;"]>(down)
  block:ID
    A
    B["A wide one in the middle"]
    C
  end
  space
  D
  ID --> D
  C --> D
  style B fill:#969,stroke:#333,stroke-width:4px
`,
		sortingOrder: 0,
		isPinned: false,
	},
]