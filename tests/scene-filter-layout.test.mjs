import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
	path.join(process.cwd(), "src", "lib", "components", "reading", "scene-filter.svelte"),
	"utf8"
);

assert.ok(
	source.includes("Filter by Scene"),
	"scene filter should include the English title copy"
);

assert.ok(
	source.includes("按场景筛选"),
	"scene filter should include the Chinese title copy"
);

assert.ok(
	source.includes("onToggleScene"),
	"scene filter should expose a toggle callback for scene ids"
);

assert.ok(
	source.includes("activeSceneIds"),
	"scene filter should render from the active scene selection state"
);

console.log("scene-filter-layout test passed");
