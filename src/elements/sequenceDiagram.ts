import { IMermaidElement } from "src/core/IMermaidElement";
import { ElementCategory } from "../core/ElementCategory";

export let sequenceDiagramElements: IMermaidElement[] = [
	// sequence diagram
	{
		id: crypto.randomUUID(),
		category: ElementCategory.SequenceDiagram,
		description: "a simple sequence diagram",
		content: `sequenceDiagram\nAlice->>John: Hello John, how are you?\nJohn-->>Alice: Great!\nAlice-)John: See you later!`,
		sortingOrder: 1,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.SequenceDiagram,
		description: "a simple sequence diagram with actors",
		content: `sequenceDiagram\nactor Alice\nactor John\nAlice->>John: Hello John, how are you?\nJohn-->>Alice: Great!\nAlice-)John: See you later!`,
		sortingOrder: 1,
		isPinned: false,
	},
];
