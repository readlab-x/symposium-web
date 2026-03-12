<script lang="ts">
	import DialogueLine from "$lib/components/reading/dialogue-line.svelte";
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
</script>

<div class="space-y-3">
	{#if lines.length === 0}
		<div class="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
			没有匹配的发言，尝试清空筛选或修改关键字。
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
