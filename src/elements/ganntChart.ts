import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export let ganttChartElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.GanttChart,
		description: "simple gantt chart",
		content: `gantt
        title A Gantt Diagram
        dateFormat  YYYY-MM-DD
        section Section
        A task           :a1, 2014-01-01, 30d
        Another task     :after a1  , 20d
        section Another
        Task in sec      :2014-01-12  , 12d
        another task      : 24d`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.GanttChart,
		description: "rich gantt chart",
		content: `gantt
        dateFormat  YYYY-MM-DD
        title       Adding GANTT diagram functionality to mermaid
        excludes    weekends
    
        section A section
        Completed task            :done,    des1, 2014-01-06,2014-01-08
        Active task               :active,  des2, 2014-01-09, 3d
        Future task               :         des3, after des2, 5d
        Future task2              :         des4, after des3, 5d
    
        section Critical tasks
        Completed task in the critical line :crit, done, 2014-01-06,24h
        Implement parser and jison          :crit, done, after des1, 2d
        Create tests for parser             :crit, active, 3d
        Future task in critical line        :crit, 5d
        Create tests for renderer           :2d
        Add to mermaid                      :1d
        Functionality added                 :milestone, 2014-01-25, 0d
    
        section Documentation
        Describe gantt syntax               :active, a1, after des1, 3d
        Add gantt diagram to demo page      :after a1  , 20h
        Add another diagram to demo page    :doc1, after a1  , 48h
    
        section Last section
        Describe gantt syntax               :after doc1, 3d
        Add gantt diagram to demo page      :20h
        Add another diagram to demo page    :48h`,
		sortingOrder: 1,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.GanttChart,
		description: "milestones example",
		content: `gantt
        dateFormat HH:mm
        axisFormat %H:%M
        Initial milestone : milestone, m1, 17:49,2min
        taska2 : 10min
        taska3 : 5min
        Final milestone : milestone, m2, 18:14, 2min`,
		sortingOrder: 2,
		isPinned: false,
	},
];
