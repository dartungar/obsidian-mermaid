import { IMermaidElement } from "../IMermaidElement";

export enum FlowchartDirection {
    topDown = 'TD',
    leftToRight = 'LR'
}

export class FlowChart implements IMermaidElement {
    private direction: FlowchartDirection = FlowchartDirection.leftToRight;
    
    constructor(dir: FlowchartDirection) {
        super();
        this.direction = dir;
    }

    public toString(): string {
        return `flowchart TD
        Start --> Stop\n`
    }
}