import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import Product from "@/models/Product";

export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1", 10);
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = (page - 1) * limit;

        const [purchases, total] = await Promise.all([
            Purchase.find()
                .populate("provider", "name")
                .populate("products.product", "name")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Purchase.countDocuments(),
        ]);

        return NextResponse.json(
            {
                data: purchases,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error en GET /api/purchases:", error);
        return NextResponse.json(
            { error: "Error al obtener compras", details: error.message },
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
        const newPurchase = await Purchase.create({
            ...data,
            total,
        });
        for (const item of data.products) {
            const product = await Product.findById(item.product);

            if (product) {
                product.stock += item.quantity;
                if (item.price > product.purchasePrice) {
                    product.purchasePrice = item.price;
                }

                await product.save();
            } else {
                console.warn(`⚠️ Producto con ID ${item.product} no encontrado.`);
            }
        }

        return NextResponse.json(newPurchase, { status: 201 });
    } catch (error) {
        console.error("❌ Error al crear compra:", error);
        return NextResponse.json(
            { error: "Error al crear compra", details: error.message },
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
        const oldPurchase = await Purchase.findById(_id);
        if (!oldPurchase) {
            return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
        }
        for (const oldItem of oldPurchase.products) {
            const product = await Product.findById(oldItem.product);
            if (product) {
                product.stock -= oldItem.quantity;
                await product.save();
            }
        }
        for (const newItem of data.products) {
            const product = await Product.findById(newItem.product);
            if (product) {
                product.stock += newItem.quantity;
                if (newItem.price > product.purchasePrice) {
                    product.purchasePrice = newItem.price;
                }
                await product.save();
            }
        }
        const updated = await Purchase.findByIdAndUpdate(_id, data, { new: true })
            .populate("provider", "name")
            .populate("products.product", "name");
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("❌ Error al actualizar compra:", error);
        return NextResponse.json(
            { error: "Error al actualizar compra", details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        await connectDB();
        const { id } = await req.json();
        const deleted = await Purchase.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Compra no encontrada" }, { status: 404 });
        }
        return NextResponse.json({ message: "Compra eliminada" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al eliminar compra", details: error.message },
            { status: 500 }
        );
    }
}
