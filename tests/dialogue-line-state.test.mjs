import assert from "node:assert/strict";

import { getDialogueLineRootClass } from "../src/lib/components/reading/dialogue-line-state.js";

const selectedRootClass = getDialogueLineRootClass({ index: 0, isSelected: true });
assert.ok(
	selectedRootClass.includes("border-primary/48"),
	"selected dialogue line should keep a clearly visible active border"
);
assert.ok(
	selectedRootClass.includes("ring-1 ring-primary/18"),
	"selected dialogue line should expose an explicit active ring"
);
assert.ok(
	!selectedRootClass.includes("motion-settle"),
	"selected dialogue line should not use motion-settle because it overrides entry animation"
);

const stagedRootClass = getDialogueLineRootClass({ index: 2, isSelected: false });
assert.ok(
	stagedRootClass.includes("motion-stage-soft motion-delay-2"),
	"early unselected dialogue lines should still receive staggered entrance motion"
);
assert.ok(
	stagedRootClass.includes("hover:-translate-y-0.5"),
	"unselected dialogue lines should keep hover lift feedback"
);

console.log("dialogue-line-state test passed");
