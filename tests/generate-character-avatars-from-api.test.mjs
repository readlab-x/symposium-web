import assert from "node:assert/strict";
import path from "node:path";

import {
	buildGenerationParts,
	composePrompt,
	extractImageBufferFromResponse,
	getDefaultReferenceDir
} from "../scripts/generate-character-avatars-from-api.mjs";

const entry = {
	id: "socrates",
	prompt: "front-facing bust portrait of Socrates",
	negativePrompt: "text, watermark, side profile"
};

assert.equal(
	getDefaultReferenceDir(),
	path.join(process.cwd(), "static", "avatars", "characters-test")
);

const prompt = composePrompt(entry);

assert.match(prompt, /front-facing bust portrait of Socrates/);
assert.match(prompt, /Negative constraints:/);
assert.match(prompt, /text, watermark, side profile/);
assert.match(prompt, /Output requirements:/);
assert.match(prompt, /1024x1024/);
assert.match(prompt, /plain warm ivory parchment background/);
assert.match(prompt, /no circular crop/i);
assert.match(prompt, /no cameo portrait/i);
assert.match(prompt, /shoulders and drapery must extend naturally to the left, right, and bottom frame edges/i);

const parts = buildGenerationParts(entry, [
	{ mimeType: "image/jpeg", data: "AAA" },
	{ mimeType: "image/png", data: "BBB" }
]);

assert.deepEqual(parts[0], {
	text: prompt
});
assert.deepEqual(parts[1], {
	inlineData: {
		mimeType: "image/jpeg",
		data: "AAA"
	}
});
assert.deepEqual(parts[2], {
	inlineData: {
		mimeType: "image/png",
		data: "BBB"
	}
});

const buffer = extractImageBufferFromResponse({
	candidates: [
		{
			content: {
				parts: [{ text: "![image](data:image/png;base64,QUJD)" }]
			}
		}
	]
});

assert.equal(buffer.toString("ascii"), "ABC");

const inlineBuffer = extractImageBufferFromResponse({
	candidates: [
		{
			content: {
				parts: [
					{
						inlineData: {
							mimeType: "image/png",
							data: "REVG"
						}
					}
				]
			}
		}
	]
});

assert.equal(inlineBuffer.toString("ascii"), "DEF");

console.log("generate-character-avatars-from-api test passed");
