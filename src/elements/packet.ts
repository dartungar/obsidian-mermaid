
import { IMermaidElement } from "src/core/IMermaidElement";

export const packetElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		categoryId: "packet",
		description: "a sample packet diagram",
		content: `packet-beta
title UDP Packet
0-15: "Source Port"
16-31: "Destination Port"
32-47: "Length"
48-63: "Checksum"
64-95: "Data (variable length)"
`,
		sortingOrder: 0,
		isPinned: false,
	},
]
