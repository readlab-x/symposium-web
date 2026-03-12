<script lang="ts">
	import { EyeOff, Languages } from "@lucide/svelte";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import AnnotatedText from "$lib/components/reading/annotated-text.svelte";
	import { getDisplayText, hasDisplayText, i18nPreferences } from "$lib/stores/i18n";
	import type { Character, DialogLine, EntityReference } from "$lib/types";

	let {
		line,
		speaker,
		isSelected,
		entities,
		onSelect
	}: {
		line: DialogLine;
		speaker?: Character;
		isSelected: boolean;
		entities: EntityReference[];
		onSelect?: (lineId: string) => void;
	} = $props();

	let translationVisible = $state(false);

	const primaryText = $derived.by(() => getDisplayText(line, $i18nPreferences.primaryLanguage));
	const canToggleTranslation = $derived.by(
		() =>
			$i18nPreferences.translationEnabled &&
			$i18nPreferences.targetLanguage !== $i18nPreferences.primaryLanguage
	);
	const targetHasText = $derived.by(() => hasDisplayText(line, $i18nPreferences.targetLanguage));
	const targetText = $derived.by(() => getDisplayText(line, $i18nPreferences.targetLanguage));

	$effect(() => {
		if (!canToggleTranslation) {
			translationVisible = false;
		}
	});

	function selectLine() {
		onSelect?.(line.id);
	}

	function onCardKeydown(event: KeyboardEvent) {
		if (event.key !== "Enter" && event.key !== " ") return;
		event.preventDefault();
		selectLine();
	}

	function toggleTranslation(event: MouseEvent) {
		event.stopPropagation();
		translationVisible = !translationVisible;
	}
</script>

<article id={line.id}>
	<Card.Root
		class={`transition-colors ${
			isSelected
				? "border-primary/50 bg-primary/5 shadow-sm"
				: "border-border/50 bg-background/55 hover:border-border hover:bg-background"
		}`}
		onclick={selectLine}
		onkeydown={onCardKeydown}
		role="button"
		tabindex={0}
	>
		<Card.Header class="gap-3 pb-2">
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<Avatar.Root class="size-8 border">
						<Avatar.Fallback>{speaker?.avatar ?? "?"}</Avatar.Fallback>
					</Avatar.Root>
					<div>
						<Card.Title class="text-sm">{speaker?.name ?? "未知发言者"}</Card.Title>
						<Card.Description>{line.chapter}</Card.Description>
					</div>
				</div>
				<div class="flex flex-wrap justify-end gap-1">
					{#each line.tags as tag (tag)}
						<Badge variant="outline">{tag}</Badge>
					{/each}
				</div>
			</div>
		</Card.Header>
		<Card.Content class="pt-0">
			<AnnotatedText text={primaryText} entities={entities} />

			{#if canToggleTranslation && translationVisible && targetHasText}
				<p class="mt-2 border-l-2 border-primary/35 pl-3 text-sm leading-7 text-muted-foreground">
					{targetText}
				</p>
			{/if}

			{#if canToggleTranslation}
				<div class="mt-2 flex justify-end">
					<Button
						variant="ghost"
						size="icon-sm"
						onclick={toggleTranslation}
						disabled={!targetHasText}
						class="text-muted-foreground hover:text-foreground"
						aria-label={translationVisible ? "收起翻译" : "查看翻译"}
						title={translationVisible ? "收起翻译" : "查看翻译"}
					>
						{#if translationVisible}
							<EyeOff class="size-4" />
						{:else}
							<Languages class="size-4" />
						{/if}
					</Button>
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</article>
