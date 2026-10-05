import { parseYaml } from "obsidian";

export interface MermaidRenderResult {
    svg: string;
}

export interface MermaidRenderer {
    render(id: string, diagram: string): Promise<MermaidRenderResult>;
}

export function getMermaidPreviewTheme(doc: Document): "dark" | "default" {
    return doc.body.classList.contains("theme-dark") ? "dark" : "default";
}

export function renderMermaidPreview(
    mermaid: MermaidRenderer,
    id: string,
    diagram: string,
    doc: Document
): Promise<MermaidRenderResult> {
    // Keep configuration local to the preview: loadMermaid() is also used by
    // Obsidian's note renderer. Init directives support older Obsidian versions.
    const frontmatter = diagram.match(/^\s*---\r?\n([\s\S]*?\r?\n)?---[ \t]*(?:\r?\n|$)/);
    let theme: string = getMermaidPreviewTheme(doc);
    if (frontmatter) {
        // An explicitly themed component should retain its chosen appearance.
        const metadata = parseYaml(frontmatter[1] ?? "");
        theme = metadata?.config?.theme ?? theme;
    }
    const directive = `%%{init: ${JSON.stringify({ theme })}}%%\n`;
    const offset = frontmatter?.[0].length ?? 0;
    // Frontmatter must remain at the beginning of the diagram. Later author
    // directives can override this default (e.g. the bundled forest timeline).
    const separator = offset > 0 && !diagram.slice(0, offset).endsWith("\n") ? "\n" : "";
    const previewDiagram = diagram.slice(0, offset) + separator + directive + diagram.slice(offset);
    return mermaid.render(id, previewDiagram);
}
