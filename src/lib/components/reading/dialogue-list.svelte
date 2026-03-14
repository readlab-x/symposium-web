<script lang="ts">
	import DialogueLine from "$lib/components/reading/dialogue-line.svelte";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
	import type { Character, DialogLine, EntityReference } from "$lib/types";

	let {
		lines,
		speakersById,
		selectedLineId,
		entities,
		onSelectLine
	}: {
		lines: DialogLine[];
		speakersById: Record<string, Character>;
		selectedLineId: string | null;
		entities: EntityReference[];
		onSelectLine?: (lineId: string) => void;
	} = $props();

	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": { empty: "没有匹配的发言，尝试调整筛选条件或修改搜索关键词。" },
			"en-US": {
				empty: "No matching lines. Try adjusting filters or search keywords."
			}
		})
	);
</script>

<div class="space-y-2.5">
	{#if lines.length === 0}
		<div class="rounded-[1.25rem] border border-dashed border-border/70 bg-secondary/30 p-6 text-sm text-muted-foreground">
			{copy.empty}
		</div>
	{:else}
		{#each lines as line (line.id)}
			<DialogueLine
				{line}
				speaker={speakersById[line.speakerId]}
				isSelected={selectedLineId === line.id}
				{entities}
				onSelect={onSelectLine}
			/>
		{/each}
	{/if}
</div>
