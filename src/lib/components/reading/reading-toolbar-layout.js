/**
 * @param {{ activeCount: number; totalCount: number; language: string; prefixZh: string; prefixEn: string }} params
 */
function getCompactToolbarSummary({ activeCount, totalCount, language, prefixZh, prefixEn }) {
	const prefix = language === "zh-CN" ? prefixZh : prefixEn;
	if (activeCount >= totalCount) {
		return language === "zh-CN" ? `${prefix} · 全部` : `${prefix} · All`;
	}

	return `${prefix} · ${activeCount}/${totalCount}`;
}

/**
 * @param {{ activeCount: number; totalCount: number; language: string }} params
 */
export function getReadingToolbarSummary({ activeCount, totalCount, language }) {
	return getCompactToolbarSummary({
		activeCount,
		totalCount,
		language,
		prefixZh: "人物",
		prefixEn: "Speakers"
	});
}

/**
 * @param {{ activeCount: number; totalCount: number; language: string }} params
 */
export function getReadingSceneToolbarSummary({ activeCount, totalCount, language }) {
	return getCompactToolbarSummary({
		activeCount,
		totalCount,
		language,
		prefixZh: "场景",
		prefixEn: "Scenes"
	});
}

export function getReadingHeaderLayoutClass() {
	return "grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start";
}

export function getReadingDialogueColumnClass() {
	return "space-y-4";
}

export function getReadingAnnotationWrapClass() {
	return "hidden lg:order-2 lg:block";
}
