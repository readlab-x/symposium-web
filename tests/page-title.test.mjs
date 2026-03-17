import assert from "node:assert/strict";
import { getDocumentTitle } from "../src/lib/seo/page-title.js";

assert.equal(
	getDocumentTitle("/", "zh-CN"),
	"会饮研读台",
	"expected Chinese home title"
);

assert.equal(
	getDocumentTitle("/", "en-US"),
	"Symposium Reading Desk",
	"expected English home title"
);

assert.equal(
	getDocumentTitle("/reading", "zh-CN"),
	"原文阅读台 · 会饮研读台",
	"expected Chinese reading title"
);

assert.equal(
	getDocumentTitle("/reading", "en-US"),
	"Original Text Reading · Symposium Reading Desk",
	"expected English reading title"
);

assert.equal(
	getDocumentTitle("/characters", "zh-CN"),
	"人物索引 · 会饮研读台",
	"expected Chinese character title"
);

assert.equal(
	getDocumentTitle("/themes", "en-US"),
	"Theme Map · Symposium Reading Desk",
	"expected English theme title"
);

assert.equal(
	getDocumentTitle("/relations", "en-US"),
	"Relation Graph · Symposium Reading Desk",
	"expected English relation title"
);

assert.equal(
	getDocumentTitle("/search", "zh-CN"),
	"全文搜索 · 会饮研读台",
	"expected Chinese search title"
);

assert.equal(
	getDocumentTitle("/unknown", "en-US"),
	"Symposium Reading Desk",
	"expected fallback title"
);

console.log("page-title test passed");
