import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    purchasePrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },
    category: String,
    stock: { type: Number, default: 0 },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
