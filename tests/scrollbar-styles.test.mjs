import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const source = fs.readFileSync(path.join(process.cwd(), "src", "routes", "layout.css"), "utf8");

assert.ok(
	source.includes("scrollbar-width"),
	"global stylesheet should define Firefox scrollbar width"
);

assert.ok(
	source.includes("scrollbar-color"),
	"global stylesheet should define Firefox scrollbar colors"
);

assert.ok(
	source.includes("::-webkit-scrollbar"),
	"global stylesheet should define WebKit scrollbar selectors"
);

assert.ok(
	source.includes("::-webkit-scrollbar-thumb"),
	"global stylesheet should define a WebKit scrollbar thumb"
);

assert.ok(
	source.includes("::-webkit-scrollbar-track"),
	"global stylesheet should define a WebKit scrollbar track"
);

console.log("scrollbar-styles test passed");
