function createLightTheme() {
	return {
		text: "#36281d",
		fallbackText: "#24170d",
		mutedText: "#7d6b58",
		edgeStroke: "rgba(122, 99, 72, 0.34)",
		edgeActive: "#7f5c32",
		edgeLabelFill: "#6f5a45",
		edgeLabelBackgroundFill: "rgba(252, 247, 239, 0.82)",
		edgeLabelBackgroundStroke: "rgba(123, 94, 51, 0.14)",
		node: {
			person: {
				fill: "#f4ead8",
				stroke: "#ba9462"
			},
			deity: {
				fill: "#f6e4df",
				stroke: "#cf8d8a"
			},
			place: {
				fill: "#e6efe6",
				stroke: "#8aad95"
			},
			active: {
				ring: "#7b5f3d"
			},
			neighbor: {
				ring: "#b08c5d"
			}
		}
	};
}

function createDarkTheme() {
	return {
		text: "#eee6d7",
		fallbackText: "#f7eee0",
		mutedText: "#b8aa96",
		edgeStroke: "rgba(186, 171, 149, 0.3)",
		edgeActive: "#e2caa1",
		edgeLabelFill: "#d8cab7",
		edgeLabelBackgroundFill: "rgba(35, 28, 25, 0.86)",
		edgeLabelBackgroundStroke: "rgba(226, 202, 161, 0.18)",
		node: {
			person: {
				fill: "#3b3028",
				stroke: "#d0ab77"
			},
			deity: {
				fill: "#443130",
				stroke: "#d7a1a1"
			},
			place: {
				fill: "#26362c",
				stroke: "#90b39a"
			},
			active: {
				ring: "#e2caa1"
			},
			neighbor: {
				ring: "#d0ab77"
			}
		}
	};
}

/** @typedef {import("@antv/g6").NodeData} RelationGraphDatum */

/**
 * @param {Record<string, unknown> | undefined} data
 * @returns {"person" | "deity" | "place"}
 */
function resolveNodeType(data) {
	if (data?.type === "deity" || data?.type === "place") return data.type;
	return "person";
}

/**
 * @param {ReturnType<typeof createRelationGraphTheme>} theme
 * @param {string} type
 */
function resolveNodeTone(theme, type) {
	if (type === "deity") return theme.node.deity;
	if (type === "place") return theme.node.place;
	return theme.node.person;
}

/**
 * @param {RelationGraphDatum | undefined} datum
 */
function resolveAvatarImage(datum) {
	const data = /** @type {{ avatarImage?: unknown }} */ (datum?.data ?? {});
	const style = /** @type {{ avatarImage?: unknown }} */ (datum?.style ?? {});

	if (typeof data.avatarImage === "string" && data.avatarImage.length > 0) {
		return data.avatarImage;
	}

	if (typeof style.avatarImage === "string" && style.avatarImage.length > 0) {
		return style.avatarImage;
	}

	return undefined;
}

/**
 * @param {RelationGraphDatum | undefined} datum
 */
function resolveAvatarFallback(datum) {
	const data = /** @type {{ avatarFallback?: unknown }} */ (datum?.data ?? {});
	const style = /** @type {{ avatarFallback?: unknown; labelText?: unknown }} */ (datum?.style ?? {});

	if (typeof data.avatarFallback === "string" && data.avatarFallback.length > 0) {
		return data.avatarFallback;
	}

	if (typeof style.avatarFallback === "string" && style.avatarFallback.length > 0) {
		return style.avatarFallback;
	}

	if (typeof style.labelText === "string" && style.labelText.length > 0) {
		return style.labelText.slice(0, 1);
	}

	return "?";
}

/**
 * @param {RelationGraphDatum | undefined} datum
 */
function resolveBaseSize(datum) {
	const style = /** @type {{ size?: unknown }} */ (datum?.style ?? {});
	const size = style.size;

	if (typeof size === "number" && Number.isFinite(size)) return size;
	if (Array.isArray(size) && typeof size[0] === "number") return size[0];
	if (ArrayBuffer.isView(size) && !(size instanceof DataView)) {
		const vectorSize = /** @type {ArrayLike<number>} */ (/** @type {unknown} */ (size));
		if (typeof vectorSize[0] === "number") return vectorSize[0];
	}

	return 56;
}

/**
 * @param {number} size
 */
function resolveIconSize(size) {
	return Math.max(Math.round(size), 28);
}

/**
 * @param {{ darkMode?: boolean }} [options]
 */
