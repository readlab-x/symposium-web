<script lang="ts">
	import { EyeOff, FileText, Languages } from "@lucide/svelte";
	import AnnotationPanel from "$lib/components/reading/annotation-panel.svelte";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import AnnotatedText from "$lib/components/reading/annotated-text.svelte";
	import { getDialogueLineRootClass } from "$lib/components/reading/dialogue-line-state.js";
	import { getDisplayText, hasDisplayText, i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
	import type { Annotation, Character, DialogLine, EntityReference } from "$lib/types";

	let {
		line,
		index = 0,
		speaker,
		isSelected,
		annotations,
		entities,
		onSelect
	}: {
		line: DialogLine;
		index?: number;
		speaker?: Character;
		isSelected: boolean;
		annotations: Annotation[];
		entities: EntityReference[];
		onSelect?: (lineId: string) => void;
	} = $props();

	let translationVisible = $state(false);
	let annotationVisible = $state(false);

	const primaryText = $derived.by(() => getDisplayText(line, $i18nPreferences.primaryLanguage));
	const canToggleTranslation = $derived.by(
		() =>
			$i18nPreferences.translationEnabled &&
			$i18nPreferences.targetLanguage !== $i18nPreferences.primaryLanguage
	);
	const targetHasText = $derived.by(() => hasDisplayText(line, $i18nPreferences.targetLanguage));
	const targetText = $derived.by(() => getDisplayText(line, $i18nPreferences.targetLanguage));
	const hasAnnotations = $derived.by(() => annotations.length > 0);
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				unknownSpeaker: "未知发言者",
				hideTranslation: "收起翻译",
				showTranslation: "查看翻译",
				noTranslation: "当前行暂无目标语言译文",
				hideAnnotation: "收起注解",
				showAnnotation: "查看注解",
				noAnnotation: "当前行暂无注解"
			},
			"en-US": {
				unknownSpeaker: "Unknown Speaker",
				hideTranslation: "Hide Translation",
				showTranslation: "Show Translation",
				noTranslation: "No translation available for this line in target language",
				hideAnnotation: "Hide Annotation",
				showAnnotation: "Show Annotation",
				noAnnotation: "No annotation available for this line"
			}
		})
	);
	const translationControlLabel = $derived.by(() =>
		translationVisible ? copy.hideTranslation : copy.showTranslation
	);
	const translationControlTitle = $derived.by(() =>
		targetHasText ? translationControlLabel : copy.noTranslation
	);
	const annotationControlLabel = $derived.by(() =>
		annotationVisible ? copy.hideAnnotation : copy.showAnnotation
	);
	const annotationControlTitle = $derived.by(() =>
		hasAnnotations ? annotationControlLabel : copy.noAnnotation
	);

	$effect(() => {
		if (!canToggleTranslation) {
			translationVisible = false;
		}
	});

	$effect(() => {
		if (!isSelected || !hasAnnotations) {
			annotationVisible = false;
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

	function toggleAnnotation(event: MouseEvent) {
		event.stopPropagation();
		onSelect?.(line.id);
		if (!hasAnnotations) return;
		annotationVisible = !annotationVisible;
	}
</script>

<article id={line.id}>
	<Card.Root
		class={getDialogueLineRootClass({ index, isSelected })}
		onclick={selectLine}
		onkeydown={onCardKeydown}
		role="button"
		tabindex={0}
		aria-pressed={isSelected}
		data-selected={isSelected}
	>
		<Card.Header class="gap-3 pb-1">
			<div class="flex items-center justify-between gap-4">
				<div class="flex items-center gap-3">
					<Avatar.Root class="size-8 border border-border/65 bg-secondary/38">
						{#if speaker?.avatarImage}
							<Avatar.Image
								src={speaker.avatarImage}
								alt={speaker.name ?? copy.unknownSpeaker}
								class="object-cover"
							/>
						{/if}
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

			{#if canToggleTranslation || hasAnnotations}
				<div class="mt-2 flex justify-end gap-2">
					{#if hasAnnotations}
						<Button
							variant="ghost"
							size="icon-sm"
							class="motion-sheen size-9 rounded-full text-muted-foreground transition-[color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:text-foreground sm:size-8 lg:hidden"
							onclick={toggleAnnotation}
							aria-label={annotationControlLabel}
							aria-pressed={annotationVisible}
							title={annotationControlTitle}
						>
							<FileText class="size-4" />
						</Button>
					{/if}
					{#if canToggleTranslation}
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
					{/if}
				</div>
			{/if}

			{#if hasAnnotations && annotationVisible}
				<div class="mt-3 border-t border-border/50 pt-3 lg:hidden">
					<AnnotationPanel compact line={line} {speaker} {annotations} />
				</div>
			{/if}
		</Card.Content>
	</Card.Root>
</article>
