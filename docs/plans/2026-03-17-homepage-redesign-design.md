# Symposium Homepage Redesign Design

**Date:** 2026-03-17  
**Status:** Approved

## Goal

Replace the current scaffold-like homepage with a narrative preface that feels like an entrance into Plato's *Symposium*, not a product dashboard. The homepage should guide readers into the work through a strong philosophical question, a small set of core positions, and a clear path into the reading experience.

## Current Problem

The current homepage in `src/routes/+page.svelte` still reads like a project scaffold:

- it describes implemented modules instead of the text itself
- it has weak emotional tone for a literature and philosophy project
- it does not establish reading order or interpretive entry points
- it underuses the site's existing brand language, motion system, and bilingual framing

## Approved Direction

The approved mode is:

- structure: narrative homepage
- entry angle: philosophical question
- visual tone: dramatic and poetic

This means the homepage should behave like a preface to the reading desk. It should feel literary, staged, and intentional, while still remaining usable and quick to scan.

## Information Architecture

The homepage is reorganized into four stacked sections:

1. Hero question and atmospheric introduction
2. Four philosophical positions from the dialogue
3. Entry paths into the site
4. Short closing line

This replaces the current "implemented modules" list entirely.

## Section 1: Hero

### Purpose

Set the emotional and intellectual tone immediately. The hero should present the text as a live philosophical debate rather than a static archive.

### Approved Chinese Copy

- main line: `爱是什么？`
- second line: `它欲求什么，又把人带向哪里？`
- body: `这里不是摘要页，也不是资料库，而是一座进入柏拉图《会饮》的研读台。你可以沿着发言次序阅读原文，也可以从人物、主题与关系图进入这场关于爱、欲望、德性与美的辩论。`
- primary action: `开始阅读`
- secondary action: `先看主题`
- short line: `从宴饮开始，抵达哲学。`

### Approved English Copy

- main line: `What is love?`
- second line: `What does it desire, and where does it lead us?`
- body: `This is neither a summary page nor a database, but a reading desk for entering Plato's Symposium. You can follow the dialogue in speaking order, or step into the debate through characters, themes, and the relation graph.`
- primary action: `Start Reading`
- secondary action: `Explore Themes`
- short line: `Begin with the banquet; arrive at philosophy.`

### Supporting Motif Block

The hero includes a secondary visual/textual area on the right side for atmosphere rather than utility.

Concept words:

- Chinese: `荣誉 / 欲求 / 完整 / 上升`
- English: `Honor / Desire / Wholeness / Ascent`

Atmospheric line:

- Chinese: `在赞辞、反诘与醉语之间，爱被一步步逼近。`
- English: `Between praise, cross-examination, and drunken speech, love is pressed gradually into view.`

## Section 2: Four Philosophical Positions

### Purpose

Present four memorable interpretive positions from the dialogue so the homepage feels like the opening map of an argument. This section should not feel like a feature grid.

### Layout

- a 2x2 grid on desktop
- slightly staggered card rhythm rather than four identical feature tiles
- subtle hover elevation only
- no horizontal hover shift
- primary click target leads into reading rather than character detail pages

### Approved Cards

#### Phaedrus

- Chinese title: `爱使人追求荣誉`
- Chinese summary: `爱先把人带到羞耻、勇气与牺牲的问题上。`
- English title: `Love drives us toward honor`
- English summary: `Love first draws human beings into questions of shame, courage, and sacrifice.`

#### Aristophanes

- Chinese title: `爱是在寻找失落的完整`
- Chinese summary: `人因为分裂而匮乏，于是不断朝另一半靠近。`
- English title: `Love searches for a lost wholeness`
- English summary: `Human beings are poor because they are divided, and so they keep moving toward the missing half.`

#### Diotima

- Chinese title: `爱欲求自身所缺乏之物`
- Chinese summary: `爱不是占有，而是从匮乏出发，走向生成、不朽与上升。`
- English title: `Love desires what it lacks`
- English summary: `Love is not possession but a movement from lack toward generation, immortality, and ascent.`

#### Socrates

- Chinese title: `爱必须经受反诘`
- Chinese summary: `所有动人的赞辞，最后都要被逼问成更严格的哲学定义。`
- English title: `Love must withstand questioning`
- English summary: `Every moving speech of praise is eventually forced into a stricter philosophical definition.`

## Section 3: Entry Paths

### Purpose

Offer ways into the site without turning the homepage into a functional dashboard. These are "ways into the debate," not product modules.

### Layout

- one large primary entry card for reading
- four smaller secondary cards for alternate approaches
- mobile stacks vertically with the reading card first

### Approved Primary Entry

- Chinese title: `按发言次序进入宴席`
- Chinese summary: `从斐德罗开始，沿着赞辞、追问、转折与醉语，一步步读到爱被逼近成哲学问题。`
- Chinese action: `开始阅读`
- English title: `Enter by the order of speeches`
- English summary: `Begin with Phaedrus and move through praise, questioning, reversals, and drunken speech until love is pressed into a philosophical problem.`
- English action: `Start Reading`

### Approved Secondary Entries

#### Characters

- Chinese title: `人物索引`
- Chinese summary: `先认出说话的人，再理解他们各自如何定义爱。`
- English title: `Character Index`
- English summary: `Meet the speakers first, then see how each of them defines love.`

#### Themes

- Chinese title: `主题地图`
- Chinese summary: `沿着荣誉、欲求、完整、美与不朽，横向进入整场对话。`
- English title: `Theme Map`
- English summary: `Enter sideways through honor, desire, wholeness, beauty, and immortality.`

#### Relations

- Chinese title: `关系图`
- Chinese summary: `看人物之间如何彼此回应、继承、修正与反驳。`
- English title: `Relation Graph`
- English summary: `See how the speakers respond to, inherit, revise, and challenge one another.`

#### Search

- Chinese title: `全文搜索`
- Chinese summary: `直接寻找句子、概念与名字，从细部切入整部作品。`
- English title: `Full-Text Search`
- English summary: `Search directly for sentences, concepts, and names to enter the work through details.`

## Section 4: Closing Line

The homepage ends with a short line so the whole page reads like a preface rather than a portal.

- Chinese: `从宴席的次序进入，从爱的定义离开。`
- English: `Enter by the order of the banquet; leave by the definition of love.`

## Interaction and Motion

- keep hover feedback subtle and quiet
- no card should slide sideways on hover
- hero actions can keep the existing slight lift behavior
- cards should prefer shadow, tone, and border changes over large movement
- the page should preserve the existing site motion language instead of introducing unrelated animation patterns

## Responsive Behavior

- desktop: hero split layout, then 2x2 thesis cards, then reading-led entry grid
- tablet: hero collapses vertically with the motif block below the main copy
- mobile: each section stacks into a single column with the strongest line and primary CTA near the top of the viewport

## Content Strategy

- all homepage copy must ship in both `zh-CN` and `en-US`
- the homepage should no longer mention scaffold technology or implemented modules
- the reading route remains the primary call to action throughout the page

## Non-Goals

This redesign does not:

- change the global shell header or navigation structure
- add homepage-specific API calls or dynamic data fetching
- introduce new routes
- create deep-link reading anchors unless the existing reading route already supports them

## Approved Outcome

The homepage becomes a bilingual narrative preface with a philosophical hero, a four-position argument map, a reading-led entry section, and a short literary closing line. It should feel like an intentional front door to the text rather than a development scaffold.
