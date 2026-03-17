import assert from "node:assert/strict";
import dialogs from "../src/lib/data/dialogs.json" with { type: "json" };
import characters from "../src/lib/data/characters.json" with { type: "json" };
import {
	chapterEnglishBySource,
	characterEnglishNameById,
	dialogEnglishTextById
} from "../src/lib/data/reading-i18n.js";

for (const line of dialogs) {
	assert.ok(dialogEnglishTextById[line.id], `expected English primary text for ${line.id}`);
	assert.notEqual(
		dialogEnglishTextById[line.id],
		line.text,
		`expected English text to differ from Chinese source for ${line.id}`
	);
	assert.ok(
		chapterEnglishBySource[line.chapter],
		`expected English chapter label for ${line.chapter} (${line.id})`
	);
}

for (const character of characters) {
	assert.ok(
		characterEnglishNameById[character.id],
		`expected English character name for ${character.id}`
	);
}

console.log("dialog-i18n test passed");
