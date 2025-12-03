import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(req, { params }) {
    try {
        await connectDB();
        const { code } = params;
        const product = await Product.findOne({ code }, { code: 1 });
        if (!product) {
            return NextResponse.json({ error: "Not Fount" }, { status: 404 });
        }
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { error: "Error al obtener data", details: error.message },
            { status: 500 }
        );
    }
}
