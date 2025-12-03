import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Purchase from "@/models/Purchase";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function GET() {
    try {
        await connectDB();
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                day: d.toLocaleDateString("es-ES", { weekday: "short" }),
                date: new Date(d.setHours(0, 0, 0, 0)),
            };
        });
        const stats = [];
        for (const { day, date } of last7Days) {
            const nextDay = new Date(date);
            nextDay.setDate(date.getDate() + 1);
            const comprasDelDia = await Purchase.aggregate([
                { $match: { createdAt: { $gte: date, $lt: nextDay } } },
                { $group: { _id: null, totalCompras: { $sum: "$total" } } },
            ]);
            stats.push({ day, compras: comprasDelDia[0]?.totalCompras || 0 });
        }
        let aiResponse = "Análisis no disponible";
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `Analiza estos datos de compras semanales: ${JSON.stringify(stats)}
                Indica brevemente:
                1. Un resumen claro de la tendencia general.
                2. Tres recomendaciones prácticas para mejorar las compras.
            `;
            const result = await model.generateContent(prompt);
            aiResponse = result.response.text();
        } catch (aiError) {
            console.error("Error en IA:", aiError);
            aiResponse = "🔍 Análisis temporalmente no disponible";
        }
        return NextResponse.json({ stats, resumen: aiResponse });

    } catch (error) {
        console.error("Error general:", error);
        return NextResponse.json({ error: "Error al obtener datos" }, { status: 500 });
    }
}