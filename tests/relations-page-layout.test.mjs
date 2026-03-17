import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const relationGraphSource = fs.readFileSync(
	path.join(repoRoot, "src", "lib", "components", "relations", "relation-graph.svelte"),
	"utf8"
);
const relationsPageSource = fs.readFileSync(
	path.join(repoRoot, "src", "routes", "relations", "+page.svelte"),
	"utf8"
);

assert.ok(
	!relationGraphSource.includes("Drag, zoom, and select nodes to inspect links."),
	"relation graph should not render the previous helper copy below the canvas"
);
assert.ok(
	!relationGraphSource.includes("人物关系图，可拖拽、缩放并点击节点查看关系"),
	"relation graph should not render the previous Chinese helper copy below the canvas"
);
assert.ok(
	!relationGraphSource.includes("<p class=\"px-1 text-xs text-muted-foreground\">"),
	"relation graph should not render the helper caption element"
);
assert.ok(
	!relationsPageSource.includes(
		'motion-stage-soft motion-delay-1 rounded-[1.5rem] border border-border/60 bg-card/62 p-4'
	),
	"relations page should not wrap the graph in the previous padded card shell"
);

console.log("relations-page-layout test passed");
