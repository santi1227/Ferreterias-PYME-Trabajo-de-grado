import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PUT(req) {
    try {
        await connectDB();

        const { userId, newPassword, confirmPassword } = await req.json();

        if (!userId || !newPassword || !confirmPassword) {
            return NextResponse.json(
                { error: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Contraseña actualizada correctamente" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error al cambiar la contraseña", details: error.message },
            { status: 500 }
        );
    }
}
