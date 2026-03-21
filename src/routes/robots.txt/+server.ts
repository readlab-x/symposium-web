import { buildRobotsTxt } from "$lib/seo/metadata";
import { DEFAULT_SITE_URL } from "$lib/seo/site-config";

export const prerender = true;

export function GET() {
	return new Response(buildRobotsTxt(process.env.SITE_URL || DEFAULT_SITE_URL), {
		headers: {
			"content-type": "text/plain; charset=utf-8"
		}
	});
}
