import { browser } from "$app/environment";
import { writable } from "svelte/store";
import type { DialogLine } from "$lib/types";

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
	return line.translations?.[language] ?? line.text;
}

export function hasDisplayText(line: DialogLine, language: LanguageCode): boolean {
	if (language === "zh-CN") return true;
	const candidate = line.translations?.[language];
	return Boolean(candidate && candidate.trim().length > 0);
}
