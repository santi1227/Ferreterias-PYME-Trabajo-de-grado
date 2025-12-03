import mongoose, { Schema } from "mongoose";

const InventoryMovementSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    type: { type: String, enum: ["entrada", "salida"], required: true },
    quantity: { type: Number, required: true },
    referenceId: { type: Schema.Types.ObjectId }, // id de la venta o compra
    created: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.InventoryMovement || mongoose.model("InventoryMovement", InventoryMovementSchema, "inventory_movements");
