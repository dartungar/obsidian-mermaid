import { IMermaidElement } from "src/core/IMermaidElement";
export let sequenceDiagramElements: IMermaidElement[] = [
	// sequence diagram
	{
		id: crypto.randomUUID(),
		categoryId: "sequenceDiagram",
		description: "a simple sequence diagram",
		content: `sequenceDiagram\nAlice->>John: Hello John, how are you?\nJohn-->>Alice: Great!\nAlice-)John: See you later!`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "sequenceDiagram",
		description: "a simple sequence diagram with actors",
		content: `sequenceDiagram\nactor Alice\nactor John\nAlice->>John: Hello John, how are you?\nJohn-->>Alice: Great!\nAlice-)John: See you later!`,
		sortingOrder: 1,
		isPinned: false,
	},
];
