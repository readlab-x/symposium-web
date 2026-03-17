import assert from "node:assert/strict";
import annotations from "../src/lib/data/annotations.json" with { type: "json" };
import characters from "../src/lib/data/characters.json" with { type: "json" };
import dialogs from "../src/lib/data/dialogs.json" with { type: "json" };
import places from "../src/lib/data/places.json" with { type: "json" };
import relations from "../src/lib/data/relations.json" with { type: "json" };
import themes from "../src/lib/data/themes.json" with { type: "json" };
import {
	annotationEnglishById,
	characterEnglishBioById,
	characterEnglishRoleById,
	characterEnglishSummaryById,
	placeEnglishNameById,
	placeEnglishSummaryById,
	relationEdgeEnglishById,
	relationNodeEnglishSummaryById,
	tagEnglishBySource,
	themeEnglishNameById,
	themeEnglishSummaryById
} from "../src/lib/data/content-i18n.js";

for (const annotation of annotations) {
	const translated = annotationEnglishById[annotation.id];
	assert.ok(translated?.title, `expected English annotation title for ${annotation.id}`);
	assert.ok(translated?.content, `expected English annotation content for ${annotation.id}`);
	assert.notEqual(
		translated.title,
		annotation.title,
		`expected English annotation title to differ from Chinese source for ${annotation.id}`
	);
	assert.notEqual(
		translated.content,
		annotation.content,
		`expected English annotation content to differ from Chinese source for ${annotation.id}`
	);
}

for (const character of characters) {
	assert.ok(
		characterEnglishRoleById[character.id],
		`expected English character role for ${character.id}`
	);
	assert.ok(
		characterEnglishSummaryById[character.id],
		`expected English character summary for ${character.id}`
	);
	if (character.bio) {
		assert.ok(
			characterEnglishBioById[character.id],
			`expected English character bio for ${character.id}`
		);
	}
}

for (const place of places) {
	assert.ok(placeEnglishNameById[place.id], `expected English place name for ${place.id}`);
	assert.ok(
		placeEnglishSummaryById[place.id],
		`expected English place summary for ${place.id}`
	);
}

for (const theme of themes) {
	assert.ok(themeEnglishNameById[theme.id], `expected English theme name for ${theme.id}`);
	assert.ok(themeEnglishSummaryById[theme.id], `expected English theme summary for ${theme.id}`);
}

for (const node of relations.nodes) {
	assert.ok(
		relationNodeEnglishSummaryById[node.id],
		`expected English relation node summary for ${node.id}`
	);
}

for (const edge of relations.edges) {
	assert.ok(relationEdgeEnglishById[edge.id], `expected English relation edge label for ${edge.id}`);
}

const allTags = new Set([
	...dialogs.flatMap((line) => line.tags),
	...annotations.flatMap((annotation) => annotation.tags)
]);

for (const tag of allTags) {
	assert.ok(tagEnglishBySource[tag], `expected English tag translation for ${tag}`);
	assert.notEqual(tagEnglishBySource[tag], tag, `expected English tag to differ from Chinese for ${tag}`);
}

console.log("content-i18n test passed");
