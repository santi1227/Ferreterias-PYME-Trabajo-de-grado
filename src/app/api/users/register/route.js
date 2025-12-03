import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ error: "El usuario o correo ya existen" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user_name: username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: "Usuario registrado con éxito 🎉" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