export function createRelationGraphTheme({ darkMode = false } = {}) {
	return darkMode ? createDarkTheme() : createLightTheme();
}

/**
 * @param {{
 *   container: string | HTMLElement;
 *   data: import("@antv/g6").GraphData;
 *   darkMode?: boolean;
 * }} options
 * @returns {import("@antv/g6").GraphOptions}
 */
export function createRelationGraphOptions({ container, data, darkMode = false }) {
	const theme = createRelationGraphTheme({ darkMode });

	return {
		container,
		data,
		autoFit: "view",
		autoResize: true,
		padding: 52,
		animation: true,
		zoomRange: [0.48, 2.1],
		layout: {
			type: "d3-force",
			animation: true,
			preventOverlap: true,
			linkDistance: 500,
			nodeStrength: -180,
			edgeStrength: 0.09,
			alphaDecay: 0.06,
			velocityDecay: 0.72,
			collide: {
				strength: 0.48,
				radius: 144
			}
		},
		behaviors: [
			{
				key: "drag-canvas",
				type: "drag-canvas"
			},
			{
				key: "zoom-canvas",
				type: "zoom-canvas",
				sensitivity: 1.3,
				animation: {
					duration: 140
				}
			},
			{
				key: "drag-element-force",
				type: "drag-element-force",
				fixed: false
			}
		],
		node: {
			type: "circle",
			style: {
				cursor: "pointer",
				size: (datum) => resolveBaseSize(datum),
				opacity: 1,
				fillOpacity: 1,
				fill: (datum) => resolveNodeTone(theme, resolveNodeType(datum?.data)).fill,
				strokeOpacity: 0,
				stroke: (datum) => resolveNodeTone(theme, resolveNodeType(datum?.data)).stroke,
				lineWidth: 0,
				halo: false,
				haloStrokeOpacity: 0,
				labelPlacement: "bottom",
				labelMaxWidth: "250%",
				labelWordWrap: true,
				labelFontSize: 11,
				labelFill: theme.text,
				labelOpacity: 1,
				labelOffsetY: 16,
				labelFontWeight: 560,
				icon: true,
				iconSrc: (datum) => resolveAvatarImage(datum),
				iconText: (datum) => (resolveAvatarImage(datum) ? undefined : resolveAvatarFallback(datum)),
				iconFill: theme.fallbackText,
				iconOpacity: 1,
				iconFontSize: 18,
				iconFontWeight: 700,
				iconWidth: (datum) => resolveIconSize(resolveBaseSize(datum)),
				iconHeight: (datum) => resolveIconSize(resolveBaseSize(datum)),
				iconRadius: (datum) => resolveIconSize(resolveBaseSize(datum)) / 2
			},
			state: {
				active: {
					size: 60,
					lineWidth: 0,
					strokeOpacity: 0,
					labelOffsetY: 18,
					labelFontWeight: 650,
					iconWidth: 60,
					iconHeight: 60,
					iconRadius: 30,
					halo: false,
					haloStrokeOpacity: 0
				},
				neighbor: {
					size: 58,
					lineWidth: 0,
					strokeOpacity: 0,
					labelFontWeight: 610,
					iconWidth: 58,
					iconHeight: 58,
					iconRadius: 29,
					halo: false,
					haloStrokeOpacity: 0
				},
				dimmed: {
					opacity: 0.32,
					labelOpacity: 0.5
				}
			}
		},
		edge: {
			type: "line",
			style: {
				stroke: theme.edgeStroke,
				lineWidth: 1.6,
				opacity: 0.82,
				endArrow: false,
				labelPlacement: "center",
				labelAutoRotate: false,
				labelWordWrap: true,
				labelMaxWidth: "76%",
				labelMaxLines: 2,
				labelTextAlign: "center",
				labelFill: theme.edgeLabelFill,
				labelOpacity: 1,
				labelFontSize: 8.5,
				labelBackground: true,
				labelBackgroundFill: theme.edgeLabelBackgroundFill,
				labelBackgroundStroke: theme.edgeLabelBackgroundStroke,
				labelBackgroundLineWidth: 1,
				labelBackgroundRadius: 8,
				labelPadding: [3, 6],
				labelOffsetY: -10
			},
			state: {
				active: {
					stroke: theme.edgeActive,
					lineWidth: 2.5,
					labelFill: theme.text,
					opacity: 1
				},
				dimmed: {
					opacity: 0.18,
					labelOpacity: 0.38
				}
			}
		}
	};
}
