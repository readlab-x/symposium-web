<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";
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

	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": { title: "按人物筛选", selectAll: "全选" },
			"en-US": { title: "Filter by Speaker", selectAll: "Select All" }
		})
	);
</script>

<section class="space-y-2.5">
	<div class="flex items-center justify-between">
		<h2 class="text-[0.72rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
			{copy.title}
		</h2>
		<Button size="sm" variant="ghost" onclick={() => onSelectAll?.()}>{copy.selectAll}</Button>
	</div>
	<div class="flex flex-wrap gap-2">
		{#each speakers as speaker (speaker.id)}
			<Button
				size="sm"
				variant={activeSpeakerIds.includes(speaker.id) ? "secondary" : "outline"}
				class="rounded-full"
				onclick={() => onToggleSpeaker?.(speaker.id)}
			>
				{speaker.name}
			</Button>
		{/each}
	</div>
</section>
