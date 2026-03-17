import assert from "node:assert/strict";
import { resolveSpeakerIdsFromQuery } from "../src/lib/reading/speaker-query.js";

const validSpeakerIds = ["phaedrus", "aristophanes", "diotima", "socrates"];
const defaultSpeakerIds = ["phaedrus", "aristophanes", "diotima", "socrates"];

assert.deepEqual(
	resolveSpeakerIdsFromQuery("phaedrus", validSpeakerIds, defaultSpeakerIds),
	["phaedrus"],
	"should keep a single valid speaker id"
);

assert.deepEqual(
	resolveSpeakerIdsFromQuery("socrates,diotima", validSpeakerIds, defaultSpeakerIds),
	["socrates", "diotima"],
	"should preserve multiple valid speaker ids from the query"
);

assert.deepEqual(
	resolveSpeakerIdsFromQuery("phaedrus,invalid,diotima,phaedrus", validSpeakerIds, defaultSpeakerIds),
	["phaedrus", "diotima"],
	"should discard invalid and duplicate speaker ids"
);

assert.deepEqual(
	resolveSpeakerIdsFromQuery("invalid", validSpeakerIds, defaultSpeakerIds),
	defaultSpeakerIds,
	"should fall back to defaults when the query has no valid speaker ids"
);

assert.deepEqual(
	resolveSpeakerIdsFromQuery("", validSpeakerIds, defaultSpeakerIds),
	defaultSpeakerIds,
	"should fall back to defaults when the query is empty"
);

assert.deepEqual(
	resolveSpeakerIdsFromQuery(null, validSpeakerIds, defaultSpeakerIds),
	defaultSpeakerIds,
	"should fall back to defaults when the query is missing"
);

console.log("reading-speaker-query test passed");
