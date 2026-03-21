import { asset, resolve } from "$app/paths";

/**
 * @typedef {import("$app/types").Pathname} AppPathname
 */

/**
 * @param {string} path
 * @returns {boolean}
 */
function isExternalPath(path) {
	return /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(path);
}

/**
 * @param {string} path
 * @returns {{ pathname: string; suffix: string }}
 */
function splitSuffix(path) {
	const hashIndex = path.indexOf("#");
	const queryIndex = path.indexOf("?");
	let splitIndex = -1;

	if (hashIndex !== -1 && queryIndex !== -1) {
		splitIndex = Math.min(hashIndex, queryIndex);
	} else if (hashIndex !== -1) {
		splitIndex = hashIndex;
	} else if (queryIndex !== -1) {
		splitIndex = queryIndex;
	}

	if (splitIndex === -1) {
		return { pathname: path, suffix: "" };
	}

	return {
		pathname: path.slice(0, splitIndex),
		suffix: path.slice(splitIndex)
	};
}

/**
 * `resolve` expects SvelteKit pathnames with trailing slashes for page routes.
 *
 * @param {string} pathname
 * @returns {AppPathname}
 */
function normalizePathname(pathname) {
	if (!pathname || pathname === "/") {
		return "/";
	}

	const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
	return /** @type {AppPathname} */ (
		normalized.endsWith("/") ? normalized : `${normalized}/`
	);
}

/**
 * @param {string} path
 * @returns {string}
 */
export function toBasePath(path) {
	if (!path) return "/";
	if (isExternalPath(path)) return path;

	const { pathname, suffix } = splitSuffix(path);
	return `${resolve(normalizePathname(pathname))}${suffix}`;
}

/**
 * @param {string} path
 * @returns {string}
 */
export function toAssetPath(path) {
	return asset(path);
}
