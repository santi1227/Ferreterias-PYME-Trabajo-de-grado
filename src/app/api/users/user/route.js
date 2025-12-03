import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            User.countDocuments(),
        ]);
        const safeUsers = users.map(user => ({
            ...user._doc,
            password: "********"
        }));

        return NextResponse.json(
            { data:users, safeUsers, total, page, totalPages: Math.ceil(total / limit) },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener Usuarios", details: error.message },
            { status: 500 }
        );
    }
}



export async function POST(req) {
    try {
        await connectDB();
        const { user_name, password, email, phone, rol, state } = await req.json();
        const existingUser = await User.findOne({ user_name });
        if (existingUser) {
            return NextResponse.json({ error: "El usuario ya existe" },{ status: 400 });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            user_name,
            password: hashedPassword,
            email,
            phone,
            rol: rol || "empleado",
            state: state ?? 1,
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al crear usuario", details: error.message },
            { status: 500 }
        );
    }
}


export async function PUT(req) {
    try {
        await connectDB();
        const { _id, password, ...data } = await req.json();

        if (!_id) {
            return NextResponse.json({ error: "Falta el _id del usuario" }, { status: 400 });
        }
        if (password && password.trim() !== "") {
            data.password = await bcrypt.hash(password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(_id, data, { new: true });
        if (!updatedUser) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
        }
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al actualizar usuario", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Falta el parámetro 'id'" },
                { status: 400 }
            );
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return NextResponse.json(
                { error: "Usuario no encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Usuario eliminado correctamente" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error al eliminar usuario", details: error.message },
            { status: 500 }
        );
    }
}

