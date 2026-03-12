<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import type { Character } from "$lib/types";

	let {
		speakers,
		activeSpeakerIds,
		onToggleSpeaker,
		onSelectAll
	}: {
		speakers: Character[];
		activeSpeakerIds: string[];
		onToggleSpeaker?: (id: string) => void;
		onSelectAll?: () => void;
	} = $props();
</script>

<section class="space-y-3">
	<div class="flex items-center justify-between">
		<h2 class="text-sm font-medium text-muted-foreground">按人物筛选</h2>
		<Button size="sm" variant="outline" onclick={() => onSelectAll?.()}>全部</Button>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each speakers as speaker (speaker.id)}
			<Button
				size="sm"
				variant={activeSpeakerIds.includes(speaker.id) ? "default" : "outline"}
				onclick={() => onToggleSpeaker?.(speaker.id)}
			>
				{speaker.name}
			</Button>
		{/each}
	</div>
</section>
