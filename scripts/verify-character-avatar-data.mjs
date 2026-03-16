import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const charactersPath = path.join(repoRoot, "src/lib/data/characters.json");
const publicRoot = path.join(repoRoot, "static");
const characters = JSON.parse(fs.readFileSync(charactersPath, "utf8"));

for (const character of characters) {
	if (typeof character.avatar !== "string" || character.avatar.length === 0) {
		throw new Error(`Missing avatar fallback for ${character.id}`);
	}

	if (Array.from(character.avatar.trim()).length !== 1) {
		throw new Error(`Fallback avatar should remain a single visible character for ${character.id}`);
	}

	if (typeof character.avatarImage !== "string" || character.avatarImage.length === 0) {
		throw new Error(`Missing avatarImage for ${character.id}`);
	}

	const imagePath = path.join(publicRoot, character.avatarImage.replace(/^\//, ""));
	if (!fs.existsSync(imagePath)) {
		throw new Error(`Missing avatar asset for ${character.id}: ${character.avatarImage}`);
	}

	const svg = fs.readFileSync(imagePath, "utf8");
	if (!svg.includes('data-avatar-style="greek-profile-v2"')) {
		throw new Error(`Legacy avatar style detected for ${character.id}`);
	}

	if (svg.includes("<ellipse")) {
		throw new Error(`Legacy frontal-face geometry detected for ${character.id}`);
	}
}

console.log(`Verified ${characters.length} character avatar records.`);
