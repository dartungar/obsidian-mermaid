const DISALLOWED_SVG_TAGS = new Set([
    "base",
    "embed",
    "iframe",
    "link",
    "meta",
    "object",
    "script",
]);

const URL_ATTRIBUTE_NAMES = new Set([
    "href",
    "src",
    "xlink:href",
]);

export function setMermaidSvgContent(containerEl: HTMLElement, svg: string): void {
    containerEl.empty();
    containerEl.appendChild(parseSanitizedSvg(svg));
}

function parseSanitizedSvg(svg: string): SVGSVGElement {
    // Mermaid SVG previews need generated style blocks, so avoid assigning HTML
    // strings and strip active content from the parsed SVG before appending it.
    const parsedSvg = new DOMParser().parseFromString(svg, "image/svg+xml");
    const parserError = parsedSvg.querySelector("parsererror");
    const svgEl = parsedSvg.documentElement as unknown as SVGSVGElement;

    if (parserError || svgEl.nodeName.toLowerCase() !== "svg") {
        throw new Error("Unable to parse Mermaid SVG output.");
    }

    sanitizeSvgTree(svgEl);
    return document.importNode(svgEl, true) as SVGSVGElement;
}

function sanitizeSvgTree(rootEl: Element): void {
    const elements = [rootEl, ...Array.from(rootEl.querySelectorAll("*"))];

    for (const el of elements) {
        if (DISALLOWED_SVG_TAGS.has(el.tagName.toLowerCase())) {
            el.remove();
            continue;
        }

        sanitizeSvgAttributes(el);

        if (el.tagName.toLowerCase() === "style") {
            el.textContent = sanitizeCss(el.textContent ?? "");
        }
    }
}

function sanitizeSvgAttributes(el: Element): void {
    for (const attr of Array.from(el.attributes)) {
        const attrName = attr.name.toLowerCase();

        if (attrName.startsWith("on")) {
            el.removeAttribute(attr.name);
            continue;
        }

        if (attrName === "style") {
            el.setAttribute(attr.name, sanitizeCss(attr.value));
            continue;
        }

        if (URL_ATTRIBUTE_NAMES.has(attrName) && !isSafeSvgUrl(attr.value)) {
            el.removeAttribute(attr.name);
        }
    }
}

function isSafeSvgUrl(value: string): boolean {
    const trimmedValue = value.trim();
    return trimmedValue === "" || trimmedValue.startsWith("#");
}

function sanitizeCss(css: string): string {
    return css
        .replace(/@import[^;]*;?/gi, "")
        .replace(/url\s*\(\s*(['"]?)(.*?)\1\s*\)/gi, (_match, _quote, url) => {
            const trimmedUrl = url.trim();
            return trimmedUrl.startsWith("#") ? `url(${trimmedUrl})` : "none";
        })
        .replace(/expression\s*\([^)]*\)/gi, "");
}
