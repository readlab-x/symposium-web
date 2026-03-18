<script lang="ts">
	import { Check, ChevronDown } from "@lucide/svelte";
	import { getReadingSceneToolbarSummary } from "$lib/components/reading/reading-toolbar-layout.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";

	let {
		scenes,
		activeSceneIds,
		onToggleScene,
		onSelectAll
	}: {
		scenes: string[];
		activeSceneIds: string[];
		onToggleScene?: (id: string) => void;
		onSelectAll?: () => void;
	} = $props();

	let isOpen = $state(false);
	let root = $state<HTMLDetailsElement | null>(null);

	const copy = $derived.by(() =>
		pickByLanguage($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				title: "按场景筛选",
				selectAll: "全选",
				triggerLabel: "筛选场景"
			},
			"en-US": {
				title: "Filter by Scene",
				selectAll: "Select All",
				triggerLabel: "Filter Scenes"
			}
		})
	);

	const triggerSummary = $derived.by(() =>
		getReadingSceneToolbarSummary({
			activeCount: activeSceneIds.length,
			totalCount: scenes.length,
			language: $i18nPreferences.primaryLanguage
		})
	);

	$effect(() => {
		if (!isOpen || !root) return;
		const currentRoot = root;

		const handlePointerDown = (event: PointerEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) return;
			if (currentRoot.contains(target)) return;
			isOpen = false;
		};

		document.addEventListener("pointerdown", handlePointerDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	});
</script>

<details
	bind:this={root}
	class="relative z-40 w-full min-w-0 sm:min-w-[13rem] lg:w-auto"
	bind:open={isOpen}
>
	<summary
		class="motion-sheen flex h-9 list-none items-center justify-between gap-3 rounded-full border border-border/70 bg-background/76 px-3 text-sm text-foreground transition-[border-color,background-color,transform,box-shadow] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px hover:border-border hover:bg-background/92 [&::-webkit-details-marker]:hidden"
		aria-label={`${copy.triggerLabel}: ${triggerSummary}`}
	>
		<span class="min-w-0 truncate">{triggerSummary}</span>
		<ChevronDown
			class={`size-4 shrink-0 text-muted-foreground transition-transform [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] ${
				isOpen ? "rotate-180" : ""
			}`}
		/>
	</summary>

	<div
		class="absolute right-0 z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] rounded-[1.25rem] border border-border/70 bg-popover/96 p-3 shadow-[0_24px_42px_-30px_color-mix(in_oklab,var(--color-primary)_36%,transparent)] backdrop-blur"
	>
		<div class="mb-3 flex items-center justify-between gap-3">
			<div class="space-y-1">
				<p class="text-[0.72rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
					{copy.title}
				</p>
				<p class="text-xs text-muted-foreground">{triggerSummary}</p>
			</div>
			<Button
				size="sm"
				variant="ghost"
				class="motion-sheen transition-[color,transform] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-px"
				onclick={() => onSelectAll?.()}
			>
				{copy.selectAll}
			</Button>
		</div>
		<div class="max-h-72 space-y-1 overflow-y-auto pr-1">
			{#each scenes as scene (scene)}
				{@const active = activeSceneIds.includes(scene)}
				<button
					type="button"
					class={`flex w-full items-center justify-between gap-3 rounded-[1rem] px-3 py-2 text-left text-sm transition-[transform,color,background-color,border-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] ${
						active
							? "bg-secondary/72 text-foreground"
							: "text-muted-foreground hover:bg-secondary/38 hover:text-foreground"
					}`}
					onclick={() => onToggleScene?.(scene)}
				>
					<span class="min-w-0 truncate">{scene}</span>
					<span
						class={`inline-flex size-5 shrink-0 items-center justify-center rounded-full border transition-[color,background-color,border-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] ${
							active
								? "border-primary/35 bg-primary/12 text-primary"
								: "border-border/65 bg-background/80 text-transparent"
						}`}
					>
						<Check class="size-3.5" />
					</span>
				</button>
			{/each}
		</div>
	</div>
</details>
