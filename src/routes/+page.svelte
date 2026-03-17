<script lang="ts">
	import { ArrowRight } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { i18nPreferences, pickByLanguage } from "$lib/stores/i18n";

	type ThesisCard = {
		speaker: string;
		title: string;
		summary: string;
		href: string;
	};

	type EntryCard = {
		title: string;
		summary: string;
		href: string;
	};

	type HomepageCopy = {
		hero: {
			eyebrow: string;
			title: string;
			subtitle: string;
			body: string;
			primaryAction: string;
			secondaryAction: string;
			shortLine: string;
		};
		motif: {
			eyebrow: string;
			words: string[];
			line: string;
		};
		positions: {
			eyebrow: string;
			title: string;
			description: string;
			cardAction: string;
			cards: ThesisCard[];
		};
		paths: {
			eyebrow: string;
			title: string;
			description: string;
			primary: {
				label: string;
				title: string;
				summary: string;
				action: string;
				href: string;
			};
			secondaryAction: string;
			secondary: EntryCard[];
		};
		closing: string;
	};

	const copy = $derived.by(() =>
		pickByLanguage<HomepageCopy>($i18nPreferences.primaryLanguage, {
			"zh-CN": {
				hero: {
					eyebrow: "Symposium",
					title: "爱是什么？",
					subtitle: "它欲求什么，又把人带向哪里？",
					body: "这里不是摘要页，也不是资料库，而是一座进入柏拉图《会饮》的研读台。你可以沿着发言次序阅读原文，也可以从人物、主题与关系图进入这场关于爱、欲望、德性与美的辩论。",
					primaryAction: "开始阅读",
					secondaryAction: "先看主题",
					shortLine: "从宴饮开始，抵达哲学。"
				},
				motif: {
					eyebrow: "关键词",
					words: ["荣誉", "欲求", "完整", "上升"],
					line: "在赞辞、反诘与醉语之间，爱被一步步逼近。"
				},
				positions: {
					eyebrow: "四种推进",
					title: "四个发言者，把爱带向四个方向。",
					description: "这不是完整答案，而是进入《会饮》时最值得先抓住的四次转向。",
					cardAction: "回到原文",
					cards: [
						{
							speaker: "斐德罗",
							title: "爱使人追求荣誉",
							summary: "爱先把人带到羞耻、勇气与牺牲的问题上。",
							href: "/reading"
						},
						{
							speaker: "阿里斯托芬",
							title: "爱是在寻找失落的完整",
							summary: "人因为分裂而匮乏，于是不断朝另一半靠近。",
							href: "/reading"
						},
						{
							speaker: "狄奥提玛",
							title: "爱欲求自身所缺乏之物",
							summary: "爱不是占有，而是从匮乏出发，走向生成、不朽与上升。",
							href: "/reading"
						},
						{
							speaker: "苏格拉底",
							title: "爱必须经受反诘",
							summary: "所有动人的赞辞，最后都要被逼问成更严格的哲学定义。",
							href: "/reading"
						}
					]
				},
				paths: {
					eyebrow: "进入路径",
					title: "进入这场辩论的方式，不止一种。",
					description: "最好的入口仍然是原文；其余路径适合带着问题折返进入。",
					primary: {
						label: "主入口",
						title: "按发言次序进入宴席",
						summary: "从斐德罗开始，沿着赞辞、追问、转折与醉语，一步步读到爱被逼近成哲学问题。",
						action: "开始阅读",
						href: "/reading"
					},
					secondaryAction: "进入",
					secondary: [
						{
							title: "人物索引",
							summary: "先认出说话的人，再理解他们各自如何定义爱。",
							href: "/characters"
						},
						{
							title: "主题地图",
							summary: "沿着荣誉、欲求、完整、美与不朽，横向进入整场对话。",
							href: "/themes"
						},
						{
							title: "关系图",
							summary: "看人物之间如何彼此回应、继承、修正与反驳。",
							href: "/relations"
						},
						{
							title: "全文搜索",
							summary: "直接寻找句子、概念与名字，从细部切入整部作品。",
							href: "/search"
						}
					]
				},
				closing: "从宴席的次序进入，从爱的定义离开。"
			},
			"en-US": {
				hero: {
					eyebrow: "Symposium",
					title: "What is love?",
					subtitle: "What does it desire, and where does it lead us?",
					body: "This is neither a summary page nor a database, but a reading desk for entering Plato's Symposium. You can follow the dialogue in speaking order, or step into the debate through characters, themes, and the relation graph.",
					primaryAction: "Start Reading",
					secondaryAction: "Explore Themes",
					shortLine: "Begin with the banquet; arrive at philosophy."
				},
				motif: {
					eyebrow: "Key Terms",
					words: ["Honor", "Desire", "Wholeness", "Ascent"],
					line: "Between praise, cross-examination, and drunken speech, love is pressed gradually into view."
				},
				positions: {
					eyebrow: "Four Turns",
					title: "Four speakers pull love in four directions.",
					description: "Not final answers, but four turns worth holding onto as you enter the dialogue.",
					cardAction: "Read in context",
					cards: [
						{
							speaker: "Phaedrus",
							title: "Love drives us toward honor",
							summary: "Love first draws human beings into questions of shame, courage, and sacrifice.",
							href: "/reading"
						},
						{
							speaker: "Aristophanes",
							title: "Love searches for a lost wholeness",
							summary: "Human beings are poor because they are divided, and so they keep moving toward the missing half.",
							href: "/reading"
						},
						{
							speaker: "Diotima",
							title: "Love desires what it lacks",
							summary: "Love is not possession but a movement from lack toward generation, immortality, and ascent.",
							href: "/reading"
						},
						{
							speaker: "Socrates",
							title: "Love must withstand questioning",
							summary: "Every moving speech of praise is eventually forced into a stricter philosophical definition.",
							href: "/reading"
						}
					]
				},
				paths: {
					eyebrow: "Ways In",
					title: "There is more than one way into the debate.",
					description: "The strongest entrance is still the text itself; the other routes let you re-enter it with a question in hand.",
					primary: {
						label: "Primary Path",
						title: "Enter by the order of speeches",
						summary: "Begin with Phaedrus and move through praise, questioning, reversals, and drunken speech until love is pressed into a philosophical problem.",
						action: "Start Reading",
						href: "/reading"
					},
					secondaryAction: "Open",
					secondary: [
						{
							title: "Character Index",
							summary: "Meet the speakers first, then see how each of them defines love.",
							href: "/characters"
						},
						{
							title: "Theme Map",
							summary: "Enter sideways through honor, desire, wholeness, beauty, and immortality.",
							href: "/themes"
						},
						{
							title: "Relation Graph",
							summary: "See how the speakers respond to, inherit, revise, and challenge one another.",
							href: "/relations"
						},
						{
							title: "Full-Text Search",
							summary: "Search directly for sentences, concepts, and names to enter the work through details.",
							href: "/search"
						}
					]
				},
				closing: "Enter by the order of the banquet; leave by the definition of love."
			}
		})
	);

	function motionDelayClass(index: number): string {
		if (index === 0) return "motion-delay-1";
		if (index === 1) return "motion-delay-2";
		if (index === 2) return "motion-delay-3";
		return "motion-delay-4";
	}

	function thesisToneClass(index: number): string {
		if (index === 0) {
			return "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-card)_96%,transparent),color-mix(in_oklab,var(--color-accent)_56%,transparent))]";
		}
		if (index === 1) {
			return "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-card)_96%,transparent),color-mix(in_oklab,var(--color-chart-4)_18%,transparent))]";
		}
		if (index === 2) {
			return "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-card)_96%,transparent),color-mix(in_oklab,var(--color-primary)_16%,transparent))]";
		}
		return "bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-card)_96%,transparent),color-mix(in_oklab,var(--color-chart-2)_18%,transparent))]";
	}

	function thesisShapeClass(index: number): string {
		if (index === 1) return "md:min-h-[18rem]";
		if (index === 2) return "md:min-h-[17rem]";
		if (index === 3) return "md:min-h-[16.25rem]";
		return "md:min-h-[15.5rem]";
	}

	function entryToneClass(index: number): string {
		if (index === 0) {
			return "bg-[linear-gradient(160deg,color-mix(in_oklab,var(--color-card)_95%,transparent),color-mix(in_oklab,var(--color-accent)_52%,transparent))]";
		}
		if (index === 1) {
			return "bg-[linear-gradient(160deg,color-mix(in_oklab,var(--color-card)_95%,transparent),color-mix(in_oklab,var(--color-chart-4)_16%,transparent))]";
		}
		if (index === 2) {
			return "bg-[linear-gradient(160deg,color-mix(in_oklab,var(--color-card)_95%,transparent),color-mix(in_oklab,var(--color-chart-2)_16%,transparent))]";
		}
		return "bg-[linear-gradient(160deg,color-mix(in_oklab,var(--color-card)_95%,transparent),color-mix(in_oklab,var(--color-primary)_14%,transparent))]";
	}
