const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { test } = require("node:test");
const vm = require("node:vm");
const esbuild = require("esbuild");

// Obsidian supplies its API at runtime. Load the actual TypeScript with small
// host stubs so these regressions run without installing the Obsidian app.
function loadSource(file, imports) {
    const filename = path.join(__dirname, "..", file);
    const { code } = esbuild.transformSync(fs.readFileSync(filename, "utf8"), {
        loader: "ts", format: "cjs", target: "es2018",
    });
    const module = { exports: {} };
    vm.runInNewContext(code, {
        module,
        exports: module.exports,
        crypto: require("node:crypto"),
        require(id) {
            assert.ok(Object.hasOwn(imports, id), `Unexpected import: ${id}`);
            return imports[id];
        },
    }, { filename });
    return module.exports;
}

function makeDocument(dark = false) {
    const doc = { dark };
    doc.body = { classList: { contains: name => name === "theme-dark" && doc.dark } };
    return doc;
}

function makeRenderer() {
    const calls = [];
    return {
        calls,
        initialize() { assert.fail("Preview must not change global Mermaid configuration"); },
        async render(id, diagram) {
            calls.push({ id, diagram });
            return { svg: "<svg/>" };
        },
    };
}

function makeElement(doc) {
    return {
        ownerDocument: doc,
        children: [],
        addClass() {},
        setAttr() {},
        empty() { this.children = []; },
        detach() {
            if (this.parentElement) {
                this.parentElement.children = this.parentElement.children.filter(child => child !== this);
                this.parentElement = null;
            }
        },
        appendChild(child) {
            if (!this.children.includes(child)) this.children.push(child);
            child.parentElement = this;
        },
        createDiv() { return this.createEl(); },
        createEl() {
            const child = makeElement(doc);
            this.appendChild(child);
            return child;
        },
    };
}

const preview = loadSource("src/core/mermaidRenderer.ts", {
    obsidian: { parseYaml() { assert.fail("No frontmatter expected"); } },
});

test("previews follow dark/light changes without changing source or global config", async () => {
    const doc = makeDocument(true);
    const mermaid = makeRenderer();
    const source = "flowchart TD\nStart --> Stop";
    const result = await preview.renderMermaidPreview(mermaid, "dark-preview", source, doc);
    assert.equal(result.svg, "<svg/>");
    assert.equal(mermaid.calls[0].id, "dark-preview");
    assert.equal(mermaid.calls[0].diagram, '%%{init: {"theme":"dark"}}%%\n' + source);
    doc.dark = false;
    await preview.renderMermaidPreview(mermaid, "light-preview", source, doc);
    assert.equal(mermaid.calls[1].diagram, '%%{init: {"theme":"default"}}%%\n' + source);
    assert.equal(source, "flowchart TD\nStart --> Stop");
});

test("author directives remain after the preview default so they can override it", async () => {
    const mermaid = makeRenderer();
    const source = "timeline\n%%{init: {'theme': 'forest'}}%%\n2026 : Example";
    await preview.renderMermaidPreview(mermaid, "custom", source, makeDocument(true));
    assert.equal(mermaid.calls[0].diagram, '%%{init: {"theme":"dark"}}%%\n' + source);
});

test("frontmatter stays first and retains its explicit theme and other config", async () => {
    const yaml = "title: Example\nconfig:\n  theme: forest\n  flowchart:\n    curve: linear\n";
    const themedPreview = loadSource("src/core/mermaidRenderer.ts", {
        obsidian: { parseYaml(value) {
            assert.equal(value, yaml);
            return { title: "Example", config: { theme: "forest", flowchart: { curve: "linear" } } };
        } },
    });
    const mermaid = makeRenderer();
    const header = `---\n${yaml}---\n`;
    const body = "flowchart TD\nA --> B";
    await themedPreview.renderMermaidPreview(mermaid, "frontmatter", header + body, makeDocument(true));
    assert.equal(mermaid.calls[0].diagram, header + '%%{init: {"theme":"forest"}}%%\n' + body);
});

test("empty, CRLF, and title-only frontmatter inherit the Obsidian theme", async () => {
    const themedPreview = loadSource("src/core/mermaidRenderer.ts", {
        obsidian: { parseYaml: () => ({ title: "Example" }) },
    });
    for (const header of ["---\n---\n", "---\r\ntitle: Example\r\n---\r\n", "---\ntitle: Example\n---"]) {
        const mermaid = makeRenderer();
        const body = header.endsWith("\n") ? "flowchart TD\nA --> B" : "";
        await themedPreview.renderMermaidPreview(mermaid, "frontmatter", header + body, makeDocument(true));
        const separator = header.endsWith("\n") ? "" : "\n";
        assert.equal(mermaid.calls[0].diagram, header + separator + '%%{init: {"theme":"dark"}}%%\n' + body);
    }
});

