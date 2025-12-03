import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;
        const [products, total] = await Promise.all([
            Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            Product.countDocuments(),
        ]);

        return NextResponse.json(
            { data:products, total, page, totalPages: Math.ceil(total / limit) },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener productos", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();
        const newProduct = await Product.create(data);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al crear producto", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        await connectDB();
        const { _id, ...data } = await req.json();
        const updated = await Product.findByIdAndUpdate(_id, data, { new: true });
        if (!updated) {
            return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
        }
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al actualizar producto", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const { id } = await req.json();
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
        }
        return NextResponse.json({ message: "Producto eliminado" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al eliminar producto", details: error.message },
            { status: 500 }
        );
    }
}
