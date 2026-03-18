import assert from "node:assert/strict";

import {
	getReadingAnnotationWrapClass,
	getReadingDialogueColumnClass,
	getReadingHeaderLayoutClass,
	getReadingSceneToolbarSummary,
	getReadingToolbarSummary
} from "../src/lib/components/reading/reading-toolbar-layout.js";

assert.equal(
	getReadingToolbarSummary({ activeCount: 10, totalCount: 10, language: "zh-CN" }),
	"人物 · 全部",
	"when all speakers are active, the Chinese summary should read as all selected"
);

assert.equal(
	getReadingToolbarSummary({ activeCount: 3, totalCount: 10, language: "en-US" }),
	"Speakers · 3/10",
	"partial English speaker selections should show a compact count summary"
);

assert.equal(
	getReadingSceneToolbarSummary({ activeCount: 12, totalCount: 12, language: "zh-CN" }),
	"场景 · 全部",
	"when all scenes are active, the Chinese summary should read as all selected"
);

assert.equal(
	getReadingSceneToolbarSummary({ activeCount: 2, totalCount: 12, language: "en-US" }),
	"Scenes · 2/12",
	"partial English scene selections should show a compact count summary"
);

assert.ok(
	getReadingHeaderLayoutClass().includes("lg:grid-cols-[minmax(0,1fr)_auto]"),
	"desktop reading header should reserve a right-side toolbar column for both filters"
);

assert.ok(
	getReadingDialogueColumnClass().includes("space-y-4") &&
		!getReadingDialogueColumnClass().includes("order-"),
	"dialogue column should keep its natural first position in the desktop grid"
);

assert.ok(
	getReadingAnnotationWrapClass().includes("hidden lg:order-2 lg:block"),
	"annotation sidebar should stay desktop-only and remain in the second desktop column"
);

console.log("reading-toolbar-layout test passed");
