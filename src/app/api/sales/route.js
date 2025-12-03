import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Sale from "@/models/Sale";
import Product from "@/models/Product";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [sales, total] = await Promise.all([
            Sale.find()
                .populate("customer", "firstName lastName") // ← corregido
                .populate("products.product", "name")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Sale.countDocuments(),
        ]);

        return NextResponse.json(
            { data: sales, total, page, totalPages: Math.ceil(total / limit) },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error en GET /api/sales:", error);
        return NextResponse.json(
            { error: "Error al obtener ventas", details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const data = await req.json();

        const total = data.products.reduce(
            (acc, item) => acc + item.quantity * item.price,
            0
        );

        const newSale = await Sale.create({
            ...data,
            total,
        });
        for (const item of data.products) {
            const product = await Product.findById(item.product);

            if (product) {
                product.stock -= item.quantity;
                if (item.price > product.salePrice) {
                    product.salePrice = item.price;
                }

                await product.save();
            } else {
                console.warn(`⚠️ Producto con ID ${item.product} no encontrado.`);
            }
        }

        return NextResponse.json(newSale, { status: 201 });
    } catch (error) {
        console.error("❌ Error al crear venta:", error);
        return NextResponse.json(
            { error: "Error al crear venta", details: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req) {
    try {
        await connectDB();
        const { _id, ...data } = await req.json();

        if (data.products) {
            data.total = data.products.reduce(
                (acc, item) => acc + item.quantity * item.price,
                0
            );
        }

        const oldSale = await Sale.findById(_id);
        if (!oldSale) {
            return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
        }

        for (const oldItem of oldSale.products) {
            const product = await Product.findById(oldItem.product);
            if (product) {
                product.stock += oldItem.quantity;
                await product.save();
            }
        }

        for (const newItem of data.products) {
            const product = await Product.findById(newItem.product);
            if (product) {
                product.stock -= newItem.quantity;

                if (newItem.price > product.salePrice) {
                    product.salePrice = newItem.price;
                }

                await product.save();
            }
        }

        const updated = await Sale.findByIdAndUpdate(_id, data, { new: true })
            .populate("customer", "firstName lastName email") // ✔️ FIX
            .populate("products.product", "name");

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("❌ Error al actualizar venta:", error);
        return NextResponse.json(
            { error: "Error al actualizar venta", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const { id } = await req.json();

        const deleted = await Sale.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Venta no encontrada" }, { status: 404 });
        }

        return NextResponse.json({ message: "Venta eliminada" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al eliminar venta", details: error.message },
            { status: 500 }
        );
    }
}
