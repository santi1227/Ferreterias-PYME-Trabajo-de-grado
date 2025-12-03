import mongoose, { Schema } from "mongoose";
import "./Product.js";
import "./Provider.js"; 

const PurchaseSchema = new Schema({
  provider: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  invoiceNumber: { type: String },
  created: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.Purchase || mongoose.model("Purchase", PurchaseSchema, "purchases");
