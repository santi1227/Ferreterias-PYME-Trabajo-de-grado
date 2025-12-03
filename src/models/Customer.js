import { Schema, model, models } from "mongoose";

const CustomerSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    documentType: { type: String },
    documentNumber: { type: String },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        postalCode: String,
    },
}, { timestamps: true });

export default models.Customer || model("Customer", CustomerSchema);
