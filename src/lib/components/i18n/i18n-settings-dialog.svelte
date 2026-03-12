<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
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

	const selectClass =
		"border-input bg-background ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 h-9 w-full rounded-md border px-3 py-1 text-sm outline-none";

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
		<Card.Root
			class="relative w-full max-w-md gap-0 py-0 shadow-xl"
			role="dialog"
			aria-modal="true"
			aria-label="语言与翻译配置"
			tabindex={-1}
		>
			<Card.Header class="border-b py-4">
				<Card.Title class="text-lg">语言与翻译配置</Card.Title>
				<Card.Description>{statusSummary}</Card.Description>
			</Card.Header>

			<Card.Content class="space-y-4 py-4">
				<section class="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
					<h3 class="text-sm font-medium">主语言</h3>
					<select
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

				<section class="space-y-3 rounded-lg border border-border bg-muted/20 p-3">
					<div class="flex items-center justify-between gap-3">
						<h3 class="text-sm font-medium">翻译</h3>
						<label class="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								class="size-4 accent-primary"
								checked={preferences.translationEnabled}
								onchange={(event) =>
									onTranslationToggle((event.currentTarget as HTMLInputElement).checked)}
							/>
							<span>开启</span>
						</label>
					</div>
					<select
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
					<p class="text-xs text-muted-foreground">
						翻译功能用于阅读辅助，默认隐藏，按行点击图标展开。
					</p>
				</section>
			</Card.Content>

			<Card.Footer class="justify-end border-t py-4">
				<Button variant="secondary" size="sm" onclick={close}>完成</Button>
			</Card.Footer>
		</Card.Root>
	</div>
{/if}
