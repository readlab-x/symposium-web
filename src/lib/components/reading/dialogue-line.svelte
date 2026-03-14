<script lang="ts">
	import { EyeOff, Languages } from "@lucide/svelte";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import AnnotatedText from "$lib/components/reading/annotated-text.svelte";
	import { getDisplayText, hasDisplayText, i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
	import type { Character, DialogLine, EntityReference } from "$lib/types";

	let {
		line,
		index = 0,
		speaker,
		isSelected,
		entities,
		onSelect
	}: {
		line: DialogLine;
		index?: number;
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
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				unknownSpeaker: "未知发言者",
				hideTranslation: "收起翻译",
				showTranslation: "查看翻译",
				noTranslation: "当前行暂无目标语言译文"
			},
			"en-US": {
				unknownSpeaker: "Unknown Speaker",
				hideTranslation: "Hide Translation",
				showTranslation: "Show Translation",
				noTranslation: "No translation available for this line in target language"
			}
		})
	);
	const translationControlLabel = $derived.by(() =>
		translationVisible ? copy.hideTranslation : copy.showTranslation
	);
	const translationControlTitle = $derived.by(() =>
		targetHasText ? translationControlLabel : copy.noTranslation
	);

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

	function entryDelayClass(position: number): string {
		if (position === 0) return "";
		if (position === 1) return "motion-delay-1";
		if (position === 2) return "motion-delay-2";
		if (position === 3) return "motion-delay-3";
		if (position === 4) return "motion-delay-4";
		return "";
	}
</script>

<article id={line.id}>
	<Card.Root
		class={`${
			index < 5 ? `motion-stage-soft ${entryDelayClass(index)}` : ""
		} transition-[transform,color,background-color,border-color,box-shadow] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] ${
			isSelected
				? "motion-settle border-primary/28 bg-secondary/62 shadow-[0_20px_40px_-32px_color-mix(in_oklab,var(--color-primary)_55%,transparent)]"
				: "border-border/55 bg-background/58 hover:-translate-y-0.5 hover:border-border/80 hover:bg-card/94"
		}`}
		onclick={selectLine}
		onkeydown={onCardKeydown}
		role="button"
		tabindex={0}
	>
		<Card.Header class="gap-3 pb-1">
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<Avatar.Root class="size-8 border border-border/65 bg-secondary/38">
						<Avatar.Fallback>{speaker?.avatar ?? "?"}</Avatar.Fallback>
					</Avatar.Root>
					<div>
						<Card.Title class="text-sm font-medium">{speaker?.name ?? copy.unknownSpeaker}</Card.Title>
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
		<Card.Content class="space-y-3 pt-0">
			<AnnotatedText text={primaryText} entities={entities} />

			{#if canToggleTranslation && targetHasText}
				<div
					class={`mt-2 grid transition-[grid-template-rows,opacity] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] motion-reduce:transition-none ${
						translationVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
					}`}
				>
					<p
						data-active={translationVisible}
						class={`motion-sheen min-h-0 overflow-hidden rounded-r-2xl border-l border-primary/35 bg-secondary/32 px-3 py-2 text-sm leading-7 text-muted-foreground transition-[transform,opacity] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] ${
							translationVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
						}`}
					>
						{targetText}
					</p>
				</div>
			{/if}

			{#if canToggleTranslation}
				<div class="mt-2 flex justify-end">
					<Button
						variant="ghost"
						size="icon-sm"
						class="motion-sheen size-9 rounded-full text-muted-foreground transition-[color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:text-foreground sm:size-8"
						onclick={toggleTranslation}
						disabled={!targetHasText}
						aria-label={translationControlLabel}
						aria-pressed={translationVisible}
						title={translationControlTitle}
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
