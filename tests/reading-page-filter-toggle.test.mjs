import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
	path.join(process.cwd(), "src", "routes", "reading", "+page.svelte"),
	"utf8"
);

assert.match(
	source,
	/import\s+\{\s*toggleAllSelection\s*\}\s+from\s+"\$lib\/reading\/filter-selection\.js"/,
	"reading page should import the shared toggle-all selection helper"
);

assert.match(
	source,
	/activeSpeakerIds\s*=\s*toggleAllSelection\(\{\s*activeIds:\s*activeSpeakerIds,\s*allIds:\s*defaultSpeakerIds\s*\}\)/s,
	"speaker filter select-all action should toggle between all selected and none selected"
);

assert.match(
	source,
	/activeSceneIds\s*=\s*toggleAllSelection\(\{\s*activeIds:\s*activeSceneIds,\s*allIds:\s*defaultSceneIds\s*\}\)/s,
	"scene filter select-all action should toggle between all selected and none selected"
);

console.log("reading-page-filter-toggle test passed");
