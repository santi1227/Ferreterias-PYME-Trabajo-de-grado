import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { signToken } from "@/lib/auth";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await connectDB();
        const { username, password } = await req.json();
        const user = await User.findOne({ user_name: username });
        if (!user) {
            console.log("❌ Usuario no encontrado");
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            console.log("❌ Contraseña incorrecta");
            return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
        }

        const token = signToken({ id: user._id, username: user.user_name });
        const res = NextResponse.json({ message: "Login exitoso" });
        res.cookies.set(
            "token", JSON.stringify({ 
                token, 
                "userId": user._id,
                "userName": user.user_name, 
                "userEmail": user.email, 
                "userRol": user.rol, 
                "userPhone": user.phone, 
                "userCreated": user.created 
            }),
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 20,
                path: "/",
            }
        );
        return res;
    } catch (err) {
        console.error("🔥 Error en login:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
