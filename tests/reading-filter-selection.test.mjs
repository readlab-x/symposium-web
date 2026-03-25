import assert from "node:assert/strict";

import {
	areAllSelected,
	toggleAllSelection
} from "../src/lib/reading/filter-selection.js";

const allIds = ["phaedrus", "socrates", "agathon"];

assert.equal(
	areAllSelected({ activeIds: allIds, allIds }),
	true,
	"should report all selected when every id is active"
);

assert.equal(
	areAllSelected({ activeIds: ["phaedrus", "socrates"], allIds }),
	false,
	"should report partial selections as not fully selected"
);

assert.deepEqual(
	toggleAllSelection({ activeIds: ["phaedrus"], allIds }),
	allIds,
	"should select every option when not all options are active"
);

assert.deepEqual(
	toggleAllSelection({ activeIds: allIds, allIds }),
	[],
	"should clear every option when all options are already active"
);

console.log("reading-filter-selection test passed");
