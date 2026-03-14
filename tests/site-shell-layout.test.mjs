import assert from "node:assert/strict";

import {
	getSiteShellBackdropClass,
	getSiteShellHeaderClass,
	getSiteShellRootClass
} from "../src/lib/components/site-shell-layout.js";

const rootClass = getSiteShellRootClass();
assert.ok(
	rootClass.includes("overflow-x-clip"),
	"site shell root should clip horizontal overflow without creating a sticky-breaking scroll container"
);
assert.ok(
	!rootClass.includes("overflow-x-hidden"),
	"site shell root should not use overflow-x-hidden"
);

const backdropClass = getSiteShellBackdropClass();
assert.ok(
	backdropClass.includes("absolute inset-0"),
	"site shell backdrop should stretch through the full shell instead of stopping at a fixed height"
);
assert.ok(
	!backdropClass.includes("top-0 h-56"),
	"site shell backdrop should not be truncated to a fixed header-height slice"
);

const headerClass = getSiteShellHeaderClass();
assert.ok(
	headerClass.includes("sticky top-0"),
	"site shell header should preserve sticky positioning"
);

console.log("site-shell-layout test passed");
