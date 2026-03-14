<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import SiteShell from '$lib/components/site-shell.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<SiteShell routeKey={$page.url.pathname}>
	{@render children()}
</SiteShell>
