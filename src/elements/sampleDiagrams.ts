import { ElementCategory } from "src/core/ElementCategory";
import { IMermaidElement } from "src/core/IMermaidElement";

// diagrams to insert by default
export let sampleDiagrams: Record<ElementCategory, string> = {
    EntityRelationshipDiagram: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`,
    ClassDiagram: `class BankAccount
    BankAccount : +String owner
    BankAccount : +Bigdecimal balance
    BankAccount : +deposit(amount)
    BankAccount : +withdrawal(amount)`,
    Flowchart: "flowchart LR\nStart --> Stop",
    GanttChart: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2014-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in sec      :2014-01-12  , 12d
    another task      : 24d`,
    GitGraph: `gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    commit`,
    PieChart: `pie title /r/obsidianmd posts by type
    "Look at my awesome graph" : 85
    "Look at my cool dashboard" : 14
    "Moved from Notion, liking it" : 1`,
    RequirementDiagram: `    requirementDiagram

    requirement test_req {
    id: 1
    text: the test text.
    risk: high
    verifymethod: test
    }

    element test_entity {
    type: simulation
    }

    test_entity - satisfies -> test_req`,
    SequenceDiagram: `sequenceDiagram\nAlice->>John: Hello John, how are you?\nJohn-->>Alice: Great!\nAlice-)John: See you later!`,
    StateDiagram: `stateDiagram-v2
    [*] --> Still
    Still --> [*]

    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
    UserJourneyDiagram: `journey
    title My working day
    section Go to work
      Make tea: 5: Me
      Go upstairs: 3: Me
      Do work: 1: Me, Cat
    section Go home
      Go downstairs: 5: Me
      Sit down: 5: Me`,
      Mindmap: `mindmap
      Root
          A
            B
            C`,
      Timeline: `timeline
      title History of Social Media Platform
      2002 : LinkedIn
      2004 : Facebook
         : Google
      2005 : Youtube
      2006 : Twitter`,
      QuadrantChart: `quadrantChart
      title Reach and engagement of campaigns
      x-axis Low Reach --> High Reach
      y-axis Low Engagement --> High Engagement
      quadrant-1 We should expand
      quadrant-2 Need to promote
      quadrant-3 Re-evaluate
      quadrant-4 May be improved
      Campaign A: [0.3, 0.6]
      Campaign B: [0.45, 0.23]
      Campaign C: [0.57, 0.69]
      Campaign D: [0.78, 0.34]
      Campaign E: [0.40, 0.34]
      Campaign F: [0.35, 0.78]`,
      C4Diagram: `C4Context
      title System Context diagram for Internet Banking System
      Enterprise_Boundary(b0, "BankBoundary0") {
        Person(customerA, "Banking Customer A", "A customer of the bank, with personal bank accounts.")
        Person(customerB, "Banking Customer B")
        Person_Ext(customerC, "Banking Customer C", "desc")
    
        Person(customerD, "Banking Customer D", "A customer of the bank, <br/> with personal bank accounts.")
    
        System(SystemAA, "Internet Banking System", "Allows customers to view information about their bank accounts, and make payments.")
    
        Enterprise_Boundary(b1, "BankBoundary") {
    
        SystemDb_Ext(SystemE, "Mainframe Banking System", "Stores all of the core banking information about customers, accounts, transactions, etc.")
    
        System_Boundary(b2, "BankBoundary2") {
          System(SystemA, "Banking System A")
          System(SystemB, "Banking System B", "A system of the bank, with personal bank accounts. next line.")
        }
    
        System_Ext(SystemC, "E-mail system", "The internal Microsoft Exchange e-mail system.")
        SystemDb(SystemD, "Banking System D Database", "A system of the bank, with personal bank accounts.")
    
        Boundary(b3, "BankBoundary3", "boundary") {
          SystemQueue(SystemF, "Banking System F Queue", "A system of the bank.")
          SystemQueue_Ext(SystemG, "Banking System G Queue", "A system of the bank, with personal bank accounts.")
        }
        }
      }
    
      BiRel(customerA, SystemAA, "Uses")
      BiRel(SystemAA, SystemE, "Uses")
      Rel(SystemAA, SystemC, "Sends e-mails", "SMTP")
      Rel(SystemC, customerA, "Sends e-mails to")
    
      UpdateElementStyle(customerA, $fontColor="red", $bgColor="grey", $borderColor="red")
      UpdateRelStyle(customerA, SystemAA, $textColor="blue", $lineColor="blue", $offsetX="5")
      UpdateRelStyle(SystemAA, SystemE, $textColor="blue", $lineColor="blue", $offsetY="-10")
      UpdateRelStyle(SystemAA, SystemC, $textColor="blue", $lineColor="blue", $offsetY="-40", $offsetX="-50")
      UpdateRelStyle(SystemC, customerA, $textColor="red", $lineColor="red", $offsetX="-50", $offsetY="20")
    
      UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")`
}