import assert from "node:assert/strict";
import {
	joinBasePath,
	normalizeBasePath,
	stripBasePath
} from "../src/lib/paths/base-paths.js";

assert.equal(normalizeBasePath(""), "", "expected empty base path to stay empty");
assert.equal(
	normalizeBasePath("/symposium-web/"),
	"/symposium-web",
	"expected trailing slash to be removed from base path"
);
assert.equal(
	joinBasePath("/symposium-web", "/reading"),
	"/symposium-web/reading",
	"expected internal route to be prefixed with base path"
);
assert.equal(
	joinBasePath("/symposium-web", "/branding/logo-mark.png"),
	"/symposium-web/branding/logo-mark.png",
	"expected asset path to be prefixed with base path"
);
assert.equal(
	joinBasePath("/symposium-web", "https://example.com"),
	"https://example.com",
	"expected external urls to stay unchanged"
);
assert.equal(
	stripBasePath("/symposium-web", "/symposium-web/reading"),
	"/reading",
	"expected incoming pathname to strip the configured base path"
);

console.log("base-paths test passed");
