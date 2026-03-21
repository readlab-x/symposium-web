/**
 * @param {string | undefined | null} rawBasePath
 * @returns {string}
 */
export function normalizeBasePath(rawBasePath) {
	if (typeof rawBasePath !== "string") return "";

	const trimmed = rawBasePath.trim();
	if (!trimmed || trimmed === "/") return "";

	const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withLeadingSlash.replace(/\/+$/, "");
}

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
 * @param {string} pathname
 * @returns {string}
 */
function normalizeInternalPathname(pathname) {
	if (!pathname || pathname === "/") return "/";
	return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

/**
 * @param {string | undefined | null} basePath
 * @param {string | undefined | null} path
 * @returns {string}
 */
export function joinBasePath(basePath, path) {
	if (typeof path !== "string" || path.length === 0) return "";
	if (isExternalPath(path)) return path;

	const normalizedBasePath = normalizeBasePath(basePath);
	if (!normalizedBasePath) return path;

	const { pathname, suffix } = splitSuffix(path);
	const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

	if (normalizedPathname === "/") {
		return `${normalizedBasePath}${suffix}`;
	}

	if (
		normalizedPathname === normalizedBasePath ||
		normalizedPathname.startsWith(`${normalizedBasePath}/`)
	) {
		return normalizedPathname + suffix;
	}

	return `${normalizedBasePath}${normalizedPathname}${suffix}`;
}

/**
 * @param {string | undefined | null} basePath
 * @param {string | undefined | null} pathname
 * @returns {string}
 */
export function stripBasePath(basePath, pathname) {
	if (typeof pathname !== "string" || pathname.length === 0) return "/";

	const normalizedBasePath = normalizeBasePath(basePath);
	if (!normalizedBasePath) return normalizeInternalPathname(pathname);
	if (pathname === normalizedBasePath) return "/";
	if (pathname.startsWith(`${normalizedBasePath}/`)) {
		return normalizeInternalPathname(pathname.slice(normalizedBasePath.length) || "/");
	}

	return normalizeInternalPathname(pathname);
}
