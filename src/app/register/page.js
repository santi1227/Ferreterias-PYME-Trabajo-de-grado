"use client";

import { useState } from "react";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    async function handleRegister(e) {
        e.preventDefault();

        if (!username || !email || !password) {
            setError("Todos los campos son obligatorios 🚨");
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Error al registrarse ❌");
                return;
            }
            setSuccess("Usuario registrado con éxito 🎉, ahora puedes iniciar sesión.");
            setError("");
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (err) {
            setError("Error de conexión con el servidor ⚡");
        }
    }

    return (
        <Container
            component="main"
            maxWidth="sm"
            sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}
        >
            <Paper elevation={3} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Registro
                </Typography>

                <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaUser />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        type="email"
                        label="Correo"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaEnvelope />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        fullWidth
                        margin="normal"
                        type="password"
                        label="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaLock />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {success}
                        </Alert>
                    )}

                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
                        Registrarse 🚀
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
