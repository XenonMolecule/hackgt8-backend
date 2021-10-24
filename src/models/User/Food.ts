import mongoose from 'mongoose';

export type Food = {
    _id?: string; // the unqiue id assigned to a dish. Let Mongo create this when you insert a document without any _id attribute
    foodName: string;
    category: string;
    quantity: number;
    expirationDate: Date;
    perishable: boolean;
    dateAdded: Date;
    color: string;
}

export const FoodSchema = new mongoose.Schema<Food>({
    foodName: { type: String, required: true, default: "New Food Item" },
    category: { type: String, required: true, default: "Beverages" },
    quantity: { type: Number, required: true, default: 0 },
    expirationDate: { type: Date, required: true, default: new Date() },
    perishable: { type: Boolean, required: true, default: false },
    dateAdded: { type: Date, required: true, default: new Date() },
    color: { type: String, required: true, default:'#86EA84' }
});
