import { IMermaidElement } from "../core/IMermaidElement";
import { c4DiagramElements } from "./c4Diagram";
import { classDiagramElements } from "./classDiagram";
import { entityRelationshipDiagramElements } from "./entityRelationshipDiagram";
import { flowchartElements } from "./flowchart";
import { ganttChartElements } from "./ganntChart";
import { gitGraphElements } from "./gitGraph";
import { mindMapElements } from "./mindMap";
import { pieChartElements } from "./pieChart";
import { quadrantElements } from "./quadrant";
import { requirementDiagramElements } from "./requirementDiagram";
import { sankeyDiagramElements } from "./sankeyDiagram";
import { sequenceDiagramElements } from "./sequenceDiagram";
import { stateDiagramElements } from "./stateDiagram";
import { timelineElements } from "./timeline";
import { userJourneyDiagramElements } from "./userJourneyDiagram";
import { xyChartElements } from "./xyChart";

export const defaultElements: IMermaidElement[] = [
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
    ...mindMapElements,
    ...timelineElements,
    ...quadrantElements,
    ...c4DiagramElements,
    ...sankeyDiagramElements,
    ...xyChartElements
]