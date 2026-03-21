import { buildSitemapXml } from "$lib/seo/metadata";
import { DEFAULT_SITE_URL } from "$lib/seo/site-config";

export const prerender = true;

export function GET() {
	return new Response(buildSitemapXml(process.env.SITE_URL || DEFAULT_SITE_URL), {
		headers: {
			"content-type": "application/xml; charset=utf-8"
		}
	});
}
