import assert from "node:assert/strict";
import fs from "node:fs";

const requiredFiles = [
	"static/branding/logo.png",
	"static/branding/logo-mark.png",
	"static/branding/favicon.png"
];

for (const filePath of requiredFiles) {
	assert.ok(fs.existsSync(filePath), `expected branding asset to exist: ${filePath}`);
}

const layoutSource = fs.readFileSync("src/routes/+layout.svelte", "utf8");
assert.match(
	layoutSource,
	/toAssetPath\('\/branding\/favicon\.png'\)/,
	"expected layout to resolve the branded favicon through the asset helper"
);

const shellSource = fs.readFileSync("src/lib/components/site-shell.svelte", "utf8");
assert.match(
	shellSource,
	/toAssetPath\(\"\/branding\/logo-mark\.png\"\)/,
	"expected site shell to resolve the branded logo mark through the asset helper"
);
assert.match(
	shellSource,
	/https:\/\/github\.com\/6iedog\/symposium-web/,
	"expected site shell to include a GitHub repository link"
);
assert.match(
	shellSource,
	/target="_blank"/,
	"expected the GitHub repository link to open in a new tab"
);
assert.match(
	shellSource,
	/rel="noreferrer"/,
	"expected the GitHub repository link to use noreferrer"
);

console.log("branding-assets test passed");
