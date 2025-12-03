import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Customer from "@/models/Customer";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [customers, total] = await Promise.all([
            Customer.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
            Customer.countDocuments(),
        ]);

        return NextResponse.json(
            { data: customers, total, page, totalPages: Math.ceil(total / limit) },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener clientes", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();
        const newCustomer = await Customer.create(data);
        return NextResponse.json(newCustomer, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al crear cliente", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        await connectDB();
        const { _id, ...data } = await req.json();

        const updated = await Customer.findByIdAndUpdate(_id, data, { new: true });
        if (!updated) {
            return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al actualizar cliente", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const { id } = await req.json();

        const deleted = await Customer.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Cliente no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ message: "Cliente eliminado" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al eliminar cliente", details: error.message },
            { status: 500 }
        );
    }
}