test("render failures still reach the toolbar's existing error handler", async () => {
    const error = new Error("Invalid diagram");
    await assert.rejects(preview.renderMermaidPreview({
        render: async () => { throw error; },
    }, "invalid", "bad diagram", makeDocument()), error);
});

test("sidebar uses its owning document's theme and inserts the original component content", async () => {
    const doc = makeDocument(true);
    doc.body.createDiv = () => {
        const element = makeElement(doc);
        doc.body.children.push(element);
        element.parentElement = doc.body;
        return element;
    };
    doc.body.children = [];
    const mermaid = makeRenderer();
    const inserted = [];
    const { createMermaidToolbar } = loadSource("src/ui/toolbarView/viewHelpers.ts", {
        obsidian: {
            loadMermaid: async () => mermaid,
            DropdownComponent: class {
                addOption() {}
                setValue() {}
                onChange() {}
            },
        },
        "src/core/elementService": { MermaidElementService: class {
            wrapAsCompleteDiagram(element) { return "flowchart TD\n" + element.content; }
        } },
        "src/core/mermaidRenderer": preview,
        "../renderMermaidSvg": { setMermaidSvgContent(element, svg) { element.svg = svg; } },
    });
    // The sidebar is in a dark popout while the main window is light. A global
    // document read would fail this test or pick the wrong theme.
    const elements = [{ categoryId: "flowchart", sortingOrder: 0, content: "A --> B", description: "Arrow" }];
    const toolbar = await createMermaidToolbar([], elements, "flowchart", () => {},
        text => inserted.push(text), { getCategories: () => [{ id: "flowchart", name: "Flowchart" }] }, doc);
    assert.equal(toolbar.ownerDocument, doc);
    assert.equal(doc.body.children.length, 0);
    assert.equal(mermaid.calls[0].diagram, '%%{init: {"theme":"dark"}}%%\nflowchart TD\nA --> B');
    const item = toolbar.children[1].children[0];
    assert.equal(item.svg, "<svg/>");
    item.onclick();
    assert.deepEqual(inserted, ["A --> B"]);
});

function makeView(dark = true) {
    const doc = makeDocument(dark);
    const content = {
        children: [],
        addClass() {},
        empty() { this.children = []; },
        appendChild(child) { this.children.push(child); },
    };
    const events = new Map();
    const registered = [];
    class ItemView {
        constructor() {
            this.containerEl = { ownerDocument: doc, children: [{}, content] };
            this.app = { workspace: { on(name, callback) {
                events.set(name, callback);
                return { name, callback };
            } } };
        }
        registerEvent(event) { registered.push(event); }
    }
    const renders = [];
    const { MermaidToolbarView } = loadSource("src/ui/toolbarView/mermaidToolbarView.ts", {
        obsidian: { ItemView },
        main: { TRIDENT_ICON_NAME: "trident" },
        "src/core/categoryService": { CategoryService: { getInstance: () => ({ loadCategories() {} }) } },
        "src/core/mermaidRenderer": preview,
        "./mermaidToolbarButtons": { MermaidToolbarButton: class {} },
        "./viewHelpers": { createMermaidToolbar(...args) {
            return new Promise(resolve => renders.push({ args, resolve }));
        } },
    });
    const settings = { elements: [], selectedCategoryId: "flowchart" };
    const plugin = { settings };
    const view = new MermaidToolbarView({}, plugin);
    return { view, doc, content, events, registered, renders, settings };
}

test("sidebar refreshes on mode changes, preserves category, and ignores other CSS changes", async () => {
    const { view, doc, content, events, registered, renders, settings } = makeView();
    const opening = view.onOpen();
    assert.equal(registered[0].name, "css-change");
    assert.equal(renders[0].args[6], doc);
    renders[0].resolve("dark toolbar");
    await opening;
    events.get("css-change")();
    assert.equal(renders.length, 1);
    settings.selectedCategoryId = "sequenceDiagram";
    doc.dark = false;
    events.get("css-change")();
    assert.equal(renders.length, 2);
    assert.equal(renders[1].args[2], "sequenceDiagram");
    renders[1].resolve("light toolbar");
    await new Promise(setImmediate);
    assert.deepEqual(content.children, ["light toolbar"]);
    doc.dark = true;
    events.get("css-change")();
    renders[2].resolve("dark toolbar again");
    await new Promise(setImmediate);
    assert.deepEqual(content.children, ["dark toolbar again"]);
});

