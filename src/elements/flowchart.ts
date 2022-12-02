import { IMermaidElement } from "src/core/IMermaidElement";
import { ElementCategory } from "../core/ElementCategory";

export let flowchartElements: IMermaidElement[] = [
        // flowchart
        {
            category: ElementCategory.Flowchart,
            description: "a simple flowchart with top to down direction",
            content: `flowchart TD\nStart --> Stop`,
            sortingOrder: 1,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "a simple flowchart with left to right direction",
            content: "flowchart LR\nStart --> Stop",
            sortingOrder: 2,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "A node with round edges",
            content: "id1(Some text)",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "A stadium-shaped node",
            content: "id1([Some text])",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "A node in a cylindrical shape",
            content: "id1[(Database)]",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "A node in the form of a circle",
            content: "id1((Some text))",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "A node (rhombus)",
            content: "id1{Some text}",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "A link with arrow head",
            content: "A-->B",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "An open link",
            content: "A --- B",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "Text on links",
            content: "A-- This is the text! ---B",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "A link with arrow head and text",
            content: "A-->|text|B",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "Dotted link",
            content: "A-.->B",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "Thick link",
            content: "A ==> B",
            sortingOrder: 3,
            isPinned: false
        },
        {
            category: ElementCategory.Flowchart,
            description: "Subgraph",
            content: "subgraph one\na1-->a2\nend",
            sortingOrder: 3,
            isPinned: false
        },
]