/** @type {Record<"zh-CN" | "en-US", string>} */
const siteTitleByLanguage = {
	"zh-CN": "会饮研读台",
	"en-US": "Symposium Reading Desk"
};

/** @type {Record<string, Record<"zh-CN" | "en-US", string>>} */
const pageTitleByRoute = {
	"/": {
		"zh-CN": "",
		"en-US": ""
	},
	"/reading": {
		"zh-CN": "原文阅读台",
		"en-US": "Original Text Reading"
	},
	"/characters": {
		"zh-CN": "人物索引",
		"en-US": "Character Index"
	},
	"/themes": {
		"zh-CN": "观点主题地图",
		"en-US": "Theme Map"
	},
	"/relations": {
		"zh-CN": "人物关系图",
		"en-US": "Relation Graph"
	},
	"/search": {
		"zh-CN": "全文搜索",
		"en-US": "Full-text Search"
	}
};

/**
 * @param {string} pathname
 */
function normalizePathname(pathname) {
	if (!pathname || pathname === "/") return "/";
	return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

/**
 * @param {string} pathname
 * @param {"zh-CN" | "en-US"} language
 */
export function getDocumentTitle(pathname, language) {
	const normalizedLanguage = language === "en-US" ? "en-US" : "zh-CN";
	const siteTitle = siteTitleByLanguage[normalizedLanguage];
	const pageTitle = pageTitleByRoute[normalizePathname(pathname)]?.[normalizedLanguage];

	if (!pageTitle) return siteTitle;

	return `${pageTitle} · ${siteTitle}`;
}
