export type EntityType = "person" | "place" | "deity";

export interface Character {
	id: string;
	name: string;
	type: EntityType;
	role: string;
	avatar: string;
	summary: string;
	firstLineId?: string;
}

export interface Place {
	id: string;
	name: string;
	type: "place";
	summary: string;
	relatedLineIds: string[];
}

export interface DialogLine {
	id: string;
	sequence: number;
	chapter: string;
	speakerId: string;
	text: string;
	tags: string[];
}

export type AnnotationType = "background" | "translation" | "term" | "cross-reference";

export interface Annotation {
	id: string;
	lineId: string;
	type: AnnotationType;
	title: string;
	content: string;
	tags: string[];
}

export interface Theme {
	id: string;
	name: string;
	summary: string;
	lineIds: string[];
	characterIds: string[];
}

export interface RelationNode {
	id: string;
	label: string;
	type: EntityType;
	summary: string;
	x: number;
	y: number;
}

export interface RelationEdge {
	id: string;
	source: string;
	target: string;
	relation: string;
}

export interface RelationsGraph {
	nodes: RelationNode[];
	edges: RelationEdge[];
}

export interface EntityReference {
	id: string;
	name: string;
	type: EntityType;
	summary: string;
	relatedChapter?: string;
}
