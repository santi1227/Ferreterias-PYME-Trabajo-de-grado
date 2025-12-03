// lib/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Generar un token
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30m" }); 
}

// Verificar token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}
