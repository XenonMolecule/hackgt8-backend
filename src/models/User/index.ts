import mongoose from 'mongoose';

export type UserDocument = mongoose.Document & {
    _id?: string; // the unqiue id assigned to a user. Let Mongo create this when you insert a document without any _id attribute
    name: string; // will split string in the frontend
    email: string;
    pushTokens: string[];
    auth0AccessToken: string;
    sustainable: boolean;
    healthy: boolean;
    allergens: string[];
    communityIDs: string[];
}

const userSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, required: true, default: "New User" },
    email: { type: String, unique: true, required: true, default: "email@example.com" }, // later down the line, we will make this optional for recipients
    pushTokens: { type: [String], required: true, default: [] }, // expo push tokens
    auth0AccessToken: { type: String, required: true, default: "invalid token" },
    sustainable: { type: Boolean, required: true, default: true },
    healthy: { type: Boolean, required: true, default: true },
    allergens: { type: [String], required: true, default: [] },
    communityIDs: { type: [String], required: true, default: [] }
}, { timestamps: true });

export const User = mongoose.model<UserDocument>('users', userSchema);
