import { browser } from "$app/environment";
import { writable } from "svelte/store";
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
} from "$lib/data/content-i18n";
import {
	chapterEnglishBySource,
	characterEnglishNameById,
	dialogEnglishTextById
} from "$lib/data/reading-i18n";
import type {
	Annotation,
	Character,
	DialogLine,
	Place,
	RelationEdge,
	RelationNode,
	Theme
} from "$lib/types";

export type LanguageCode = "zh-CN" | "en-US";
export type LanguageMap<T> = Record<LanguageCode, T>;

export interface LanguageOption {
	code: LanguageCode;
	label: string;
}

export interface I18nPreferences {
	primaryLanguage: LanguageCode;
	translationEnabled: boolean;
	targetLanguage: LanguageCode;
}

const STORAGE_KEY = "huiyin:i18n-preferences";

export const languageOptions: LanguageOption[] = [
	{ code: "zh-CN", label: "中文" },
	{ code: "en-US", label: "English" }
];

const defaultPreferences: I18nPreferences = {
	primaryLanguage: "zh-CN",
	translationEnabled: false,
	targetLanguage: "en-US"
};

function normalizePreferences(
	value: Partial<I18nPreferences> | null | undefined
): I18nPreferences {
	if (!value) return defaultPreferences;

	const primaryLanguage =
		value.primaryLanguage && languageOptions.some((item) => item.code === value.primaryLanguage)
			? value.primaryLanguage
			: defaultPreferences.primaryLanguage;

	const targetLanguage =
		value.targetLanguage && languageOptions.some((item) => item.code === value.targetLanguage)
			? value.targetLanguage
			: defaultPreferences.targetLanguage;

	return {
		primaryLanguage,
		translationEnabled: Boolean(value.translationEnabled),
		targetLanguage
	};
}

function createI18nPreferencesStore() {
	const { subscribe, set, update } = writable<I18nPreferences>(defaultPreferences);

	function persist(nextValue: I18nPreferences) {
		if (!browser) return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValue));
	}

	function hydrate() {
		if (!browser) return;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as Partial<I18nPreferences>;
			set(normalizePreferences(parsed));
		} catch {
			set(defaultPreferences);
		}
	}

	return {
		subscribe,
		hydrate,
		setPrimaryLanguage(language: LanguageCode) {
			update((current) => {
				const next: I18nPreferences = {
					...current,
					primaryLanguage: language
				};
				persist(next);
				return next;
			});
		},
		setTranslationEnabled(enabled: boolean) {
			update((current) => {
				const next: I18nPreferences = {
					...current,
					translationEnabled: enabled
				};
				persist(next);
				return next;
			});
		},
		setTargetLanguage(language: LanguageCode) {
			update((current) => {
				const next: I18nPreferences = {
					...current,
					targetLanguage: language
				};
				persist(next);
				return next;
			});
		}
	};
}

export const i18nPreferences = createI18nPreferencesStore();

export function pickByLanguage<T>(language: LanguageCode, values: LanguageMap<T>): T {
	return values[language];
}

export function getDisplayText(line: DialogLine, language: LanguageCode): string {
	if (language === "zh-CN") return line.text;
	return line.translations?.[language] ?? dialogEnglishTextById[line.id] ?? line.text;
}

export function hasDisplayText(line: DialogLine, language: LanguageCode): boolean {
	if (language === "zh-CN") return true;
	const candidate = line.translations?.[language] ?? dialogEnglishTextById[line.id];
	return Boolean(candidate && candidate.trim().length > 0);
}

export function getDisplayChapter(line: DialogLine, language: LanguageCode): string {
	if (language === "zh-CN") return line.chapter;
	return line.chapterTranslations?.[language] ?? chapterEnglishBySource[line.chapter] ?? line.chapter;
}

export function getDisplayCharacterName(
	character: Pick<Character, "id" | "name" | "nameTranslations">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return character.name;
	return character.nameTranslations?.[language] ?? characterEnglishNameById[character.id] ?? character.name;
}

export function getDisplayTag(tag: string, language: LanguageCode): string {
	if (language === "zh-CN") return tag;
	return tagEnglishBySource[tag] ?? tag;
}

export function getDisplayAnnotationTitle(
	annotation: Pick<Annotation, "id" | "title">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return annotation.title;
	return annotationEnglishById[annotation.id]?.title ?? annotation.title;
}

export function getDisplayAnnotationContent(
	annotation: Pick<Annotation, "id" | "content">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return annotation.content;
	return annotationEnglishById[annotation.id]?.content ?? annotation.content;
}

export function getDisplayCharacterRole(
	character: Pick<Character, "id" | "role">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return character.role;
	return characterEnglishRoleById[character.id] ?? character.role;
}

export function getDisplayCharacterBio(
	character: Pick<Character, "id" | "bio">,
	language: LanguageCode
): string | undefined {
	if (language === "zh-CN") return character.bio;
	return characterEnglishBioById[character.id] ?? character.bio;
}

export function getDisplayCharacterSummary(
	character: Pick<Character, "id" | "summary">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return character.summary;
	return characterEnglishSummaryById[character.id] ?? character.summary;
}

export function getDisplayThemeName(theme: Pick<Theme, "id" | "name">, language: LanguageCode): string {
	if (language === "zh-CN") return theme.name;
	return themeEnglishNameById[theme.id] ?? theme.name;
}

export function getDisplayThemeSummary(
	theme: Pick<Theme, "id" | "summary">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return theme.summary;
	return themeEnglishSummaryById[theme.id] ?? theme.summary;
}

export function getDisplayPlaceName(place: Pick<Place, "id" | "name">, language: LanguageCode): string {
	if (language === "zh-CN") return place.name;
	return placeEnglishNameById[place.id] ?? place.name;
}

export function getDisplayPlaceSummary(
	place: Pick<Place, "id" | "summary">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return place.summary;
	return placeEnglishSummaryById[place.id] ?? place.summary;
}

export function getDisplayRelationNodeLabel(
	node: Pick<RelationNode, "id" | "label">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return node.label;
	return characterEnglishNameById[node.id] ?? placeEnglishNameById[node.id] ?? node.label;
}

export function getDisplayRelationNodeSummary(
	node: Pick<RelationNode, "id" | "summary">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return node.summary;
	return relationNodeEnglishSummaryById[node.id] ?? node.summary;
}

export function getDisplayRelationEdgeRelation(
	edge: Pick<RelationEdge, "id" | "relation">,
	language: LanguageCode
): string {
	if (language === "zh-CN") return edge.relation;
	return relationEdgeEnglishById[edge.id] ?? edge.relation;
}
