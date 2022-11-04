import { FlowChart, FlowchartDirection } from "./flowchart/flowchart";

export class MermaidElementService {

    public getFlowchart(): string {
        const fc = new FlowChart(FlowchartDirection.leftToRight);
        return fc.toString();
    }
}