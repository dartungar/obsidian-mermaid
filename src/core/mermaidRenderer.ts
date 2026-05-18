export interface MermaidRenderResult {
    svg: string;
}

export interface MermaidRenderer {
    render(id: string, diagram: string): Promise<MermaidRenderResult>;
}
