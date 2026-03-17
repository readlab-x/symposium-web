<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import favicon from '$lib/assets/favicon.svg';
	import SiteShell from '$lib/components/site-shell.svelte';
	import { getDocumentTitle } from '$lib/seo/page-title';
	import { i18nPreferences } from '$lib/stores/i18n';

	let { children } = $props();
	const documentTitle = $derived.by(() =>
		getDocumentTitle($page.url.pathname, $i18nPreferences.primaryLanguage)
	);
</script>

<svelte:head>
	<title>{documentTitle}</title>
	<link rel="icon" href={favicon} />
</svelte:head>
<SiteShell routeKey={$page.url.pathname}>
	{@render children()}
</SiteShell>
