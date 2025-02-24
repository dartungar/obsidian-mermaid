import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export const architectureElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.Architecture,
		description: "a sample architecture diagram",
		content: `architecture-beta
    group api(cloud)[API]

    service db(database)[Database] in api
    service disk1(disk)[Storage] in api
    service disk2(disk)[Storage] in api
    service server(server)[Server] in api

    db:L -- R:server
    disk1:T -- B:server
    disk2:T -- B:db
`,
		sortingOrder: 0,
		isPinned: false,
	},
]