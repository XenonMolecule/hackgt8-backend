import mongoose from 'mongoose';

export type FoodDocument = mongoose.Document & {
    _id?: string; // the unqiue id assigned to a user. Let Mongo create this when you insert a document without any _id attribute
    name: string;
    category: string;
    perishable: boolean;
    compostable: boolean;
    color: string;
    imageUrl: string;
    defaultExpirationDays: number;
}

const FoodSchema = new mongoose.Schema<FoodDocument>({
    name: { type: String, required: true, default: "New Food" },
    category: { type: String, required: true, default: "Beverages" },
    perishable: { type: Boolean, required: true, default: true },
    compostable: { type: Boolean, required: true, default: true },
    color: { type: String, required: true, default: "#86EA84" },
    imageUrl: { type: String, required: true, default: 'https://raw.githubusercontent.com/XenonMolecule/hackgt8-frontend/main/assets/images/mindfulbytes.png' },
    defaultExpirationDays: { type: Number, required: true, default: 5 }


}, { timestamps: true });

export const Food = mongoose.model<FoodDocument>('foods', FoodSchema);
