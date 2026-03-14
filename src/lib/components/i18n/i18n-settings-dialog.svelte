<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import {
		pickByLanguage,
		type I18nPreferences,
		type LanguageCode,
		type LanguageOption
	} from "$lib/stores/i18n";

	let {
		open = $bindable(false),
		preferences,
		languages,
		onPrimaryLanguageChange,
		onTranslationToggle,
		onTargetLanguageChange
	}: {
		open: boolean;
		preferences: I18nPreferences;
		languages: LanguageOption[];
		onPrimaryLanguageChange: (language: LanguageCode) => void;
		onTranslationToggle: (enabled: boolean) => void;
		onTargetLanguageChange: (language: LanguageCode) => void;
	} = $props();

	const selectClass =
		"border-input bg-background/72 ring-offset-background focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[2px] disabled:cursor-not-allowed disabled:opacity-50 h-9 w-full rounded-lg border px-3 py-1 text-sm outline-none transition-[background-color,border-color,box-shadow]";

	const languageByCode = $derived.by(() =>
		Object.fromEntries(languages.map((language) => [language.code, language.label])) as Record<string, string>
	);
	const copy = $derived.by(() =>
		pickByLanguage(preferences.primaryLanguage, {
			"zh-CN": {
				dialogTitle: "语言与翻译配置",
				closeDialog: "关闭语言与翻译配置",
				primaryLanguage: "主语言",
				translation: "翻译",
				enable: "开启",
				done: "完成",
				statusPrefix: "主语言",
				translationOn: "开",
				translationOff: "关",
				targetPrefix: "目标",
				translationHint: "翻译功能用于阅读辅助，默认隐藏，按行点击图标展开。"
			},
			"en-US": {
				dialogTitle: "Language & Translation Settings",
				closeDialog: "Close language and translation settings",
				primaryLanguage: "Primary Language",
				translation: "Translation",
				enable: "Enable",
				done: "Done",
				statusPrefix: "Primary",
				translationOn: "On",
				translationOff: "Off",
				targetPrefix: "Target",
				translationHint:
					"Translation is optional for reading support and stays hidden until you expand it per line."
			}
		})
	);

	const statusSummary = $derived.by(() => {
		const primary = languageByCode[preferences.primaryLanguage] ?? preferences.primaryLanguage;
		const target = languageByCode[preferences.targetLanguage] ?? preferences.targetLanguage;
		const translation = preferences.translationEnabled
			? `${copy.translationOn} (${copy.targetPrefix}: ${target})`
			: copy.translationOff;
		return `${copy.statusPrefix}: ${primary} | ${copy.translation}: ${translation}`;
	});
	let primaryLanguageSelect = $state<HTMLSelectElement | null>(null);

	function close() {
		open = false;
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (!open || event.key !== "Escape") return;
		close();
	}

	$effect(() => {
		if (!open) return;
		queueMicrotask(() => primaryLanguageSelect?.focus());
	});
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			type="button"
			class="absolute inset-0 bg-stone-950/38 backdrop-blur-[1.5px]"
			onclick={close}
			aria-label={copy.closeDialog}
		></button>
		<Card.Root
			class="relative w-full max-w-md gap-0 border-border/75 bg-card/96 py-0 shadow-none"
			role="dialog"
			aria-modal="true"
			aria-label={copy.dialogTitle}
			aria-describedby="i18n-settings-summary"
			tabindex={-1}
		>
			<Card.Header class="border-b border-border/65 py-4">
				<Card.Title class="text-lg">{copy.dialogTitle}</Card.Title>
				<Card.Description id="i18n-settings-summary">{statusSummary}</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-4 py-4">
				<section class="space-y-2 rounded-2xl border border-border/60 bg-secondary/40 p-3.5">
					<label for="primary-language-select" class="block text-sm font-medium">{copy.primaryLanguage}</label>
					<select
						id="primary-language-select"
						bind:this={primaryLanguageSelect}
						class={selectClass}
						value={preferences.primaryLanguage}
						onchange={(event) =>
							onPrimaryLanguageChange((event.currentTarget as HTMLSelectElement).value as LanguageCode)}
					>
						{#each languages as language (language.code)}
							<option value={language.code}>{language.label}</option>
						{/each}
					</select>
				</section>

				<section class="space-y-3 rounded-2xl border border-border/60 bg-secondary/40 p-3.5">
					<div class="flex items-center justify-between gap-3">
						<h3 id="translation-settings-heading" class="text-sm font-medium">{copy.translation}</h3>
						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								class="size-4 accent-primary"
								checked={preferences.translationEnabled}
								onchange={(event) =>
									onTranslationToggle((event.currentTarget as HTMLInputElement).checked)}
							/>
							<span>{copy.enable}</span>
						</label>
					</div>
					<select
						aria-labelledby="translation-settings-heading"
						class={selectClass}
						disabled={!preferences.translationEnabled}
						value={preferences.targetLanguage}
						onchange={(event) =>
							onTargetLanguageChange((event.currentTarget as HTMLSelectElement).value as LanguageCode)}
					>
						{#each languages as language (language.code)}
							<option value={language.code}>{language.label}</option>
						{/each}
					</select>
					<p class="text-xs text-muted-foreground">{copy.translationHint}</p>
				</section>
			</Card.Content>

			<Card.Footer class="justify-end border-t border-border/65 py-4">
				<Button variant="outline" size="sm" onclick={close}>{copy.done}</Button>
			</Card.Footer>
		</Card.Root>
	</div>
{/if}
