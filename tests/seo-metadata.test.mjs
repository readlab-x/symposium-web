import assert from "node:assert/strict";
import { getSeoMetadata } from "../src/lib/seo/metadata.js";
import { DEFAULT_SITE_URL } from "../src/lib/seo/site-config.js";

const siteUrl = "https://github.6iedog.com/symposium-web";

assert.equal(
	DEFAULT_SITE_URL,
	siteUrl,
	"expected default site url to match the renamed repository path"
);

const home = getSeoMetadata({ pathname: "/", siteUrl });
assert.equal(
	home.title,
	"会饮研读台 | Symposium Reading Desk",
	"expected mixed bilingual home title"
);
assert.equal(
	home.canonicalUrl,
	"https://github.6iedog.com/symposium-web/",
	"expected home canonical url to preserve site base path"
);
assert.equal(home.robots, "index,follow", "expected home page to be indexable");
assert.equal(home.jsonLd[0]["@type"], "WebSite", "expected homepage to emit WebSite schema");
assert.equal(home.jsonLd[1]["@type"], "WebPage", "expected homepage to emit WebPage schema");

const reading = getSeoMetadata({ pathname: "/reading", siteUrl });
assert.equal(
	reading.canonicalUrl,
	"https://github.6iedog.com/symposium-web/reading",
	"expected reading canonical url without query params"
);
assert.match(reading.description, /原文阅读台/, "expected reading description to include Chinese copy");
assert.match(reading.description, /Original Text Reading/, "expected reading description to include English copy");

const characters = getSeoMetadata({ pathname: "/characters", siteUrl });
assert.equal(
	characters.jsonLd[0]["@type"],
	"CollectionPage",
	"expected character index to use CollectionPage schema"
);

const search = getSeoMetadata({ pathname: "/search", siteUrl });
assert.equal(search.robots, "noindex,follow", "expected search page to be noindex");
assert.equal(
	search.canonicalUrl,
	"https://github.6iedog.com/symposium-web/search",
	"expected search canonical url"
);

console.log("seo-metadata test passed");
