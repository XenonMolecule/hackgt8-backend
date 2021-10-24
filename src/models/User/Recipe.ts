import mongoose from 'mongoose';

export type Recipe = {
    _id?: string; // the unqiue id assigned to a dish. Let Mongo create this when you insert a document without any _id attribute
    name: string;
    spoonacularID: number;
    imageUrl: string;
    sourceUrl: string;
    healthScore: number;
    diets: string[];
    ketogenic: boolean;
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    ingredients: string[];
    instructions: string;
    foodIngredients: string[];
    summary: string;
}

export const RecipeSchema = new mongoose.Schema<Recipe>({
    name: { type: String, required: true, default: "New Recipe" },
    spoonacularID: { type: Number, required: true, default: 0 },
    imageUrl: { type: String, required: true, default: 'https://raw.githubusercontent.com/XenonMolecule/hackgt8-frontend/main/assets/images/mindfulbytes.png' },
    sourceUrl: { type: String, required: true, default: 'https://www.delish.com/cooking/recipe-ideas/recipes/a58702/easy-beef-wellington-recipe/' },
    healthScore: { type: Number, required: true, default: 0.0 },
    diets: { type: [String], required: true, default: [] },
    ketogenic: { type: Boolean, required: true, default: false },
    vegan: { type: Boolean, required: true, default: false },
    vegetarian: { type: Boolean, required: true, default: false },
    glutenFree: { type: Boolean, required: true, default: false },
    dairyFree: { type: Boolean, required: true, default: false },
    ingredients: { type: [String], required: true, default: [] },
    instructions: { type: String, required: true, default: 'Please follow the instructions at the link' },
    foodIngredients: { type: [String], required: true, default: [] },
    summary: { type: String, required: true, default: 'A tasty entree' },
});
