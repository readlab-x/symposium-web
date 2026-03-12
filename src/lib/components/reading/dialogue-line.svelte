<script lang="ts">
	import * as Avatar from "$lib/components/ui/avatar/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import AnnotatedText from "$lib/components/reading/annotated-text.svelte";
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
</script>

<article id={line.id}>
	<button class="w-full text-left" onclick={() => onSelect?.(line.id)}>
		<Card.Root class={`transition ${isSelected ? "border-primary ring-2 ring-primary/30" : "hover:border-primary/50"}`}>
			<Card.Header class="gap-3">
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
							<Badge variant="secondary">{tag}</Badge>
						{/each}
					</div>
				</div>
			</Card.Header>
			<Card.Content>
				<AnnotatedText text={line.text} entities={entities} />
			</Card.Content>
		</Card.Root>
	</button>
</article>
