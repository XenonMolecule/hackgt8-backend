import mongoose from 'mongoose';

export type Food = {
    _id?: string; // the unqiue id assigned to a dish. Let Mongo create this when you insert a document without any _id attribute
    foodID: string;
    quantity: number;
    expirationDate: Date;
    dateAdded: Date;
}

export const FoodSchema = new mongoose.Schema<Food>({
    foodID: { type: String, required: true, default: "New Food Item" },
    quantity: { type: Number, required: true, default: 0 },
    expirationDate: { type: Date, required: true, default: new Date() },
    dateAdded: { type: Date, required: true, default: new Date() },
});
