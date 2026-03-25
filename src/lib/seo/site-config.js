export const DEFAULT_SITE_URL = "https://readlab-x.github.io/symposium-web";

export const SITE_NAME_ZH = "会饮研读台";
export const SITE_NAME_EN = "Symposium Reading Desk";
export const SITE_NAME = `${SITE_NAME_ZH} | ${SITE_NAME_EN}`;
export const SITE_DESCRIPTION =
	"围绕柏拉图《会饮》的双语数字研读台，结合原文阅读、人物索引、主题地图与关系图。 A bilingual reading desk for Plato's Symposium with original text reading, character index, theme map, and relation graph.";

export const DEFAULT_OG_IMAGE_PATH = "/branding/logo.png";
export const DEFAULT_LOCALE = "zh_CN";
export const DEFAULT_TWITTER_CARD = "summary_large_image";

export const ROUTE_SEO = {
	"/": {
		title: SITE_NAME,
		description: SITE_DESCRIPTION,
		robots: "index,follow",
		schemaTypes: ["WebSite", "WebPage"],
		sitemap: true
	},
	"/reading": {
		title: `原文阅读 | Original Text Reading | ${SITE_NAME}`,
		description:
			"原文阅读台以原文与注解并行展开，可按场景与人物筛选《会饮》文本。 Original Text Reading presents Symposium with annotations, scene filters, and speaker filters.",
		robots: "index,follow",
		schemaTypes: ["WebPage"],
		sitemap: true
	},
	"/characters": {
		title: `人物索引 | Character Index | ${SITE_NAME}`,
		description:
			"汇集《会饮》出场人物与相关神祇的简介、篇内定位与外部百科入口。 Browse people and deities in Symposium with bios, in-text context, and encyclopedia links.",
		robots: "index,follow",
		schemaTypes: ["CollectionPage"],
		sitemap: true
	},
	"/themes": {
		title: `主题地图 | Theme Map | ${SITE_NAME}`,
		description:
			"沿着荣誉、欲望、完整、美与不朽等主题横向阅读《会饮》。 Follow Symposium across themes such as honor, desire, wholeness, beauty, and immortality.",
		robots: "index,follow",
		schemaTypes: ["CollectionPage"],
		sitemap: true
	},
	"/relations": {
		title: `关系图 | Relation Graph | ${SITE_NAME}`,
		description:
			"通过人物关系图查看《会饮》中的回应、修正、继承与叙事关联。 Inspect argumentative, narrative, and pedagogical relations inside Symposium.",
		robots: "index,follow",
		schemaTypes: ["CollectionPage"],
		sitemap: true
	},
	"/search": {
		title: `全文搜索 | Full-text Search | ${SITE_NAME}`,
		description:
			"按关键词、人物与主题快速定位《会饮》文本，但当前搜索结果不适合被搜索引擎索引。 Search Symposium by keyword, speaker, and theme, while keeping transient result pages out of search indexes.",
		robots: "noindex,follow",
		schemaTypes: ["SearchResultsPage"],
		sitemap: false
	}
};

export const PUBLIC_SITEMAP_PATHS = Object.entries(ROUTE_SEO)
	.filter(([, route]) => route.sitemap)
	.map(([pathname]) => pathname);
