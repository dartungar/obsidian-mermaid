import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";


export let gitGraphElements: IMermaidElement[] = [
    {
        category: ElementCategory.GitGraph,
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
        isPinned: false
    },
    {
        category: ElementCategory.GitGraph,
        description: "tagged commit",
        content: `commit id: "Normal" tag: "v1.0.0"`,
        sortingOrder: 0,
        isPinned: false
    },
    {
        category: ElementCategory.GitGraph,
        description: "reverse commit",
        content: `commit id: "Reverse" type: REVERSE`,
        sortingOrder: 0,
        isPinned: false
    },
    {
        category: ElementCategory.GitGraph,
        description: "highlighted commit",
        content: `commit id: "Highlight" type: HIGHLIGHT`,
        sortingOrder: 0,
        isPinned: false
    },
    {
        category: ElementCategory.GitGraph,
        description: "reverse commit",
        content: `commit id: "Reverse" type: REVERSE`,
        sortingOrder: 0,
        isPinned: false
    },
    {
        category: ElementCategory.GitGraph,
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
        sortingOrder: 0,
        isPinned: false
    },
    
]