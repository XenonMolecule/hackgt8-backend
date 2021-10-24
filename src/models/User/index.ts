import mongoose from 'mongoose';
import { Food, FoodSchema } from "./Food";
import {Recipe, RecipeSchema} from "./Recipe";

export type UserDocument = mongoose.Document & {
    _id?: string; // the unqiue id assigned to a user. Let Mongo create this when you insert a document without any _id attribute
    name: string; // will split string in the frontend
    email: string;
    pushTokens: string[];
    auth0AccessToken: string;
    personalized: boolean;
    sustainable: boolean;
    healthy: boolean;
    allergens: string[];
    communityIDs: string[];
    dietaryRestrictions: string[];
    inventory: Food[];
    pictureUrl: string;
    currentRecipes: Recipe[];
    recipesUpdated: boolean;
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, required: true, default: "New User" },
    email: { type: String, unique: true, required: true, default: "email@example.com" }, // later down the line, we will make this optional for recipients
    pushTokens: { type: [String], required: true, default: [] }, // expo push tokens
    auth0AccessToken: { type: String, required: true, default: "invalid token" },
    personalized: { type: Boolean, required: true, default: true},
    sustainable: { type: Boolean, required: true, default: true },
    healthy: { type: Boolean, required: true, default: true },
    allergens: { type: [String], required: true, default: [] },
    communityIDs: { type: [String], required: true, default: [] },
    dietaryRestrictions: { type: [String], required: true, default: [] },
    inventory: { type: [FoodSchema], required: true, default: [] },
    pictureUrl: {type: String, required: true, default: 'https://raw.githubusercontent.com/XenonMolecule/hackgt8-frontend/main/assets/images/mindfulbytes.png'},
    currentRecipes: { type: [RecipeSchema], required: true, default: [] },
    recipesUpdated: { type: Boolean, required: true, default: false }

}, { timestamps: true });

export const User = mongoose.model<UserDocument>('users', userSchema);
