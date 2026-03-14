<script lang="ts">
	import { Languages, Monitor, Moon, Sun } from "@lucide/svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import I18nSettingsDialog from "$lib/components/i18n/i18n-settings-dialog.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import {
		i18nPreferences,
		languageOptions,
		pickByLanguage,
		type LanguageCode,
		type LanguageMap
	} from "$lib/stores/i18n";

	type NavItem = {
		href: string;
		label: LanguageMap<string>;
	};

	type ThemeMode = "light" | "dark" | "system";

	const THEME_STORAGE_KEY = "huiyin:theme-mode";
	const themeCycle: ThemeMode[] = ["system", "light", "dark"];

	const navItems: NavItem[] = [
		{ href: "/reading", label: { "zh-CN": "阅读", "en-US": "Reading" } },
		{ href: "/characters", label: { "zh-CN": "人物", "en-US": "Characters" } },
		{ href: "/themes", label: { "zh-CN": "主题", "en-US": "Themes" } },
		{ href: "/relations", label: { "zh-CN": "关系图", "en-US": "Relations" } },
		{ href: "/search", label: { "zh-CN": "搜索", "en-US": "Search" } }
	];

	let darkMode = $state(false);
	let themeMode = $state<ThemeMode>("system");
	let isI18nDialogOpen = $state(false);
	let { children } = $props();
	const shellCopy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				siteTitle: "会饮研读台",
				languageSettings: "语言配置",
				themeLabel: "主题",
				light: "浅色",
				dark: "深色",
				system: "跟随系统",
				translationOff: "翻译关闭",
				translationTo: "翻译到"
			},
			"en-US": {
				siteTitle: "Symposium Reading Desk",
				languageSettings: "Language Settings",
				themeLabel: "Theme",
				light: "Light",
				dark: "Dark",
				system: "System",
				translationOff: "Translation Off",
				translationTo: "Translate To"
			}
		})
	);

	onMount(() => {
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const initialMode = getStoredThemeMode();
		setThemeMode(initialMode);

		const onSystemThemeChanged = () => {
			if (themeMode === "system") {
				applyTheme("system");
			}
		};

		mediaQuery.addEventListener("change", onSystemThemeChanged);
		i18nPreferences.hydrate();

		return () => {
			mediaQuery.removeEventListener("change", onSystemThemeChanged);
		};
	});

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}

	function applyTheme(mode: ThemeMode) {
		if (!browser) return;
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const shouldUseDark = mode === "dark" || (mode === "system" && prefersDark);
		darkMode = shouldUseDark;
		document.documentElement.classList.toggle("dark", shouldUseDark);
	}

	function getStoredThemeMode(): ThemeMode {
		if (!browser) return "system";
		const value = localStorage.getItem(THEME_STORAGE_KEY);
		if (value === "light" || value === "dark" || value === "system") {
			return value;
		}
		return "system";
	}

	function setThemeMode(mode: ThemeMode) {
		themeMode = mode;
		if (browser) {
			localStorage.setItem(THEME_STORAGE_KEY, mode);
		}
		applyTheme(mode);
	}

	function cycleThemeMode() {
		const currentIndex = themeCycle.indexOf(themeMode);
		const nextIndex = (currentIndex + 1) % themeCycle.length;
		setThemeMode(themeCycle[nextIndex]);
	}

	function themeButtonLabel(): string {
		if (themeMode === "light") return `${shellCopy.themeLabel}: ${shellCopy.light}`;
		if (themeMode === "dark") return `${shellCopy.themeLabel}: ${shellCopy.dark}`;
		const currentTheme = darkMode ? shellCopy.dark : shellCopy.light;
		return `${shellCopy.themeLabel}: ${shellCopy.system} (${currentTheme})`;
	}

	function languageButtonLabel(): string {
		const map = new Map(languageOptions.map((option) => [option.code, option.label]));
		const primary = map.get($i18nPreferences.primaryLanguage) ?? $i18nPreferences.primaryLanguage;
		if (!$i18nPreferences.translationEnabled) {
			return `${shellCopy.languageSettings}: ${primary}, ${shellCopy.translationOff}`;
		}
		const target = map.get($i18nPreferences.targetLanguage) ?? $i18nPreferences.targetLanguage;
		return `${shellCopy.languageSettings}: ${primary}, ${shellCopy.translationTo} ${target}`;
	}

	function setPrimaryLanguage(language: LanguageCode) {
		i18nPreferences.setPrimaryLanguage(language);
	}

	function setTranslationEnabled(enabled: boolean) {
		i18nPreferences.setTranslationEnabled(enabled);
	}

	function setTargetLanguage(language: LanguageCode) {
		i18nPreferences.setTargetLanguage(language);
	}
</script>

<div
	class="relative min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-950 dark:to-black"
>
	<header class="sticky top-0 z-40 border-b bg-white/70 backdrop-blur dark:bg-stone-950/70">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
			<a href="/" class="text-lg font-semibold tracking-tight">{shellCopy.siteTitle}</a>
			<nav class="flex flex-wrap items-center gap-2">
				{#each navItems as item (item.href)}
					<Button
						href={item.href}
						variant={isActive(item.href) ? "secondary" : "ghost"}
						size="sm"
						class="h-11 px-4 sm:h-8 sm:px-3"
					>
						{pickByLanguage($i18nPreferences.primaryLanguage, item.label)}
					</Button>
				{/each}
			</nav>
			<div class="flex items-center gap-2">
				<Button
					variant="outline"
					size="icon-sm"
					class="size-11 sm:size-8"
					onclick={() => (isI18nDialogOpen = true)}
					aria-label={languageButtonLabel()}
					title={languageButtonLabel()}
					aria-haspopup="dialog"
				>
					<Languages class="size-4" />
				</Button>
				<Button
					variant="outline"
					size="icon-sm"
					class="size-11 sm:size-8"
					onclick={cycleThemeMode}
					aria-label={themeButtonLabel()}
					title={themeButtonLabel()}
				>
					{#if themeMode === "system"}
						<Monitor class="size-4" />
					{:else if themeMode === "light"}
						<Sun class="size-4" />
					{:else}
						<Moon class="size-4" />
					{/if}
				</Button>
			</div>
		</div>
	</header>
	<main class="mx-auto max-w-7xl px-4 py-6">
		{@render children?.()}
	</main>
</div>

<I18nSettingsDialog
	bind:open={isI18nDialogOpen}
	preferences={$i18nPreferences}
	languages={languageOptions}
	onPrimaryLanguageChange={setPrimaryLanguage}
	onTranslationToggle={setTranslationEnabled}
	onTargetLanguageChange={setTargetLanguage}
/>
