import { IElementCategory } from "./IElementCategory";

export const DEFAULT_CATEGORIES: IElementCategory[] = [
    {
        id: "flowchart",
        name: "Flowchart",
        defaultWrapping: "flowchart LR",
        wrappings: ["flowchart LR", "flowchart TD"],
        isCustom: false,
        sortOrder: 0
    },
    {
        id: "sequenceDiagram",
        name: "SequenceDiagram",
        defaultWrapping: "sequenceDiagram",
        wrappings: null,
        isCustom: false,
        sortOrder: 1
    },
    {
        id: "classDiagram",
        name: "ClassDiagram",
        defaultWrapping: "classDiagram",
        wrappings: null,
        isCustom: false,
        sortOrder: 2
    },
    {
        id: "stateDiagram",
        name: "StateDiagram",
        defaultWrapping: "stateDiagram-v2",
        wrappings: null,
        isCustom: false,
        sortOrder: 3
    },
    {
        id: "entityRelationshipDiagram",
        name: "EntityRelationshipDiagram",
        defaultWrapping: "erDiagram",
        wrappings: null,
        isCustom: false,
        sortOrder: 4
    },
    {
        id: "userJourneyDiagram",
        name: "UserJourneyDiagram",
        defaultWrapping: "journey",
        wrappings: null,
        isCustom: false,
        sortOrder: 5
    },
    {
        id: "ganttChart",
        name: "GanttChart",
        defaultWrapping: "gantt",
        wrappings: null,
        isCustom: false,
        sortOrder: 6
    },
    {
        id: "pieChart",
        name: "PieChart",
        defaultWrapping: "pie",
        wrappings: null,
        isCustom: false,
        sortOrder: 7
    },
    {
        id: "requirementDiagram",
        name: "RequirementDiagram",
        defaultWrapping: "requirementDiagram",
        wrappings: null,
        isCustom: false,
        sortOrder: 8
    },
    {
        id: "gitGraph",
        name: "GitGraph",
        defaultWrapping: "gitGraph",
        wrappings: null,
        isCustom: false,
        sortOrder: 9
    },
    {
        id: "mindmap",
        name: "Mindmap",
        defaultWrapping: "mindmap",
        wrappings: ["mindmap"],
        isCustom: false,
        sortOrder: 10
    },
    {
        id: "timeline",
        name: "Timeline",
        defaultWrapping: "timeline",
        wrappings: null,
        isCustom: false,
        sortOrder: 11
    },
    {
        id: "c4Diagram",
        name: "C4Diagram",
        defaultWrapping: "C4Context",
        wrappings: null,
        isCustom: false,
        sortOrder: 12
    },
    {
        id: "quadrantChart",
        name: "QuadrantChart",
        defaultWrapping: "quadrantChart",
        wrappings: null,
        isCustom: false,
        sortOrder: 13
    },
    {
        id: "sankeyDiagram",
        name: "SankeyDiagram",
        defaultWrapping: "sankey-beta",
        wrappings: null,
        isCustom: false,
        sortOrder: 14
    },
    {
        id: "xyChart",
        name: "XyChart",
        defaultWrapping: "xychart-beta",
        wrappings: null,
        isCustom: false,
        sortOrder: 15
    },
    {
        id: "kanban",
        name: "Kanban",
        defaultWrapping: "kanban",
        wrappings: null,
        isCustom: false,
        sortOrder: 16
    },
    {
        id: "architecture",
        name: "Architecture",
        defaultWrapping: "architecture-beta",
        wrappings: null,
        isCustom: false,
        sortOrder: 17
    },
    {
        id: "block",
        name: "Block",
        defaultWrapping: "block-beta",
        wrappings: null,
        isCustom: false,
        sortOrder: 18
    },
    {
        id: "packet",
        name: "Packet",
        defaultWrapping: "packet-beta",
        wrappings: null,
        isCustom: false,
        sortOrder: 19
    }
];
