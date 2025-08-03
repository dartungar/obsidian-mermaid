export interface IMermaidElement {
    id: string,
    description: string,
    content: string,
    categoryId: string, // Changed from ElementCategory enum to string ID
    sortingOrder: number,
    isPinned: boolean
}