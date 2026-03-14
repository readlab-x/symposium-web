/**
 * @param {{ darkMode?: boolean }} [options]
 * @returns {import("cytoscape").StylesheetJson}
 */
export function createRelationGraphStyles({ darkMode = false } = {}) {
	const palette = darkMode
		? {
				text: "#ece7da",
				mutedText: "#b7ab98",
				line: "rgba(183, 171, 152, 0.34)",
				lineActive: "rgba(214, 194, 158, 0.76)",
				personFill: "#3c3128",
				personBorder: "#d1b07a",
				deityFill: "#40302f",
				deityBorder: "#d7a0a0",
				placeFill: "#29382f",
				placeBorder: "#97c0a8",
				activeFill: "#f1e4ca",
				activeBorder: "#8a6a3f",
				neighborFill: "#463a32",
				neighborBorder: "#ccb182"
			}
		: {
				text: "#3b2d22",
				mutedText: "#7d6b58",
				line: "rgba(125, 107, 88, 0.28)",
				lineActive: "rgba(123, 94, 51, 0.72)",
				personFill: "#f5ebd8",
				personBorder: "#9c784a",
				deityFill: "#f3e3e1",
				deityBorder: "#a97373",
				placeFill: "#e7f0e9",
				placeBorder: "#6b8c74",
				activeFill: "#f1ddbc",
				activeBorder: "#6b5131",
				neighborFill: "#fbf3e5",
				neighborBorder: "#b08c5d"
			};

	return /** @type {import("cytoscape").StylesheetJson} */ ([
		{
			selector: "node",
			style: {
				label: "data(label)",
				shape: "ellipse",
				width: 34,
				height: 34,
				"background-color": palette.personFill,
				"border-width": 1.8,
				"border-color": palette.personBorder,
				color: palette.text,
				"font-size": 10,
				"text-wrap": "wrap",
				"text-max-width": 84,
				"text-valign": "bottom",
				"text-halign": "center",
				"text-margin-y": 12,
				"font-weight": 500,
				"overlay-opacity": 0
			}
		},
		{
			selector: 'node[type = "person"]',
			style: {
				"background-color": palette.personFill,
				"border-color": palette.personBorder
			}
		},
		{
			selector: 'node[type = "deity"]',
			style: {
				"background-color": palette.deityFill,
				"border-color": palette.deityBorder
			}
		},
		{
			selector: 'node[type = "place"]',
			style: {
				"background-color": palette.placeFill,
				"border-color": palette.placeBorder
			}
		},
		{
			selector: ".is-active",
			style: {
				width: 40,
				height: 40,
				"background-color": palette.activeFill,
				"border-color": palette.activeBorder,
				"border-width": 2.8,
				"font-size": 10.5,
				"font-weight": 600,
				"z-index": 3
			}
		},
		{
			selector: ".is-neighbor",
			style: {
				width: 36,
				height: 36,
				"background-color": palette.neighborFill,
				"border-color": palette.neighborBorder,
				"border-width": 2.1,
				"z-index": 2
			}
		},
		{
			selector: ".is-dimmed",
			style: {
				opacity: 0.45,
				"text-opacity": 0.48
			}
		},
		{
			selector: "edge",
			style: {
				label: "data(relation)",
				width: 1.5,
				"line-color": palette.line,
				"curve-style": "bezier",
				"target-arrow-shape": "none",
				"font-size": 8,
				color: palette.mutedText,
				"text-rotation": "autorotate",
				"text-background-opacity": 0,
				"text-margin-y": -4,
				opacity: 0.72
			}
		},
		{
			selector: ".is-active-edge",
			style: {
				width: 2.3,
				"line-color": palette.lineActive,
				color: palette.text,
				opacity: 1,
				"z-index": 1
			}
		}
	]);
}
