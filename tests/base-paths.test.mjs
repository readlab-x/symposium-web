import assert from "node:assert/strict";
import {
	joinBasePath,
	normalizeBasePath,
	stripBasePath
} from "../src/lib/paths/base-paths.js";

assert.equal(normalizeBasePath(""), "", "expected empty base path to stay empty");
assert.equal(
	normalizeBasePath("/huiyin-symposium/"),
	"/huiyin-symposium",
	"expected trailing slash to be removed from base path"
);
assert.equal(
	joinBasePath("/huiyin-symposium", "/reading"),
	"/huiyin-symposium/reading",
	"expected internal route to be prefixed with base path"
);
assert.equal(
	joinBasePath("/huiyin-symposium", "/branding/logo-mark.png"),
	"/huiyin-symposium/branding/logo-mark.png",
	"expected asset path to be prefixed with base path"
);
assert.equal(
	joinBasePath("/huiyin-symposium", "https://example.com"),
	"https://example.com",
	"expected external urls to stay unchanged"
);
assert.equal(
	stripBasePath("/huiyin-symposium", "/huiyin-symposium/reading"),
	"/reading",
	"expected incoming pathname to strip the configured base path"
);

console.log("base-paths test passed");
