/** @param {number} position */
function entryDelayClass(position) {
	if (position === 0) return "";
	if (position === 1) return "motion-delay-1";
	if (position === 2) return "motion-delay-2";
	if (position === 3) return "motion-delay-3";
	if (position === 4) return "motion-delay-4";
	return "";
}

/**
 * @param {{ index?: number; isSelected?: boolean }} params
 */
export function getDialogueLineRootClass({ index = 0, isSelected = false } = {}) {
	const stageClass = index < 5 ? `motion-stage-soft ${entryDelayClass(index)}`.trim() : "";
	const interactionClass =
		"transition-[transform,color,background-color,border-color,box-shadow,ring-color] [transition-duration:var(--motion-panel)] ease-[var(--ease-ritual-out)]";
	const stateClass = isSelected
		? "border-primary/48 bg-secondary/82 ring-1 ring-primary/18 -translate-y-0.5 shadow-[0_28px_52px_-36px_color-mix(in_oklab,var(--color-primary)_68%,transparent)]"
		: "border-border/55 bg-background/58 hover:-translate-y-0.5 hover:border-border/80 hover:bg-card/94";

	return [stageClass, interactionClass, stateClass].filter(Boolean).join(" ");
}
