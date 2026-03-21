<script lang="ts">
	import { toAssetPath } from "$lib/paths/runtime-paths.js";
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
	import type { EntityReference, EntityType } from "$lib/types";

	interface Segment {
		text: string;
		entity?: EntityReference;
	}

	interface Match {
		start: number;
		end: number;
		entity: EntityReference;
	}

	let {
		text,
		entities
	}: {
		text: string;
		entities: EntityReference[];
	} = $props();

	const segments = $derived.by(() => splitTextWithEntities(text, entities));
	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": { person: "人物", place: "地点", concept: "概念" },
			"en-US": { person: "Person", place: "Place", concept: "Concept" }
		})
	);

	function splitTextWithEntities(source: string, refs: EntityReference[]): Segment[] {
		const matches: Match[] = [];
		for (const entity of refs) {
			if (!entity.name.trim()) continue;
			let index = source.indexOf(entity.name);
			while (index !== -1) {
				matches.push({
					start: index,
					end: index + entity.name.length,
					entity
				});
				index = source.indexOf(entity.name, index + entity.name.length);
			}
		}

		matches.sort((a, b) => {
			if (a.start !== b.start) return a.start - b.start;
			return b.end - a.end;
		});

		const accepted: Match[] = [];
		let cursor = -1;
		for (const match of matches) {
			if (match.start >= cursor) {
				accepted.push(match);
				cursor = match.end;
			}
		}

		const chunks: Segment[] = [];
		let start = 0;
		for (const match of accepted) {
			if (match.start > start) {
				chunks.push({ text: source.slice(start, match.start) });
			}
			chunks.push({ text: source.slice(match.start, match.end), entity: match.entity });
			start = match.end;
		}
		if (start < source.length) {
			chunks.push({ text: source.slice(start) });
		}

		return chunks;
	}

	function entityClass(type: EntityType): string {
		if (type === "person") {
			return "motion-sheen font-medium text-foreground underline decoration-amber-800/45 decoration-[1px] underline-offset-[0.2em] transition-[text-decoration-color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:decoration-amber-900/70 dark:decoration-amber-200/45 dark:hover:decoration-amber-100/70";
		}
		if (type === "place") {
			return "motion-sheen font-medium text-foreground underline decoration-emerald-800/45 decoration-[1px] underline-offset-[0.2em] transition-[text-decoration-color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:decoration-emerald-900/70 dark:decoration-emerald-200/45 dark:hover:decoration-emerald-100/70";
		}
		return "motion-sheen font-medium text-foreground underline decoration-sky-800/45 decoration-[1px] underline-offset-[0.2em] transition-[text-decoration-color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:decoration-sky-900/70 dark:decoration-sky-200/45 dark:hover:decoration-sky-100/70";
	}

	function entityLabel(type: EntityType): string {
		if (type === "person") return copy.person;
		if (type === "place") return copy.place;
		return copy.concept;
	}

	function shouldShowAvatar(entity: EntityReference): boolean {
		return entity.type === "person" && (Boolean(entity.avatarImage) || Boolean(entity.avatarFallback));
	}
 </script>

<p class="text-sm leading-7 text-foreground">
	{#each segments as segment, index (`${index}-${segment.text}`)}
		{#if segment.entity}
			<span class="group relative inline-flex">
				<button
					type="button"
					class={`cursor-help ${entityClass(segment.entity.type)}`}
					aria-label={`${segment.text} (${entityLabel(segment.entity.type)})`}
				>
					{segment.text}
				</button>
				<span
					class="pointer-events-none invisible absolute bottom-full left-1/2 z-10 w-56 -translate-x-1/2 translate-y-1 select-text rounded-2xl border border-border/70 bg-popover px-3 py-2 text-xs leading-5 text-popover-foreground opacity-0 shadow-none transition-[opacity,transform] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)] group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
				>
					{#if shouldShowAvatar(segment.entity)}
						<span class="mb-2 flex items-center gap-2">
							<Avatar.Root class="size-9 shrink-0 border border-border/60 bg-secondary/28">
								{#if segment.entity.avatarImage}
									<Avatar.Image
										src={toAssetPath(segment.entity.avatarImage)}
										alt={segment.entity.name}
										class="object-cover"
									/>
								{/if}
								<Avatar.Fallback class="text-[0.7rem] font-medium">
									{segment.entity.avatarFallback ?? segment.entity.name.slice(0, 1)}
								</Avatar.Fallback>
							</Avatar.Root>
							<span class="min-w-0 font-semibold">{entityLabel(segment.entity.type)}</span>
						</span>
					{:else}
						<span class="font-semibold">{entityLabel(segment.entity.type)}</span>
						<br />
					{/if}
					{segment.entity.summary}
				</span>
			</span>
		{:else}
			{segment.text}
		{/if}
	{/each}
</p>
