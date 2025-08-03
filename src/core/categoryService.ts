import { IElementCategory } from "./IElementCategory";
import { DEFAULT_CATEGORIES } from "./defaultCategories";

export class CategoryService {
    private static instance: CategoryService;
    private categories: IElementCategory[] = [];

    private constructor() {
        this.categories = [...DEFAULT_CATEGORIES];
    }

    public static getInstance(): CategoryService {
        if (!CategoryService.instance) {
            CategoryService.instance = new CategoryService();
        }
        return CategoryService.instance;
    }

    public getCategories(): IElementCategory[] {
        return [...this.categories].sort((a, b) => a.sortOrder - b.sortOrder);
    }

    public getCategoryById(id: string): IElementCategory | undefined {
        return this.categories.find(cat => cat.id === id);
    }

    public getCategoryByName(name: string): IElementCategory | undefined {
        return this.categories.find(cat => cat.name === name);
    }

    public addCategory(category: IElementCategory): void {
        if (this.categories.some(cat => cat.id === category.id)) {
            throw new Error(`Category with ID '${category.id}' already exists`);
        }
        this.categories.push(category);
    }

    public updateCategory(category: IElementCategory): void {
        const index = this.categories.findIndex(cat => cat.id === category.id);
        if (index === -1) {
            throw new Error(`Category with ID '${category.id}' not found`);
        }
        this.categories[index] = category;
    }

    public deleteCategory(id: string): void {
        if (!this.getCategoryById(id)?.isCustom) {
            throw new Error("Cannot delete default categories");
        }
        this.categories = this.categories.filter(cat => cat.id !== id);
    }

    public loadCategories(categories: IElementCategory[]): void {
        // Merge default categories with custom categories from settings
        const customCategories = categories.filter(cat => cat.isCustom);
        this.categories = [...DEFAULT_CATEGORIES, ...customCategories];
    }

    public getCustomCategories(): IElementCategory[] {
        return this.categories.filter(cat => cat.isCustom);
    }

    public getWrappingData(categoryId: string): { defaultWrapping: string; wrappings: string[] | null } | null {
        const category = this.getCategoryById(categoryId);
        if (!category) return null;
        
        return {
            defaultWrapping: category.defaultWrapping,
            wrappings: category.wrappings ?? null
        };
    }

    public getNextSortOrder(): number {
        return Math.max(...this.categories.map(cat => cat.sortOrder), -1) + 1;
    }
}
