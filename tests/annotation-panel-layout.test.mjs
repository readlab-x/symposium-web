import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
	path.join(process.cwd(), "src", "lib", "components", "reading", "annotation-panel.svelte"),
	"utf8"
);

assert.ok(
	!source.includes("<blockquote"),
	"annotation sidebar should not render the original text blockquote"
);
assert.ok(
	!source.includes("getDisplayText"),
	"annotation sidebar should not compute original text just for the sidebar panel"
);

console.log("annotation-panel-layout test passed");
