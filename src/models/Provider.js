import mongoose, { Schema } from "mongoose";

const ProviderSchema = new Schema({
    name: { type: String, required: true },
    nit: { type: String, required: true, unique: true }, 
    contactName: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    state: { type: Number, enum: [1, 0], default: 1 },
    created: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Provider || mongoose.model("Provider", ProviderSchema, "providers");
