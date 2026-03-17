import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
	path.join(process.cwd(), "src", "lib", "components", "reading", "annotated-text.svelte"),
	"utf8"
);

assert.ok(
	source.includes("group-hover:pointer-events-auto"),
	"annotation popover should accept pointer interaction while hovered"
);
assert.ok(
	source.includes("group-focus-within:pointer-events-auto"),
	"annotation popover should stay interactive for keyboard focus as well"
);
assert.ok(
	source.includes("group-hover:translate-y-0"),
	"annotation popover should align flush with the trigger while hovered"
);
assert.ok(
	source.includes("group-focus-within:translate-y-0"),
	"annotation popover should align flush with the trigger while focus is inside"
);
assert.ok(
	!source.includes("group-hover:-translate-y-1"),
	"annotation popover should not pull away from the trigger and create a hover gap"
);
assert.ok(
	source.includes("select-text"),
	"annotation popover content should be selectable"
);
assert.ok(
	source.includes("Avatar.Root"),
	"person entity popovers should render an avatar block"
);
assert.ok(
	!source.includes("{copy.related}: {segment.entity.relatedChapter}"),
	"entity popovers should not expose internal related line ids"
);

console.log("annotated-text-layout test passed");
