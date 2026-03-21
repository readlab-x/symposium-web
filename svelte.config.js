import adapter from '@sveltejs/adapter-static';
import { normalizeBasePath } from './src/lib/paths/base-paths.js';

const basePath = normalizeBasePath(process.env.BASE_PATH);

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: basePath
		}
	}
};

export default config;
