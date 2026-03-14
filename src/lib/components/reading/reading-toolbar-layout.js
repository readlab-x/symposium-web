/**
 * @param {{ activeCount: number; totalCount: number; language: string }} params
 */
export function getReadingToolbarSummary({ activeCount, totalCount, language }) {
	const prefix = language === "zh-CN" ? "人物" : "Speakers";
	if (activeCount >= totalCount) {
		return language === "zh-CN" ? `${prefix} · 全部` : `${prefix} · All`;
	}

	return `${prefix} · ${activeCount}/${totalCount}`;
}

export function getReadingHeaderLayoutClass() {
	return "grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start";
}

export function getReadingDialogueColumnClass() {
	return "space-y-4";
}

export function getReadingAnnotationWrapClass() {
	return "hidden lg:order-2 lg:block";
}
