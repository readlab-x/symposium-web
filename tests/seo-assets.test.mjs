import assert from "node:assert/strict";
import { buildRobotsTxt, buildSitemapXml } from "../src/lib/seo/metadata.js";

const siteUrl = "https://readlab-x.github.io/symposium-web";

const robots = buildRobotsTxt(siteUrl);
assert.match(robots, /^User-agent: \*/m, "expected robots to declare a user agent");
assert.match(robots, /^Disallow:\s*$/m, "expected robots to allow crawling by default");
assert.match(
	robots,
	/^Sitemap: https:\/\/readlab-x\.github\.io\/symposium-web\/sitemap\.xml$/m,
	"expected robots to point at the sitemap"
);

const sitemap = buildSitemapXml(siteUrl);
assert.match(sitemap, /<urlset/, "expected sitemap urlset root");
assert.match(
	sitemap,
	/<loc>https:\/\/readlab-x\.github\.io\/symposium-web\/<\/loc>/,
	"expected sitemap to include home"
);
assert.match(
	sitemap,
	/<loc>https:\/\/readlab-x\.github\.io\/symposium-web\/reading<\/loc>/,
	"expected sitemap to include reading page"
);
assert.match(
	sitemap,
	/<loc>https:\/\/readlab-x\.github\.io\/symposium-web\/characters<\/loc>/,
	"expected sitemap to include character index"
);
assert.doesNotMatch(
	sitemap,
	/<loc>https:\/\/readlab-x\.github\.io\/symposium-web\/search<\/loc>/,
	"expected noindex search page to stay out of sitemap"
);

console.log("seo-assets test passed");
