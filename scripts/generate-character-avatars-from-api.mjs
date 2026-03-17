import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const DEFAULT_BASE_URL = "https://api.cpass.cc";
const DEFAULT_MODEL = "gemini-3.1-flash-image-preview";
const MANIFEST_PATH = path.join(
	process.cwd(),
	"docs",
	"prompts",
	"2026-03-16-character-avatar-generation-prompts.json"
);

export function getDefaultReferenceDir() {
	return path.join(process.cwd(), "static", "avatars", "characters-test");
}

export function composePrompt(entry) {
	return [
		"Use the attached reference images only as style reference. Preserve their front-facing bust crop, parchment background, crisp ink contour, and soft cel shading, but do not copy the reference face or costume unless it matches the target character.",
		entry.prompt,
		"Output requirements: front-facing only, head and shoulders only, plain warm ivory parchment background, shoulders and drapery must extend naturally to the left, right, and bottom frame edges, no circular crop, no oval vignette, no cameo portrait, no floating bust cutout, no text, no sparkle, no watermark, no extra hands or props, square composition, render at 1024x1024.",
		`Negative constraints: ${entry.negativePrompt}`
	].join(" ");
}

function loadReferenceImages(referenceDir = getDefaultReferenceDir()) {
	if (!fs.existsSync(referenceDir)) {
		throw new Error(`Missing avatar reference directory: ${referenceDir}`);
	}

	const imagePaths = fs
		.readdirSync(referenceDir)
		.filter((fileName) => fileName.toLowerCase().endsWith(".png"))
		.sort((left, right) => left.localeCompare(right))
		.map((fileName) => path.join(referenceDir, fileName));

	if (imagePaths.length === 0) {
		throw new Error(`No PNG style references found in ${referenceDir}`);
	}

	return imagePaths.map((imagePath) => {
		const data = execFileSync(
			"magick",
			[imagePath, "-resize", "256x256", "-quality", "82", "jpeg:-"],
			{
				maxBuffer: 10 * 1024 * 1024
			}
		).toString("base64");

		return {
			mimeType: "image/jpeg",
			data
		};
	});
}

export function buildGenerationParts(entry, referenceImages = loadReferenceImages()) {
	return [
		{ text: composePrompt(entry) },
		...referenceImages.map(({ mimeType, data }) => ({
			inlineData: {
				mimeType,
				data
			}
		}))
	];
}

export function extractImageBufferFromResponse(payload) {
	const parts = payload?.candidates?.[0]?.content?.parts;
	const inlineImagePart = Array.isArray(parts)
		? parts.find(
				(part) =>
					part?.inlineData?.mimeType === "image/png" &&
					typeof part?.inlineData?.data === "string" &&
					part.inlineData.data.length > 0
		  )
		: null;

	if (inlineImagePart) {
		return Buffer.from(inlineImagePart.inlineData.data, "base64");
	}

	const joinedText = Array.isArray(parts)
		? parts
				.map((part) => (typeof part?.text === "string" ? part.text : ""))
				.join("\n")
		: "";
	const match = joinedText.match(/data:image\/png;base64,([A-Za-z0-9+/=\r\n]+)/);
	const encoded = match?.[1]?.replace(/\s+/g, "");

	if (typeof encoded !== "string" || encoded.length === 0) {
		throw new Error("Missing image data in generateContent response");
	}

	return Buffer.from(encoded, "base64");
}

function loadManifest() {
	return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
}

function selectEntries(entries, ids) {
	if (ids.length === 0) return entries;

	const selected = entries.filter((entry) => ids.includes(entry.id));
	const missing = ids.filter((id) => !selected.some((entry) => entry.id === id));

	if (missing.length > 0) {
		throw new Error(`Unknown avatar ids: ${missing.join(", ")}`);
	}

	return selected;
}

async function requestImage({ baseUrl, apiKey, model, entry }) {
	const response = await fetch(`${baseUrl}/v1beta/models/${model}:generateContent`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			contents: [
				{
					parts: buildGenerationParts(entry)
				}
			]
		})
	});

	const responseText = await response.text();
	let payload = null;

	try {
		payload = JSON.parse(responseText);
	} catch {
		payload = null;
	}

	if (!response.ok) {
		throw new Error(
			payload?.error?.message ??
				`Image generation failed for ${entry.id}: ${responseText.slice(0, 200)}`
		);
	}

	if (!payload) {
		throw new Error(`Image generation failed for ${entry.id}: non-JSON response`);
	}

	return extractImageBufferFromResponse(payload);
}

function writeResizedPng(buffer, outputPath) {
	fs.mkdirSync(path.dirname(outputPath), { recursive: true });
	execFileSync("magick", ["png:-", "-resize", "512x512", "-strip", outputPath], {
		input: buffer
	});
}

async function generateEntries(ids) {
	const apiKey = process.env.CPASS_API_KEY;
	if (!apiKey) {
		throw new Error("CPASS_API_KEY is required");
	}

	const baseUrl = process.env.CPASS_BASE_URL ?? DEFAULT_BASE_URL;
	const model = process.env.CPASS_MODEL ?? DEFAULT_MODEL;
	const manifest = loadManifest();
	const entries = selectEntries(manifest, ids);

	for (const entry of entries) {
		const outputPath = path.join(process.cwd(), entry.output);
		const buffer = await requestImage({ baseUrl, apiKey, model, entry });
		writeResizedPng(buffer, outputPath);
		console.log(`Generated ${entry.id} -> ${entry.output}`);
	}
}

const currentPath = fileURLToPath(import.meta.url);
const executedPath = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (executedPath === currentPath) {
	generateEntries(process.argv.slice(2)).catch((error) => {
		console.error(error.message);
		process.exit(1);
	});
}
