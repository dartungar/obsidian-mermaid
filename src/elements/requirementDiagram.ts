import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export let requirementDiagramElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.RequirementDiagram,
		description: "sample requirements diagram",
		content: `    requirementDiagram

        requirement test_req {
        id: 1
        text: the test text.
        risk: high
        verifymethod: test
        }
    
        element test_entity {
        type: simulation
        }
    
        test_entity - satisfies -> test_req`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.RequirementDiagram,
		description: "sample requirements diagram",
		content: `element customElement {
            type: customType
            docref: customDocRef
        }`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.RequirementDiagram,
		description: "a requirement with high risk",
		content: `functionalRequirement myReq {
            id: reqId
            text: someText
            risk: High
            verifymethod: analysis
        }`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.RequirementDiagram,
		description: "sample requirements diagram",
		content: `interfaceRequirement myReq2 {
            id: reqId
            text: someText
            risk: Medium
            verifymethod: demonstration
        }`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.RequirementDiagram,
		description: "sample requirements diagram",
		content: `designConstraint myReq3 {
            id: reqId
            text: someText
            risk: Low
            verifymethod: test
        }`,
		sortingOrder: 0,
		isPinned: false,
	},
];
