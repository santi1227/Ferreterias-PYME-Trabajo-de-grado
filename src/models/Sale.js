import mongoose, { Schema, models } from "mongoose";

const SaleSchema = new Schema({
  customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true },

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

export default models.Sale || mongoose.model("Sale", SaleSchema);