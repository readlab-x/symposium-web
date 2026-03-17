import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function parseTargetId(args) {
	const idIndex = args.indexOf("--id");
	if (idIndex === -1) return null;

	const targetId = args[idIndex + 1];
	if (!targetId) {
		throw new Error("Missing value for --id");
	}

	return targetId;
}

export function verifyCharacterAvatarData({ characters, publicRoot, targetId = null }) {
	const selectedCharacters = targetId
		? characters.filter((character) => character.id === targetId)
		: characters;

	if (targetId && selectedCharacters.length === 0) {
		throw new Error(`Unknown character id: ${targetId}`);
	}

	for (const character of selectedCharacters) {
		if (typeof character.avatar !== "string" || character.avatar.length === 0) {
			throw new Error(`Missing avatar fallback for ${character.id}`);
		}

		if (Array.from(character.avatar.trim()).length !== 1) {
			throw new Error(`Fallback avatar should remain a single visible character for ${character.id}`);
		}

		if (typeof character.avatarImage !== "string" || character.avatarImage.length === 0) {
			throw new Error(`Missing avatarImage for ${character.id}`);
		}

		const expectedImagePath = `/avatars/characters/${character.id}.png`;
		if (character.avatarImage !== expectedImagePath) {
			throw new Error(`avatarImage must point to ${expectedImagePath}`);
		}

		const imagePath = path.join(publicRoot, character.avatarImage.replace(/^\//, ""));
		if (!fs.existsSync(imagePath)) {
			throw new Error(`Missing avatar asset for ${character.id}: ${character.avatarImage}`);
		}

		const buffer = fs.readFileSync(imagePath);
		if (buffer.length < 24 || buffer[0] !== 0x89 || buffer.toString("ascii", 1, 4) !== "PNG") {
			throw new Error(`Avatar asset is not a PNG for ${character.id}`);
		}

		const width = buffer.readUInt32BE(16);
		const height = buffer.readUInt32BE(20);

		if (width !== 512 || height !== 512) {
			throw new Error(`Avatar PNG must be 512x512 for ${character.id}, got ${width}x${height}`);
		}
	}

	return selectedCharacters.length;
}

function runCli() {
	const repoRoot = process.cwd();
	const charactersPath = path.join(repoRoot, "src/lib/data/characters.json");
	const publicRoot = path.join(repoRoot, "static");
	const characters = JSON.parse(fs.readFileSync(charactersPath, "utf8"));
	const targetId = parseTargetId(process.argv.slice(2));
	const verifiedCount = verifyCharacterAvatarData({ characters, publicRoot, targetId });
	const label = verifiedCount === 1 ? "record" : "records";

	console.log(`Verified ${verifiedCount} character avatar ${label}.`);
}

const executedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;
const currentPath = fileURLToPath(import.meta.url);

if (executedPath === currentPath) {
	runCli();
}
