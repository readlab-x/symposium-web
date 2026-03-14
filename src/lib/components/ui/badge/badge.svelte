<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/40 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2.5 py-1 text-[11px] font-medium whitespace-nowrap tracking-[0.04em] transition-[color,background-color,border-color,box-shadow] focus-visible:ring-[2px] [&>svg]:pointer-events-none [&>svg]:size-3",
		variants: {
			variant: {
				default:
					"border-primary/16 bg-primary/10 text-primary [a&]:hover:bg-primary/14",
				secondary:
					"border-border/55 bg-secondary/68 text-secondary-foreground [a&]:hover:bg-secondary/92",
				destructive:
					"bg-destructive/14 [a&]:hover:bg-destructive/18 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 border-destructive/25 text-destructive dark:bg-destructive/20",
				outline:
					"border-border/70 bg-transparent text-muted-foreground [a&]:hover:border-border [a&]:hover:bg-accent/40 [a&]:hover:text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
	import type { HTMLAnchorAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		href,
		class: className,
		variant = "default",
		children,
		...restProps
	}: WithElementRef<HTMLAnchorAttributes> & {
		variant?: BadgeVariant;
	} = $props();
</script>

<svelte:element
	this={href ? "a" : "span"}
	bind:this={ref}
	data-slot="badge"
	{href}
	class={cn(badgeVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</svelte:element>
