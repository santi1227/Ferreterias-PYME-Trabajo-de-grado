import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Provider from "@/models/Provider";

// Obtener proveedores con paginación
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [providers, total] = await Promise.all([
            Provider.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            Provider.countDocuments(),
        ]);

        return NextResponse.json(
            { data:providers, total, page, totalPages: Math.ceil(total / limit) },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener proveedores", details: error.message },
            { status: 500 }
        );
    }
}

// Crear proveedor
export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();
        const newProvider = await Provider.create(data);
        return NextResponse.json(newProvider, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al crear proveedor", details: error.message },
            { status: 500 }
        );
    }
}

// Actualizar proveedor
export async function PUT(req) {
    try {
        await connectDB();
        const { _id, ...data } = await req.json();
        const updated = await Provider.findByIdAndUpdate(_id, data, { new: true });
        if (!updated) {
            return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });
        }
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al actualizar proveedor", details: error.message },
            { status: 500 }
        );
    }
}

// Eliminar proveedor
export async function DELETE(req) {
    try {
        await connectDB();
        const { id } = await req.json();
        const deleted = await Provider.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Proveedor no encontrado" }, { status: 404 });
        }
        return NextResponse.json({ message: "Proveedor eliminado" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al eliminar proveedor", details: error.message },
            { status: 500 }
        );
    }
}
