export function getSiteShellRootClass() {
	return "relative min-h-screen overflow-x-clip bg-background";
}

export function getSiteShellBackdropClass() {
	return "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(156,121,74,0.12),transparent_72%)] dark:bg-[radial-gradient(circle_at_top,rgba(212,188,145,0.08),transparent_74%)]";
}

export function getSiteShellHeaderClass() {
	return "sticky top-0 z-40 border-b border-border/70 bg-background/88 backdrop-blur-md";
}
