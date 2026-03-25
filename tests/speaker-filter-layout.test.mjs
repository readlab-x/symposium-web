import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
	path.join(process.cwd(), "src", "lib", "components", "reading", "speaker-filter.svelte"),
	"utf8"
);

assert.ok(
	source.includes("Avatar.Root"),
	"speaker filter options should render speaker avatars"
);
assert.ok(
	source.includes("speaker.avatarImage"),
	"speaker filter options should render avatar images when present"
);
assert.ok(
	source.includes("speaker.avatar ?? speaker.name.slice(0, 1)"),
	"speaker filter options should keep a readable avatar fallback"
);

assert.ok(
	source.includes("取消全选"),
	"speaker filter should expose a Chinese deselect-all label when every speaker is active"
);

assert.ok(
	source.includes("Deselect All"),
	"speaker filter should expose an English deselect-all label when every speaker is active"
);

assert.ok(
	source.includes("allSelected"),
	"speaker filter should compute whether all speakers are currently selected"
);

console.log("speaker-filter-layout test passed");
