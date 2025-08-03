
import { IMermaidElement } from "src/core/IMermaidElement";

export let timelineElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		categoryId: "timeline",
		description: "sample timeline",
		content: `timeline
		title History of Social Media Platform
		2002 : LinkedIn
		2004 : Facebook
			 : Google
		2005 : Youtube
		2006 : Twitter`,
		sortingOrder: 1,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "timeline",
		description: "timeline with grouping",
		content: `timeline
		title Timeline of Industrial Revolution
		section 17th-20th century
			Industry 1.0 : Machinery, Water power, Steam <br>power
			Industry 2.0 : Electricity, Internal combustion engine, Mass production
			Industry 3.0 : Electronics, Computers, Automation
		section 21st century
			Industry 4.0 : Internet, Robotics, Internet of Things
			Industry 5.0 : Artificial intelligence, Big data,3D printing`,
		sortingOrder: 2,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		categoryId: "timeline",
		description: "timeline with Forest theme. see the docs for additional themes",
		content: `%%{init: { 'logLevel': 'debug', 'theme': 'forest' } }%%
		timeline
			title History of Social Media Platform
			  2002 : LinkedIn
			  2004 : Facebook : Google
			  2005 : Youtube
			  2006 : Twitter
			  2007 : Tumblr
			  2008 : Instagram
			  2010 : Pinterest`,
		sortingOrder: 3,
		isPinned: false,
	}
];
