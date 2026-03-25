/**
 * @param {{ activeIds: string[]; allIds: string[] }} params
 */
export function areAllSelected({ activeIds, allIds }) {
	if (allIds.length === 0) return false;

	const activeSet = new Set(activeIds);
	return allIds.every((id) => activeSet.has(id));
}

/**
 * @param {{ activeIds: string[]; allIds: string[] }} params
 */
export function toggleAllSelection({ activeIds, allIds }) {
	return areAllSelected({ activeIds, allIds }) ? [] : [...allIds];
}
