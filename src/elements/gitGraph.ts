
import { IMermaidElement } from "src/core/IMermaidElement";

export let gitGraphElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		categoryId: "gitGraph",
		description: "simple git graph",
		content: `gitGraph
        commit
        commit
        branch develop
        checkout develop
        commit
        commit
        checkout main
        merge develop
        commit
        commit`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "gitGraph",
		description: "tagged commit",
		content: `commit id: "Normal" tag: "v1.0.0"`,
		sortingOrder: 1,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "gitGraph",
		description: "reverse commit",
		content: `commit id: "Reverse" type: REVERSE`,
		sortingOrder: 2,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "gitGraph",
		description: "highlighted commit",
		content: `commit id: "Highlight" type: HIGHLIGHT`,
		sortingOrder: 3,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "gitGraph",
		description: "reverse commit",
		content: `commit id: "Reverse" type: REVERSE`,
		sortingOrder: 4,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "gitGraph",
		description: "git graph with cherry-pick",
		content: `gitGraph
        commit id: "ZERO"
        branch develop
        commit id:"A"
        checkout main
        commit id:"ONE"
        checkout develop
        commit id:"B"
        checkout main
        commit id:"TWO"
        cherry-pick id:"A"
        commit id:"THREE"
        checkout develop
        commit id:"C"`,
		sortingOrder:5,
		isPinned: false,
	},
];
