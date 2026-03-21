import { stripBasePath } from "$lib/paths/base-paths";
import { getSeoMetadata } from "$lib/seo/metadata";
import { DEFAULT_SITE_URL } from "$lib/seo/site-config";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = ({ url }) => ({
	seo: getSeoMetadata({
		pathname: stripBasePath(process.env.BASE_PATH || "", url.pathname),
		siteUrl: process.env.SITE_URL || DEFAULT_SITE_URL
	})
});
