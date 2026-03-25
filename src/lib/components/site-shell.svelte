<script lang="ts">
	import type { Snippet } from "svelte";
	import { Github, Languages, Monitor, Moon, Sun } from "@lucide/svelte";
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import I18nSettingsDialog from "$lib/components/i18n/i18n-settings-dialog.svelte";
	import { toAssetPath, toBasePath } from "$lib/paths/runtime-paths.js";
	import {
		getSiteShellBackdropClass,
		getSiteShellHeaderClass,
		getSiteShellRootClass
	} from "$lib/components/site-shell-layout.js";
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
	const GITHUB_REPOSITORY_URL = "https://github.com/readlab-x/symposium-web";

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
	let { children, routeKey = "" }: { children?: Snippet; routeKey?: string } = $props();
	const currentPathname = $derived.by(() => $page.route.id ?? "/");
	const shellCopy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				siteTitle: "会饮研读台",
				languageSettings: "语言配置",
				themeLabel: "主题",
				githubLink: "查看 GitHub 仓库",
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
				githubLink: "View GitHub Repository",
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
		return currentPathname === href;
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

<div class={getSiteShellRootClass()}>
	<div
		aria-hidden="true"
		class={getSiteShellBackdropClass()}
	></div>
	<header class={getSiteShellHeaderClass()}>
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3">
			<a href={toBasePath("/")} class="motion-stage-hero flex min-w-0 items-center gap-3">
				<img
					src={toAssetPath("/branding/logo-mark.png")}
					alt=""
					class="size-11 shrink-0 rounded-full border border-border/60 bg-background/80 object-cover shadow-[0_14px_28px_-22px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
				/>
				<span class="min-w-0 space-y-1">
					<span class="block text-[0.68rem] tracking-[0.26em] text-muted-foreground uppercase">
						Symposium
					</span>
					<span class="block truncate text-base font-semibold tracking-[0.01em] text-foreground">
						{shellCopy.siteTitle}
					</span>
				</span>
			</a>
			<nav class="motion-stage flex flex-wrap items-center gap-4 motion-delay-1 sm:gap-5">
				{#each navItems as item (item.href)}
					<a
						href={toBasePath(item.href)}
						class={`group relative py-2 text-sm transition-[color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px ${
							isActive(item.href)
								? "text-foreground"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						{pickByLanguage($i18nPreferences.primaryLanguage, item.label)}
						<span
							class={`absolute inset-x-0 -bottom-[0.45rem] mx-auto h-px w-7 origin-center rounded-full bg-primary/75 transition-[transform,opacity,background-color] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] group-hover:opacity-65 group-hover:scale-x-75 ${
								isActive(item.href) ? "opacity-100 scale-x-100" : "opacity-0 scale-x-35"
							}`}
						></span>
					</a>
				{/each}
			</nav>
			<div class="motion-stage-soft flex items-center gap-2 motion-delay-2">
				<button
					type="button"
					class="motion-sheen inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/75 text-muted-foreground transition-[color,background-color,border-color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:border-border hover:bg-accent/45 hover:text-foreground sm:size-8"
					onclick={() => (isI18nDialogOpen = true)}
					aria-label={languageButtonLabel()}
					title={languageButtonLabel()}
					aria-haspopup="dialog"
				>
					<Languages class="size-4" />
				</button>
				<button
					type="button"
					class="motion-sheen inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/75 text-muted-foreground transition-[color,background-color,border-color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:border-border hover:bg-accent/45 hover:text-foreground sm:size-8"
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
				</button>
				<a
					href={GITHUB_REPOSITORY_URL}
					target="_blank"
					rel="noreferrer"
					class="motion-sheen inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/75 text-muted-foreground transition-[color,background-color,border-color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:border-border hover:bg-accent/45 hover:text-foreground sm:size-8"
					aria-label={shellCopy.githubLink}
					title={shellCopy.githubLink}
				>
					<Github class="size-4" />
				</a>
			</div>
		</div>
	</header>
	<main class="relative mx-auto max-w-7xl px-4 py-7 sm:py-8">
		{#key routeKey}
			<div class="motion-stage-soft motion-delay-2">
				{@render children?.()}
			</div>
		{/key}
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
