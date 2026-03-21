import assert from "node:assert/strict";
import fs from "node:fs";

const workflowPath = ".github/workflows/deploy-pages.yml";
assert.ok(fs.existsSync(workflowPath), "expected GitHub Pages workflow to exist");

const workflowSource = fs.readFileSync(workflowPath, "utf8");
assert.match(
	workflowSource,
	/SITE_URL:\s*https:\/\/github\.6iedog\.com\/huiyin-symposium/,
	"expected workflow to set SITE_URL for the subpath deployment"
);
assert.match(
	workflowSource,
	/BASE_PATH:\s*\/huiyin-symposium/,
	"expected workflow to set BASE_PATH for the subpath deployment"
);
assert.match(
	workflowSource,
	/path:\s*build/,
	"expected workflow to upload the build directory"
);

const svelteConfigSource = fs.readFileSync("svelte.config.js", "utf8");
assert.match(
	svelteConfigSource,
	/BASE_PATH/,
	"expected svelte config to read BASE_PATH for deployment"
);

console.log("github-pages-workflow test passed");
