import { writable } from "svelte/store";

export const selectedSpeakerIds = writable<string[]>([]);
export const selectedLineId = writable<string | null>(null);
export const readingQuery = writable("");
