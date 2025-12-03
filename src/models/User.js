import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    user_name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    rol: { type: String, enum: ["admin", "empleado"], default: "empleado" },
    state: { type: Number, enum: [1, 0], default: 1 },
    created: { type: Date, default: Date.now }
}, { timestamps: true });
export default mongoose.models.User || mongoose.model("User", UserSchema, "users");