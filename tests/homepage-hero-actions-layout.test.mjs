import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(
	path.join(process.cwd(), "src", "routes", "+page.svelte"),
	"utf8"
);

assert.ok(
	source.includes('class="flex flex-wrap items-center gap-3"'),
	"hero action row should center-align both buttons when the row wraps"
);

assert.match(
	source,
	/<Button\s+href="\/reading"\s+size="lg"[\s\S]*?class="motion-sheen group rounded-full px-5/,
	"primary hero action should use the large button size instead of custom vertical padding"
);

assert.match(
	source,
	/<Button\s+href="\/themes"\s+variant="outline"\s+size="lg"[\s\S]*?class="motion-sheen rounded-full border-border\/70 bg-background\/72 px-5/,
	"secondary hero action should use the large button size instead of custom vertical padding"
);

assert.ok(
	!source.includes("py-2.5"),
	"hero action buttons should not mix custom vertical padding with the shared button height"
);

console.log("homepage-hero-actions-layout test passed");
