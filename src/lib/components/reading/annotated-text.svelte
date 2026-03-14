<script lang="ts">
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
			"zh-CN": { person: "人物", place: "地点", concept: "概念", related: "关联" },
			"en-US": { person: "Person", place: "Place", concept: "Concept", related: "Related" }
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
			return "rounded-[0.4rem] bg-amber-900/8 px-1 py-px font-medium text-foreground underline decoration-amber-800/45 decoration-[1px] underline-offset-[0.2em] transition-[background-color,text-decoration-color] hover:bg-amber-900/12 hover:decoration-amber-900/70 dark:bg-amber-200/8 dark:decoration-amber-200/45 dark:hover:bg-amber-200/14 dark:hover:decoration-amber-100/70";
		}
		if (type === "place") {
			return "rounded-[0.4rem] bg-emerald-900/8 px-1 py-px font-medium text-foreground underline decoration-emerald-800/45 decoration-[1px] underline-offset-[0.2em] transition-[background-color,text-decoration-color] hover:bg-emerald-900/12 hover:decoration-emerald-900/70 dark:bg-emerald-200/8 dark:decoration-emerald-200/45 dark:hover:bg-emerald-200/14 dark:hover:decoration-emerald-100/70";
		}
		return "rounded-[0.4rem] bg-sky-900/8 px-1 py-px font-medium text-foreground underline decoration-sky-800/45 decoration-[1px] underline-offset-[0.2em] transition-[background-color,text-decoration-color] hover:bg-sky-900/12 hover:decoration-sky-900/70 dark:bg-sky-200/8 dark:decoration-sky-200/45 dark:hover:bg-sky-200/14 dark:hover:decoration-sky-100/70";
	}

	function entityLabel(type: EntityType): string {
		if (type === "person") return copy.person;
		if (type === "place") return copy.place;
		return copy.concept;
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
					class="pointer-events-none absolute bottom-full left-1/2 z-10 hidden w-56 -translate-x-1/2 rounded-2xl border border-border/70 bg-popover px-3 py-2 text-xs leading-5 text-popover-foreground shadow-none group-hover:block group-focus-within:block"
				>
					<span class="font-semibold">{entityLabel(segment.entity.type)}</span>
					<br />
					{segment.entity.summary}
					{#if segment.entity.relatedChapter}
						<br />
						<span class="text-muted-foreground">{copy.related}: {segment.entity.relatedChapter}</span>
					{/if}
				</span>
			</span>
		{:else}
			{segment.text}
		{/if}
	{/each}
</p>
