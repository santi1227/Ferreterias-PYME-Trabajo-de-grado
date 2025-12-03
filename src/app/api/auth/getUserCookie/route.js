import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const cookieStore = await cookies();
    const raw = cookieStore.get("token")?.value;

    if (!raw) {
        return Response.json({ error: "No autenticado" }, { status: 401 });
    }
    try {
        const parsed = JSON.parse(raw);
        return NextResponse.json(parsed);


    } catch (e) {
        return Response.json({ error: "Error al parsear la cookie" }, { status: 400 });
    }
};