</script>

<section class="space-y-14 sm:space-y-16 lg:space-y-20">
	<section
		class="motion-stage-hero relative overflow-hidden rounded-[2.35rem] border border-border/65 bg-[linear-gradient(145deg,color-mix(in_oklab,var(--color-card)_96%,transparent),color-mix(in_oklab,var(--color-accent)_34%,transparent))] px-6 py-7 shadow-[0_38px_90px_-62px_color-mix(in_oklab,var(--color-primary)_28%,transparent)] sm:px-8 sm:py-9 lg:px-10 lg:py-10"
	>
		<div aria-hidden="true" class="pointer-events-none absolute inset-0">
			<div class="absolute inset-x-[34%] top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
			<div class="absolute -top-24 right-4 h-56 w-56 rounded-full bg-[color-mix(in_oklab,var(--color-primary)_16%,transparent)] blur-3xl"></div>
			<div class="absolute -left-10 bottom-0 h-48 w-72 rounded-full bg-[color-mix(in_oklab,var(--color-accent)_56%,transparent)] blur-3xl"></div>
			<div class="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,color-mix(in_oklab,var(--color-primary)_5%,transparent)_48%,transparent_100%)]"></div>
		</div>

		<div
			class="relative grid gap-8 lg:grid-cols-[minmax(0,1.18fr)_minmax(16rem,0.82fr)] lg:items-end lg:gap-10"
		>
			<div class="space-y-6">
				<p class="text-[0.72rem] font-semibold tracking-[0.28em] text-muted-foreground uppercase">
					{copy.hero.eyebrow}
				</p>

				<div class="space-y-4">
					<h1
						class="max-w-4xl text-[clamp(2.8rem,7vw,5.35rem)] font-semibold leading-[0.97] tracking-[-0.05em] text-foreground"
					>
						<span class="block">{copy.hero.title}</span>
						<span
							class="mt-3 block max-w-3xl text-[0.52em] font-medium leading-[1.08] tracking-[-0.03em] text-primary/88"
						>
							{copy.hero.subtitle}
						</span>
					</h1>

					<p class="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-[0.96rem]">
						{copy.hero.body}
					</p>
				</div>

				<div class="flex flex-wrap items-center gap-3">
					<Button
						href="/reading"
						size="lg"
						class="motion-sheen group rounded-full px-5 transition-[transform,box-shadow,background-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-expo)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_-24px_color-mix(in_oklab,var(--color-primary)_48%,transparent)]"
					>
						<span>{copy.hero.primaryAction}</span>
						<ArrowRight
							class="ml-2 size-4 transition-transform [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] group-hover:translate-x-0.5"
						/>
					</Button>

					<Button
						href="/themes"
						variant="outline"
						size="lg"
						class="motion-sheen rounded-full border-border/70 bg-background/72 px-5 transition-[transform,box-shadow,border-color,background-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-expo)] hover:-translate-y-0.5 hover:border-border hover:bg-background/86 hover:shadow-[0_18px_30px_-24px_color-mix(in_oklab,var(--color-primary)_24%,transparent)]"
					>
						{copy.hero.secondaryAction}
					</Button>
				</div>

				<p
					class="max-w-xl border-l border-border/70 pl-4 text-sm leading-6 text-foreground/82 sm:text-[0.95rem]"
				>
					{copy.hero.shortLine}
				</p>
			</div>

			<aside
				class="motion-stage-soft motion-delay-2 relative overflow-hidden rounded-[1.85rem] border border-border/65 bg-background/58 p-6 shadow-[0_30px_70px_-56px_color-mix(in_oklab,var(--color-primary)_22%,transparent)] sm:p-7"
			>
				<div aria-hidden="true" class="pointer-events-none absolute inset-0">
					<div
						class="absolute right-0 top-0 h-28 w-28 rounded-full bg-[color-mix(in_oklab,var(--color-primary)_10%,transparent)] blur-2xl"
					></div>
				</div>

				<div class="relative space-y-6">
					<div class="space-y-3">
						<p class="text-[0.72rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
							{copy.motif.eyebrow}
						</p>
						<div class="flex flex-wrap gap-2.5">
							{#each copy.motif.words as word (`motif-${word}`)}
								<span
									class="rounded-full border border-border/65 bg-background/80 px-3 py-1 text-[0.74rem] tracking-[0.16em] text-foreground/80 uppercase"
								>
									{word}
								</span>
							{/each}
						</div>
					</div>

					<p class="max-w-sm text-base leading-7 text-foreground/86 sm:text-[1.02rem]">
						{copy.motif.line}
					</p>
				</div>
			</aside>
		</div>
	</section>

	<section class="space-y-5">
		<div class="motion-stage-soft motion-delay-1 grid gap-3 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:items-end">
			<div class="space-y-2">
				<p class="text-[0.72rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
					{copy.positions.eyebrow}
				</p>
				<h2 class="max-w-2xl text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-[2rem]">
					{copy.positions.title}
				</h2>
			</div>

			<p class="max-w-2xl text-sm leading-7 text-muted-foreground lg:justify-self-end">
				{copy.positions.description}
			</p>
		</div>

		<div class="grid gap-4 md:grid-cols-2 md:gap-5">
			{#each copy.positions.cards as card, index (`position-${card.speaker}`)}
				<a
					href={card.href}
					class={`motion-stage-soft group relative flex min-h-[15rem] flex-col justify-between overflow-hidden rounded-[1.8rem] border border-border/60 p-6 shadow-[0_28px_64px_-50px_color-mix(in_oklab,var(--color-primary)_24%,transparent)] transition-[transform,box-shadow,border-color,background-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-0.5 hover:border-border/80 hover:shadow-[0_34px_72px_-48px_color-mix(in_oklab,var(--color-primary)_30%,transparent)] ${motionDelayClass(index)} ${thesisToneClass(index)} ${thesisShapeClass(index)}`}
				>
					<div
						aria-hidden="true"
						class="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/36 to-transparent"
					></div>

					<div class="space-y-4">
						<p class="text-[0.72rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
							{card.speaker}
						</p>
						<h3 class="max-w-[17rem] text-[1.42rem] leading-[1.14] tracking-[-0.035em] text-foreground">
							{card.title}
						</h3>
						<p class="max-w-[21rem] text-sm leading-7 text-muted-foreground">
							{card.summary}
						</p>
					</div>

					<div class="flex items-center justify-between gap-3 text-sm text-foreground/84">
						<span>{copy.positions.cardAction}</span>
						<ArrowRight
							class="size-4 transition-transform [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] group-hover:translate-x-0.5"
						/>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="space-y-5">
		<div class="motion-stage-soft motion-delay-1 grid gap-3 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1fr)] lg:items-end">
			<div class="space-y-2">
				<p class="text-[0.72rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
					{copy.paths.eyebrow}
				</p>
				<h2 class="max-w-2xl text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-[2rem]">
					{copy.paths.title}
				</h2>
			</div>

			<p class="max-w-2xl text-sm leading-7 text-muted-foreground lg:justify-self-end">
				{copy.paths.description}
			</p>
		</div>

		<div class="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
			<a
				href={copy.paths.primary.href}
				class="motion-stage-soft motion-delay-2 group relative overflow-hidden rounded-[2rem] border border-border/65 bg-[linear-gradient(150deg,color-mix(in_oklab,var(--color-card)_95%,transparent),color-mix(in_oklab,var(--color-primary)_16%,transparent))] p-7 shadow-[0_36px_78px_-56px_color-mix(in_oklab,var(--color-primary)_30%,transparent)] transition-[transform,box-shadow,border-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-0.5 hover:border-border/80 hover:shadow-[0_40px_84px_-54px_color-mix(in_oklab,var(--color-primary)_34%,transparent)] sm:p-8"
			>
				<div aria-hidden="true" class="pointer-events-none absolute inset-0">
					<div
						class="absolute -right-8 top-0 h-40 w-40 rounded-full bg-[color-mix(in_oklab,var(--color-primary)_12%,transparent)] blur-3xl"
					></div>
					<div
						class="absolute bottom-0 left-0 h-28 w-full bg-[linear-gradient(180deg,transparent_0%,color-mix(in_oklab,var(--color-accent)_26%,transparent)_100%)]"
					></div>
				</div>

				<div class="relative flex min-h-[18rem] flex-col justify-between gap-8">
					<div class="space-y-4">
						<p class="text-[0.72rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
							{copy.paths.primary.label}
						</p>
						<h3 class="max-w-md text-[1.95rem] leading-[1.06] tracking-[-0.045em] text-foreground sm:text-[2.2rem]">
							{copy.paths.primary.title}
						</h3>
						<p class="max-w-lg text-sm leading-7 text-muted-foreground sm:text-[0.96rem]">
							{copy.paths.primary.summary}
						</p>
					</div>

					<div class="flex items-center justify-between gap-4">
						<span class="text-sm font-medium text-foreground/86">{copy.paths.primary.action}</span>
						<span
							class="inline-flex size-10 items-center justify-center rounded-full border border-border/65 bg-background/76 text-foreground shadow-[0_18px_30px_-24px_color-mix(in_oklab,var(--color-primary)_26%,transparent)]"
						>
							<ArrowRight
								class="size-4 transition-transform [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] group-hover:translate-x-0.5"
							/>
						</span>
					</div>
				</div>
			</a>

			<div class="grid gap-4 sm:grid-cols-2">
				{#each copy.paths.secondary as entry, index (`entry-${entry.title}`)}
					<a
						href={entry.href}
						class={`motion-stage-soft group relative flex min-h-[12.75rem] flex-col justify-between overflow-hidden rounded-[1.65rem] border border-border/60 p-5 shadow-[0_24px_52px_-44px_color-mix(in_oklab,var(--color-primary)_18%,transparent)] transition-[transform,box-shadow,border-color,background-color] [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] hover:-translate-y-0.5 hover:border-border/80 hover:shadow-[0_28px_58px_-40px_color-mix(in_oklab,var(--color-primary)_24%,transparent)] ${motionDelayClass(index + 1)} ${entryToneClass(index)}`}
					>
						<div class="space-y-3">
							<h3 class="text-[1.15rem] font-semibold tracking-[-0.025em] text-foreground">
								{entry.title}
							</h3>
							<p class="text-sm leading-7 text-muted-foreground">{entry.summary}</p>
						</div>

						<div class="flex items-center justify-between gap-3 text-sm text-foreground/84">
							<span>{copy.paths.secondaryAction}</span>
							<ArrowRight
								class="size-4 transition-transform [transition-duration:var(--motion-feedback-medium)] ease-[var(--ease-ritual-out)] group-hover:translate-x-0.5"
							/>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="motion-stage-soft motion-delay-4 border-t border-border/60 pt-8 sm:pt-10">
		<p class="max-w-3xl text-[1.35rem] leading-relaxed tracking-[-0.03em] text-foreground sm:text-[1.8rem]">
			{copy.closing}
		</p>
	</section>
</section>