test("a pending old render cannot replace the toolbar after a theme change", async () => {
    const { view, doc, content, events, renders } = makeView();
    const opening = view.onOpen();
    doc.dark = false;
    events.get("css-change")();
    renders[1].resolve("new light toolbar");
    await new Promise(setImmediate);
    renders[0].resolve("old dark toolbar");
    await opening;
    assert.deepEqual(content.children, ["new light toolbar"]);
});

test("closing the sidebar discards pending toolbar rendering", async () => {
    const { view, content, renders } = makeView();
    const opening = view.onOpen();
    await view.onClose();
    renders[0].resolve("closed toolbar");
    await opening;
    assert.deepEqual(content.children, []);
});

function makePlugin(workspace) {
    const imports = {
        obsidian: { Plugin: class { onunload() {} } },
        "src/core/elementService": { MermaidElementService: class {} },
        "src/core/textEditorService": { TextEditorService: class {} },
        "src/settings/settings": {},
        "src/trident-icon": {},
        "src/ui/settingsTab": {},
        "src/ui/toolbarView/mermaidToolbarView": {
            MermaidToolbarView: { VIEW_TYPE: "mermaid-toolbar-view" },
        },
    };
    for (const name of ["architecture", "blockDiagram", "c4Diagram", "kanban", "mindMap",
        "packet", "quadrant", "sankeyDiagram", "timeline", "xyChart"]) {
        imports[`src/elements/${name}`] = {};
    }
    const { default: MermaidPlugin } = loadSource("main.ts", imports);
    const plugin = new MermaidPlugin();
    plugin.app = { workspace };
    return plugin;
}

test("reopening and unloading preserve an existing toolbar leaf's position", async () => {
    const leaf = { location: "left split" };
    const revealed = [];
    const plugin = makePlugin({
        getLeavesOfType(type) {
            assert.equal(type, "mermaid-toolbar-view");
            return [leaf];
        },
        async revealLeaf(target) { revealed.push(target); },
        detachLeavesOfType() { assert.fail("Must preserve existing leaves"); },
        getRightLeaf() { assert.fail("Must reuse the existing leaf"); },
    });
    await plugin.activateView();
    assert.deepEqual(revealed, [leaf]);
    assert.equal(plugin.onunload(), undefined);
    assert.equal(leaf.location, "left split");
});

test("opening a new toolbar falls back to a new leaf when the sidebar is unavailable", async () => {
    const states = [];
    const leaf = { async setViewState(state) { states.push(state); } };
    let revealed;
    const plugin = makePlugin({
        getLeavesOfType: () => [],
        getRightLeaf: () => null,
        getLeaf(create) { assert.equal(create, true); return leaf; },
        async revealLeaf(target) { revealed = target; },
    });
    await plugin.activateView();
    assert.equal(states[0].type, "mermaid-toolbar-view");
    assert.equal(states[0].active, true);
    assert.equal(revealed, leaf);
});

test("searchable and legacy settings render the management UI and handle loading errors", async () => {
    const notices = [];
    let failLoading = false;
    const doc = makeDocument();
    const { MermaidToolsSettingsTab } = loadSource("src/ui/settingsTab.ts", {
        obsidian: {
            PluginSettingTab: class { constructor() { this.containerEl = makeElement(doc); } },
            Modal: class {},
            Notice: class { constructor(message) { notices.push(message); } },
            async loadMermaid() {
                if (failLoading) throw new Error("Renderer unavailable");
                return makeRenderer();
            },
        },
        "./editMermaidElementModal": {},
        "./editCategoryModal": {},
        "src/core/categoryService": { CategoryService: { getInstance: () => ({
            loadCategories() {},
            getCategories: () => [],
        }) } },
        "src/core/defaultCategories": { DEFAULT_CATEGORIES: [] },
    });
    const tab = new MermaidToolsSettingsTab({}, { settings: {} });
    const definitions = tab.getSettingDefinitions();
    assert.ok(definitions.length > 0);
    assert.match(definitions[0].name, /elements.*categories/i);
    const settingEl = makeElement(doc);
    assert.equal(definitions[0].render({ settingEl }), undefined);
    await new Promise(setImmediate);
    assert.ok(settingEl.children[0].children.length > 0);
    assert.equal(tab.display(), undefined);
    await new Promise(setImmediate);
    assert.ok(tab.containerEl.children.length > 0);
    failLoading = true;
    tab.display();
    definitions[0].render({ settingEl });
    await new Promise(setImmediate);
    assert.equal(notices.length, 2);
    assert.ok(notices.every(message => message.includes("Renderer unavailable")));
});
