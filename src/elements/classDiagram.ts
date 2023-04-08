import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export let classDiagramElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
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
		category: ElementCategory.ClassDiagram,
		description: "sample class",
		content: `class BankAccount
        BankAccount : +String owner
        BankAccount : +Bigdecimal balance
        BankAccount : +deposit(amount)
        BankAccount : +withdrawal(amount)`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
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
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
		description: "inheritance",
		content: "classA <|-- classB",
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
		description: "composition",
		content: "classC *-- classD",
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
		description: "aggregation",
		content: "classE o-- classF",
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
		description: "association",
		content: "classG <-- classH",
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
		description: "solid link",
		content: "classI -- classJ",
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
		description: "dependency",
		content: "classK <.. classL",
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
		description: "realization",
		content: "classM <|.. classN",
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
		description: "dashed link",
		content: "classO .. classP",
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
		description: "two-way relation",
		content: "Animal <|--|> Zebra",
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.ClassDiagram,
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
		sortingOrder: 0,
		isPinned: false,
	},
];
