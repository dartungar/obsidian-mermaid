import { IMermaidElement } from "../core/IMermaidElement";
import { classDiagramElements } from "./classDiagram";
import { entityRelationshipDiagramElements } from "./entityRelationshipDiagram";
import { flowchartElements } from "./flowchart";
import { ganttChartElements } from "./ganntChart";
import { gitGraphElements } from "./gitGraph";
import { pieChartElements } from "./pieChart";
import { requirementDiagramElements } from "./requirementDiagram";
import { sequenceDiagramElements } from "./sequenceDiagram";
import { stateDiagramElements } from "./stateDiagram";
import { userJourneyDiagramElements } from "./userJourneyDiagram";

export let defaultElements: IMermaidElement[] = [
    ...flowchartElements,
    ...sequenceDiagramElements,
    ...classDiagramElements,
    ...stateDiagramElements,
    ...entityRelationshipDiagramElements,
    ...userJourneyDiagramElements,
    ...ganttChartElements,
    ...pieChartElements,
    ...requirementDiagramElements,
    ...gitGraphElements,
]