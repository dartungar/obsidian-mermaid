
import { IMermaidElement } from "src/core/IMermaidElement";

export let classDiagramElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "sample class",
		content: `class Duck{
            +String beakColor
            +swim()
            +quack()
        }`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "sample class",
		content: `class BankAccount
        BankAccount : +String owner
        BankAccount : +Bigdecimal balance
        BankAccount : +deposit(amount)
        BankAccount : +withdrawal(amount)`,
		sortingOrder: 1,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "generic class",
		content: `class Square~Shape~{
            int id
            List~int~ position
            setPoints(List~int~ points)
            getPoints() List~int~
        }
        
        Square : -List~string~ messages
        Square : +setMessages(List~string~ messages)
        Square : +getMessages() List~string~`,
		sortingOrder: 2,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "inheritance",
		content: "classA <|-- classB",
		sortingOrder: 3,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "composition",
		content: "classC *-- classD",
		sortingOrder: 4,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "aggregation",
		content: "classE o-- classF",
		sortingOrder: 5,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "association",
		content: "classG <-- classH",
		sortingOrder: 6,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "solid link",
		content: "classI -- classJ",
		sortingOrder: 7,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "dependency",
		content: "classK <.. classL",
		sortingOrder: 8,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "realization",
		content: "classM <|.. classN",
		sortingOrder: 9,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "dashed link",
		content: "classO .. classP",
		sortingOrder: 10,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "two-way relation",
		content: "Animal <|--|> Zebra",
		sortingOrder: 11,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "classDiagram",
		description: "sample class diagram",
		content: `classDiagram
        Animal <|-- Duck
        Animal <|-- Fish
        Animal <|-- Zebra
        Animal : +int age
        Animal : +String gender
        Animal: +isMammal()
        Animal: +mate()
        class Duck{
            +String beakColor
            +swim()
            +quack()
        }
        class Fish{
            -int sizeInFeet
            -canEat()
        }
        class Zebra{
            +bool is_wild
            +run()
        }`,
		sortingOrder: 12,
		isPinned: false,
	},
];
