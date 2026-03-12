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

	function close() {
		open = false;
	}

</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
		<div class="w-full max-w-md rounded-lg border bg-background p-5 shadow-xl">
			<header class="mb-4 space-y-1">
				<h2 class="text-lg font-semibold">语言与翻译设置</h2>
				<p class="text-sm text-muted-foreground">选择主语言、是否显示翻译，以及翻译目标语言。</p>
			</header>

			<div class="space-y-4">
				<label class="block space-y-1">
					<span class="text-sm font-medium">主语言</span>
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
				</label>

				<label class="flex items-center gap-2 text-sm">
					<input
						type="checkbox"
						checked={preferences.translationEnabled}
						onchange={(event) => onTranslationToggle((event.currentTarget as HTMLInputElement).checked)}
					/>
					<span>开启翻译</span>
				</label>

				<label class="block space-y-1">
					<span class="text-sm font-medium">翻译目标语言</span>
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
				</label>
			</div>

			<footer class="mt-5 flex justify-end">
				<Button variant="secondary" size="sm" onclick={close}>完成</Button>
			</footer>
		</div>
	</div>
{/if}
