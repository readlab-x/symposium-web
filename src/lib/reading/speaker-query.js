/**
 * @param {string | null | undefined} rawQuery
 * @param {string[]} validSpeakerIds
 * @param {string[]} defaultSpeakerIds
 * @returns {string[]}
 */
export function resolveSpeakerIdsFromQuery(rawQuery, validSpeakerIds, defaultSpeakerIds) {
	const fallbackSpeakerIds = [...defaultSpeakerIds];

	if (typeof rawQuery !== "string" || rawQuery.trim().length === 0) {
		return fallbackSpeakerIds;
	}

	const validSpeakerIdSet = new Set(validSpeakerIds);
	const seenSpeakerIds = new Set();
	const selectedSpeakerIds = [];

	for (const candidate of rawQuery.split(",")) {
		const speakerId = candidate.trim();
		if (!speakerId || !validSpeakerIdSet.has(speakerId) || seenSpeakerIds.has(speakerId)) {
			continue;
		}

		seenSpeakerIds.add(speakerId);
		selectedSpeakerIds.push(speakerId);
	}

	return selectedSpeakerIds.length > 0 ? selectedSpeakerIds : fallbackSpeakerIds;
}
