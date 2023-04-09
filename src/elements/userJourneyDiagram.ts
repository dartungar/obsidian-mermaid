import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";
import { MermaidElementBase } from "src/core/mermaidElementBase";


export let userJourneyDiagramElements: MermaidElementBase[] = [
    {
        id: crypto.randomUUID(),
        category: ElementCategory.UserJourneyDiagram,
        description: "a sample user journey diagram",
        content: `journey
        title My working day
        section Go to work
          Make tea: 5: Me
          Go upstairs: 3: Me
          Do work: 1: Me, Cat
        section Go home
          Go downstairs: 5: Me
          Sit down: 5: Me`,
        sortingOrder: 0,
        isPinned: false
    },
    {
        id: crypto.randomUUID(),
        category: ElementCategory.UserJourneyDiagram,
        description: "a step in user journey",
        content: `      Step Title: 5: ActorName`,
        sortingOrder: 1,
        isPinned: false
    },
]