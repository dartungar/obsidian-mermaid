import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

export let stateDiagramElements: IMermaidElement[] = [
	{
		id: crypto.randomUUID(),
		category: ElementCategory.StateDiagram,
		description: "a sample state diagram",
		content: `stateDiagram-v2
        [*] --> Still
        Still --> [*]
    
        Still --> Moving
        Moving --> Still
        Moving --> Crash
        Crash --> [*]`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.StateDiagram,
		description: "a sample state diagram with left-to-right direction",
		content: `stateDiagram-v2
        direction LR
        [*] --> Still
        Still --> [*]
    
        Still --> Moving
        Moving --> Still
        Moving --> Crash
        Crash --> [*]`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.StateDiagram,
		description: "node with description",
		content: `s2 : This is a state description`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.StateDiagram,
		description: "a transition",
		content: `s1 --> s2`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.StateDiagram,
		description: "a transition with label",
		content: `s1 --> s2: A transition`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.StateDiagram,
		description: "composite state",
		content: `
        [*] --> First
        state First {
            [*] --> second
            second --> [*]
        }`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.StateDiagram,
		description: "diagram with choice",
		content: `stateDiagram-v2
        state if_state <<choice>>
        [*] --> IsPositive
        IsPositive --> if_state
        if_state --> False: if n < 0
        if_state --> True : if n >= 0`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.StateDiagram,
		description: "diagram with fork",
		content: `stateDiagram-v2
        state fork_state <<fork>>
          [*] --> fork_state
          fork_state --> State2
          fork_state --> State3
    
          state join_state <<join>>
          State2 --> join_state
          State3 --> join_state
          join_state --> State4
          State4 --> [*]`,
		sortingOrder: 0,
		isPinned: false,
	},
	{
		id: crypto.randomUUID(),
		category: ElementCategory.StateDiagram,
		description: "a diagram with concurrency",
		content: `stateDiagram-v2
        [*] --> Active
    
        state Active {
            [*] --> NumLockOff
            NumLockOff --> NumLockOn : EvNumLockPressed
            NumLockOn --> NumLockOff : EvNumLockPressed
            --
            [*] --> CapsLockOff
            CapsLockOff --> CapsLockOn : EvCapsLockPressed
            CapsLockOn --> CapsLockOff : EvCapsLockPressed
            --
            [*] --> ScrollLockOff
            ScrollLockOff --> ScrollLockOn : EvScrollLockPressed
            ScrollLockOn --> ScrollLockOff : EvScrollLockPressed
        }`,
		sortingOrder: 0,
		isPinned: false,
	},
];
