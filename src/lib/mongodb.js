import mongoose from "mongoose";

const MONGODB_URI = process.env.DB_URI;
if (!MONGODB_URI) {
  throw new Error("⚠️ Debes definir DB_URI en el archivo .env.local");
}

let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = (async () => {
        try {
            const conn = await mongoose.connect(MONGODB_URI, { bufferCommands: false });
            return conn;
        } catch (error) {
            console.error("❌ Error al conectar a MongoDB:", error);
            throw error;
        }
      })();
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
