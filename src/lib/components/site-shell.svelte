<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button/index.js";

	type NavItem = {
		href: string;
		label: string;
	};

	const navItems: NavItem[] = [
		{ href: "/reading", label: "阅读" },
		{ href: "/characters", label: "人物" },
		{ href: "/themes", label: "主题" },
		{ href: "/relations", label: "关系图" },
		{ href: "/search", label: "搜索" }
	];

	let darkMode = $state(false);
	let { children } = $props();

	onMount(() => {
		darkMode = document.documentElement.classList.contains("dark");
	});

	function isActive(href: string): boolean {
		return $page.url.pathname === href;
	}

	function toggleTheme() {
		if (!browser) return;
		darkMode = !darkMode;
		document.documentElement.classList.toggle("dark", darkMode);
	}
</script>

<div class="relative min-h-screen bg-gradient-to-b from-stone-50 via-white to-stone-100 dark:from-stone-950 dark:via-stone-950 dark:to-black">
	<header class="border-b bg-white/70 backdrop-blur dark:bg-stone-950/70">
		<div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
			<a href="/" class="text-lg font-semibold tracking-tight">会饮研读台</a>
			<nav class="flex flex-wrap items-center gap-2">
				{#each navItems as item (item.href)}
					<Button href={item.href} variant={isActive(item.href) ? "secondary" : "ghost"} size="sm">
						{item.label}
					</Button>
				{/each}
			</nav>
			<Button variant="outline" size="sm" onclick={toggleTheme}>
				{darkMode ? "切换日间" : "切换夜间"}
			</Button>
		</div>
	</header>
	<main class="mx-auto max-w-7xl px-4 py-6">
		{@render children?.()}
	</main>
</div>
