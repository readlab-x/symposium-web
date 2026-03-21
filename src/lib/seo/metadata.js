import {
	DEFAULT_LOCALE,
	DEFAULT_OG_IMAGE_PATH,
	DEFAULT_SITE_URL,
	DEFAULT_TWITTER_CARD,
	PUBLIC_SITEMAP_PATHS,
	ROUTE_SEO,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_NAME_EN,
	SITE_NAME_ZH
} from "./site-config.js";

/** @typedef {keyof typeof ROUTE_SEO} SeoPathname */

/**
 * @param {string} pathname
 * @returns {string}
 */
function normalizePathname(pathname) {
	if (!pathname || pathname === "/") return "/";
	const trimmed = pathname.trim();
	if (!trimmed || trimmed === "/") return "/";
	return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

/**
 * @param {string} value
 * @returns {string}
 */
function trimLeadingSlash(value) {
	return value.replace(/^\/+/, "");
}

/**
 * @param {string} pathname
 * @returns {SeoPathname}
 */
function resolveSeoPathname(pathname) {
	const normalizedPathname = normalizePathname(pathname);
	if (normalizedPathname in ROUTE_SEO) {
		return /** @type {SeoPathname} */ (normalizedPathname);
	}

	return "/";
}

/**
 * @param {string | undefined} [siteUrl]
 * @returns {string}
 */
export function normalizeSiteUrl(siteUrl = DEFAULT_SITE_URL) {
	const fallback = DEFAULT_SITE_URL;
	const raw = typeof siteUrl === "string" ? siteUrl.trim() : "";
	const candidate = raw || fallback;
	const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;
	return withProtocol.replace(/\/+$/, "");
}

/**
 * @param {string} pathname
 * @param {string | undefined} siteUrl
 * @returns {string}
 */
export function buildCanonicalUrl(pathname, siteUrl) {
	const normalizedPathname = normalizePathname(pathname);
	const normalizedSiteUrl = normalizeSiteUrl(siteUrl);
	if (normalizedPathname === "/") {
		return `${normalizedSiteUrl}/`;
	}

	return `${normalizedSiteUrl}/${trimLeadingSlash(normalizedPathname)}`;
}

/**
 * @param {string} pathname
 */
function getRouteSeo(pathname) {
	return ROUTE_SEO[resolveSeoPathname(pathname)];
}

/**
 * @param {string} siteUrl
 */
function buildWebsiteSchema(siteUrl) {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": `${buildCanonicalUrl("/", siteUrl)}#website`,
		url: buildCanonicalUrl("/", siteUrl),
		name: SITE_NAME,
		alternateName: [SITE_NAME_ZH, SITE_NAME_EN],
		description: SITE_DESCRIPTION,
		inLanguage: ["zh-CN", "en-US"]
	};
}

/**
 * @typedef {{
 *   type: string;
 *   title: string;
 *   description: string;
 *   canonicalUrl: string;
 *   imageUrl: string;
 *   siteUrl: string;
 * }} WebPageSchemaInput
 */

/**
 * @param {WebPageSchemaInput} input
 */
function buildWebPageSchema({ type, title, description, canonicalUrl, imageUrl, siteUrl }) {
	return {
		"@context": "https://schema.org",
		"@type": type,
		"@id": `${canonicalUrl}#webpage`,
		url: canonicalUrl,
		name: title,
		description,
		inLanguage: ["zh-CN", "en-US"],
		isPartOf: {
			"@id": `${buildCanonicalUrl("/", siteUrl)}#website`
		},
		primaryImageOfPage: {
			"@type": "ImageObject",
			url: imageUrl
		}
	};
}

/**
 * @typedef {{
 *   pathname: string;
 *   siteUrl: string;
 *   title: string;
 *   description: string;
 *   canonicalUrl: string;
 *   imageUrl: string;
 *   schemaTypes: string[];
 * }} JsonLdInput
 */

/**
 * @param {JsonLdInput} input
 */
function buildJsonLd({ pathname, siteUrl, title, description, canonicalUrl, imageUrl, schemaTypes }) {
	const primaryType = schemaTypes[0] ?? "WebPage";
	const pageSchema = buildWebPageSchema({
		type: primaryType,
		title,
		description,
		canonicalUrl,
		imageUrl,
		siteUrl
	});

	if (normalizePathname(pathname) === "/") {
		return [buildWebsiteSchema(siteUrl), buildWebPageSchema({
			type: schemaTypes[1] ?? "WebPage",
			title,
			description,
			canonicalUrl,
			imageUrl,
			siteUrl
		})];
	}

	return [pageSchema];
}

/**
 * @param {{ pathname?: string; siteUrl?: string }} [input]
 */
export function getSeoMetadata({ pathname = "/", siteUrl = DEFAULT_SITE_URL } = {}) {
	const normalizedPathname = normalizePathname(pathname);
	const routeSeo = getRouteSeo(normalizedPathname);
	const canonicalUrl = buildCanonicalUrl(normalizedPathname, siteUrl);
	const imageUrl = buildCanonicalUrl(DEFAULT_OG_IMAGE_PATH, siteUrl);
	const jsonLd = buildJsonLd({
		pathname: normalizedPathname,
		siteUrl,
		title: routeSeo.title,
		description: routeSeo.description,
		canonicalUrl,
		imageUrl,
		schemaTypes: routeSeo.schemaTypes
	});

	return {
		pathname: normalizedPathname,
		title: routeSeo.title,
		description: routeSeo.description,
		robots: routeSeo.robots,
		canonicalUrl,
		imageUrl,
		jsonLd,
		openGraph: {
			title: routeSeo.title,
			description: routeSeo.description,
			type: "website",
			url: canonicalUrl,
			siteName: SITE_NAME,
			locale: DEFAULT_LOCALE,
			image: imageUrl
		},
		twitter: {
			card: DEFAULT_TWITTER_CARD,
			title: routeSeo.title,
			description: routeSeo.description,
			image: imageUrl
		}
	};
}

/**
 * @param {string | undefined} [siteUrl]
 * @returns {string}
 */
export function buildRobotsTxt(siteUrl = DEFAULT_SITE_URL) {
	return [
		"User-agent: *",
		"Disallow:",
		"",
		`Sitemap: ${buildCanonicalUrl("/sitemap.xml", siteUrl)}`
	].join("\n");
}

/**
 * @param {string | undefined} [siteUrl]
 * @returns {string}
 */
export function buildSitemapXml(siteUrl = DEFAULT_SITE_URL) {
	const urls = PUBLIC_SITEMAP_PATHS.map((pathname) => {
		const loc = buildCanonicalUrl(pathname, siteUrl);
		return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
	}).join("\n");

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		urls,
		"</urlset>"
	].join("\n");
}
