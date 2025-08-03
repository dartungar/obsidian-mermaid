
import { IMermaidElement } from "src/core/IMermaidElement";

export let entityRelationshipDiagramElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "a sample entity relationship diagram",
		content: `erDiagram
        CUSTOMER ||--o{ ORDER : places
        ORDER ||--|{ LINE-ITEM : contains
        CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "an entity",
		content: `    CUSTOMER {
            string name
            string custNumber
            string sector
        }`,
		sortingOrder: 1,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "one-to-many relationship",
		content: `A ||--|{ B : label`,
		sortingOrder: 2,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "many-to-many relationship",
		content: `A }|--|{ B : label`,
		sortingOrder: 3,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "one-to-one relationship",
		content: `A ||--|| B : label`,
		sortingOrder: 4,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "many-to-one relationship",
		content: `A }|--|| B : label`,
		sortingOrder: 5,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "zero/one-to-one relationship",
		content: `A |o--|| B : label`,
		sortingOrder: 6,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "one-to-one/zero relationship",
		content: `A ||--o| B : label`,
		sortingOrder: 7,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "zero-or-more-to-one relationship",
		content: `A }o--|| B : label`,
		sortingOrder:8,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "one-to-zero-or-more relationship",
		content: `A ||--o{ B : label`,
		sortingOrder: 9,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "zero-or-more-to-many relationship",
		content: `A }o--|{ B : label`,
		sortingOrder: 10,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "entityRelationshipDiagram",
		description: "many-to-zero-or-more relationship",
		content: `A }|--o{ B : label`,
		sortingOrder: 11,
		isPinned: false,
	},
];
