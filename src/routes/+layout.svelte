<script lang="ts">
	import './layout.css';
	import { page } from '$app/stores';
	import SiteShell from '$lib/components/site-shell.svelte';
	import type { LayoutData } from './$types';

	let { children, data } = $props<{ children: () => unknown; data: LayoutData }>();
</script>

<svelte:head>
	<title>{data.seo.title}</title>
	<meta name="description" content={data.seo.description} />
	<meta name="robots" content={data.seo.robots} />
	<link rel="canonical" href={data.seo.canonicalUrl} />
	<meta property="og:title" content={data.seo.openGraph.title} />
	<meta property="og:description" content={data.seo.openGraph.description} />
	<meta property="og:type" content={data.seo.openGraph.type} />
	<meta property="og:url" content={data.seo.openGraph.url} />
	<meta property="og:site_name" content={data.seo.openGraph.siteName} />
	<meta property="og:locale" content={data.seo.openGraph.locale} />
	<meta property="og:image" content={data.seo.openGraph.image} />
	<meta property="og:image:alt" content={data.seo.title} />
	<meta name="twitter:card" content={data.seo.twitter.card} />
	<meta name="twitter:title" content={data.seo.twitter.title} />
	<meta name="twitter:description" content={data.seo.twitter.description} />
	<meta name="twitter:image" content={data.seo.twitter.image} />
	<link rel="icon" href="/branding/favicon.png" type="image/png" />
	{#each data.seo.jsonLd as schema, index (`${data.seo.pathname}-${index}`)}
		<script type="application/ld+json">
			{JSON.stringify(schema)}
		</script>
	{/each}
</svelte:head>
<SiteShell routeKey={$page.url.pathname}>
	{@render children()}
</SiteShell>
