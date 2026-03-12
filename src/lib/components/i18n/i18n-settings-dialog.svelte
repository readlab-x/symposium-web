<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import type { I18nPreferences, LanguageCode, LanguageOption } from "$lib/stores/i18n";

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

	const languageByCode = $derived.by(() =>
		Object.fromEntries(languages.map((language) => [language.code, language.label])) as Record<string, string>
	);

	const statusSummary = $derived.by(() => {
		const primary = languageByCode[preferences.primaryLanguage] ?? preferences.primaryLanguage;
		const target = languageByCode[preferences.targetLanguage] ?? preferences.targetLanguage;
		const translation = preferences.translationEnabled ? `开（目标：${target}）` : "关";
		return `主语言：${primary}｜翻译：${translation}`;
	});

	function close() {
		open = false;
	}

	function handleWindowKeydown(event: KeyboardEvent) {
		if (!open || event.key !== "Escape") return;
		close();
	}
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			type="button"
			class="absolute inset-0 bg-black/45"
			onclick={close}
			aria-label="关闭语言与翻译配置"
		></button>
		<div
			class="relative w-full max-w-md rounded-xl border bg-background p-5 shadow-xl"
			role="dialog"
			aria-modal="true"
			aria-label="语言与翻译配置"
			tabindex={-1}
		>
			<header class="mb-4 space-y-1">
				<h2 class="text-lg font-semibold">语言与翻译配置</h2>
				<p class="text-sm text-muted-foreground">{statusSummary}</p>
			</header>

			<div class="space-y-4">
				<section class="space-y-2 rounded-lg border border-border/70 bg-muted/20 p-3">
					<h3 class="text-sm font-medium">主语言</h3>
					<select
						class="h-9 w-full rounded-md border bg-background px-3 text-sm"
						value={preferences.primaryLanguage}
						onchange={(event) =>
							onPrimaryLanguageChange((event.currentTarget as HTMLSelectElement).value as LanguageCode)}
					>
						{#each languages as language (language.code)}
							<option value={language.code}>{language.label}</option>
						{/each}
					</select>
				</section>

				<section class="space-y-3 rounded-lg border border-border/70 bg-muted/20 p-3">
					<div class="flex items-center justify-between gap-3">
						<h3 class="text-sm font-medium">翻译</h3>
						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								checked={preferences.translationEnabled}
								onchange={(event) =>
									onTranslationToggle((event.currentTarget as HTMLInputElement).checked)}
							/>
							<span>开启</span>
						</label>
					</div>
					<select
						class="h-9 w-full rounded-md border bg-background px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!preferences.translationEnabled}
						value={preferences.targetLanguage}
						onchange={(event) =>
							onTargetLanguageChange((event.currentTarget as HTMLSelectElement).value as LanguageCode)}
					>
						{#each languages as language (language.code)}
							<option value={language.code}>{language.label}</option>
						{/each}
					</select>
					<p class="text-xs text-muted-foreground">
						翻译功能用于阅读辅助，默认隐藏，按行点击图标展开。
					</p>
				</section>
			</div>

			<footer class="mt-5 flex justify-end">
				<Button variant="secondary" size="sm" onclick={close}>完成</Button>
			</footer>
		</div>
	</div>
{/if}
