import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const relationsPath = path.join(repoRoot, "src/lib/data/relations.json");
const charactersPath = path.join(repoRoot, "src/lib/data/characters.json");
const relations = JSON.parse(fs.readFileSync(relationsPath, "utf8"));
const characters = JSON.parse(fs.readFileSync(charactersPath, "utf8"));
const characterIds = new Set(characters.map((character) => character.id));

for (const node of relations.nodes) {
	if ((node.type === "person" || node.type === "deity") && !characterIds.has(node.id)) {
		throw new Error(`Missing avatar source character for relation node ${node.id}`);
	}
}

console.log(`Verified ${relations.nodes.length} relation nodes for avatar join readiness.`);
