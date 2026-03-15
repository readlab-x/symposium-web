function createLightTheme() {
	return {
		text: "#3b2d22",
		mutedText: "#7d6b58",
		edgeStroke: "#8d7a67",
		edgeActive: "#8b6332",
		edgeLabelFill: "#6f5a45",
		edgeLabelBackgroundFill: "rgba(251, 245, 235, 0.96)",
		edgeLabelBackgroundStroke: "rgba(123, 94, 51, 0.18)",
		node: {
			person: {
				fill: "#f5ebd8",
				stroke: "#d1b07a"
			},
			deity: {
				fill: "#f3e3e1",
				stroke: "#d7a0a0"
			},
			place: {
				fill: "#e7f0e9",
				stroke: "#97c0a8"
			},
			active: {
				fill: "#f1ddbc",
				stroke: "#6b5131"
			},
			neighbor: {
				fill: "#fbf3e5",
				stroke: "#b08c5d"
			}
		},
		edge: {
			labelBackground: true
		}
	};
}

function createDarkTheme() {
	return {
		text: "#ece7da",
		mutedText: "#b7ab98",
		edgeStroke: "rgba(183, 171, 152, 0.42)",
		edgeActive: "rgba(214, 194, 158, 0.8)",
		edgeLabelFill: "#d7c9b4",
		edgeLabelBackgroundFill: "rgba(42, 32, 27, 0.92)",
		edgeLabelBackgroundStroke: "rgba(214, 194, 158, 0.34)",
		node: {
			person: {
				fill: "#3c3128",
				stroke: "#d1b07a"
			},
			deity: {
				fill: "#40302f",
				stroke: "#d7a0a0"
			},
			place: {
				fill: "#29382f",
				stroke: "#97c0a8"
			},
			active: {
				fill: "#f1e4ca",
				stroke: "#8a6a3f"
			},
			neighbor: {
				fill: "#463a32",
				stroke: "#ccb182"
			}
		},
		edge: {
			labelBackground: true
		}
	};
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
		padding: 40,
		animation: true,
		zoomRange: [0.55, 2],
		layout: {
			type: "d3-force",
			animation: true,
			preventOverlap: true,
			linkDistance: 460,
			nodeStrength: -160,
			edgeStrength: 0.08,
			alphaDecay: 0.08,
			velocityDecay: 0.7,
			collide: {
				strength: 0.45,
				radius: 128
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
				size: 42,
				lineWidth: 2,
				labelPlacement: "bottom",
				labelMaxWidth: "230%",
				labelWordWrap: true,
				labelFontSize: 11,
				labelFill: theme.text,
				labelOffsetY: 14,
				labelFontWeight: 520
			},
			state: {
				active: {
					size: 48,
					fill: theme.node.active.fill,
					stroke: theme.node.active.stroke,
					lineWidth: 3,
					labelFontWeight: 600,
					halo: true,
					haloLineWidth: 10,
					haloStrokeOpacity: 0.14,
					haloStroke: theme.node.active.stroke
				},
				neighbor: {
					size: 44,
					fill: theme.node.neighbor.fill,
					stroke: theme.node.neighbor.stroke,
					lineWidth: 2.4
				},
				dimmed: {
					opacity: 0.42,
					labelOpacity: 0.48
				}
			}
		},
		edge: {
			type: "line",
			style: {
				stroke: theme.edgeStroke,
				lineWidth: 1.8,
				endArrow: false,
				labelPlacement: "center",
				labelAutoRotate: false,
				labelWordWrap: true,
				labelMaxWidth: "82%",
				labelMaxLines: 2,
				labelTextAlign: "center",
				labelFill: theme.edgeLabelFill,
				labelFontSize: 9,
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
					lineWidth: 2.6,
					labelFill: theme.text,
					opacity: 1
				},
				dimmed: {
					opacity: 0.24,
					labelOpacity: 0.42
				}
			}
		}
	};
}
