import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { verifyCharacterAvatarData } from "../scripts/verify-character-avatar-data.mjs";

function createPngHeader(width, height) {
	const buffer = Buffer.alloc(24);
	buffer[0] = 0x89;
	buffer.write("PNG", 1, "ascii");
	buffer.writeUInt32BE(13, 8);
	buffer.write("IHDR", 12, "ascii");
	buffer.writeUInt32BE(width, 16);
	buffer.writeUInt32BE(height, 20);
	return buffer;
}

function withTempRepo(run) {
	const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "avatar-verify-"));
	const staticRoot = path.join(tempRoot, "static", "avatars", "characters");
	fs.mkdirSync(staticRoot, { recursive: true });
	return run({ tempRoot, staticRoot });
}

await withTempRepo(({ tempRoot, staticRoot }) => {
	fs.writeFileSync(path.join(staticRoot, "socrates.png"), createPngHeader(512, 512));

	const characters = [
		{
			id: "socrates",
			avatar: "苏",
			avatarImage: "/avatars/characters/socrates.png"
		},
		{
			id: "alcibiades",
			avatar: "阿",
			avatarImage: "/avatars/characters/alcibiades.svg"
		}
	];

	assert.doesNotThrow(() =>
		verifyCharacterAvatarData({
			characters,
			publicRoot: path.join(tempRoot, "static"),
			targetId: "socrates"
		})
	);

	assert.throws(
		() =>
			verifyCharacterAvatarData({
				characters,
				publicRoot: path.join(tempRoot, "static"),
				targetId: "alcibiades"
			}),
		/avatarImage must point to \/avatars\/characters\/alcibiades\.png/
	);
});

await withTempRepo(({ tempRoot, staticRoot }) => {
	fs.writeFileSync(path.join(staticRoot, "socrates.png"), createPngHeader(384, 512));

	assert.throws(
		() =>
			verifyCharacterAvatarData({
				characters: [
					{
						id: "socrates",
						avatar: "苏",
						avatarImage: "/avatars/characters/socrates.png"
					}
				],
				publicRoot: path.join(tempRoot, "static"),
				targetId: "socrates"
			}),
		/Avatar PNG must be 512x512/
	);
});

assert.throws(
		() =>
			verifyCharacterAvatarData({
				characters: [
					{
						id: "socrates",
						avatar: "苏",
						avatarImage: "/avatars/characters/socrates.png"
					}
				],
				publicRoot: path.join(process.cwd(), "static"),
				targetId: "agathon"
			}),
		/Unknown character id: agathon/
	);

console.log("verify-character-avatar-data test passed");
