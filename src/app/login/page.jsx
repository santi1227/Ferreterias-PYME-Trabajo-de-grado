
"use client";

import React, { useState } from "react";
import {
    Box,
    Button,
    Card as MuiCard,
    Checkbox,
    FormLabel,
    FormControl,
    FormControlLabel,
    Link,
    TextField,
    Typography,
    InputAdornment,
    IconButton,
    Divider,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { MdInventory2 } from "react-icons/md";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    maxWidth: "450px",
    padding: theme.spacing(5),
    borderRadius: "24px",
    backdropFilter: "blur(12px)",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
    gap: theme.spacing(3),
}));

export default function LoginCard() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);

    const handleTogglePassword = () => setShowPassword(!showPassword);

    async function handleSubmit(e) {
        e.preventDefault();

        setLoadingLogin(true);

        if (!username || !password) {
            toast.error("Todos los campos son obligatorios 🚨");
            setLoadingLogin(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Error en el login ❌");
                setLoadingLogin(false);
                return;
            }

            toast.success("Bienvenido 🚀");
            router.push("/dashboard");

        } catch (err) {
            toast.error("Error de conexión ⚡");
        } finally {
            setLoadingLogin(false);
        }
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                overflow: "hidden",

                background: `
            radial-gradient(circle at top left, rgba(34,197,94,0.25), transparent 25%),
            radial-gradient(circle at bottom right, rgba(59,130,246,0.25), transparent 25%),
            linear-gradient(135deg, #020617 0%, #0f172a 40%, #111827 100%)
        `,
            }}
        >
            {/* Glow Effect 1 */}
            <Box
                sx={{
                    position: "absolute",
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    background: "rgba(34,197,94,0.18)",
                    filter: "blur(120px)",
                    top: -100,
                    left: -100,
                }}
            />

            {/* Glow Effect 2 */}
            <Box
                sx={{
                    position: "absolute",
                    width: 350,
                    height: 350,
                    borderRadius: "50%",
                    background: "rgba(59,130,246,0.18)",
                    filter: "blur(120px)",
                    bottom: -120,
                    right: -120,
                }}
            />
            <Card>

                {/* Logo */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background:
                                "linear-gradient(135deg, #22c55e, #16a34a)",
                            boxShadow: "0 8px 25px rgba(34,197,94,0.4)",
                        }}
                    >
                        <MdInventory2 size={40} color="white" />
                    </Box>

                    <Typography
                        variant="h4"
                        sx={{
                            color: "white",
                            fontWeight: "bold",
                            mt: 1,
                        }}
                    >
                        Ferretería Inventario
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            color: "rgba(255,255,255,0.7)",
                            textAlign: "center",
                        }}
                    >
                        Sistema de gestión para ferreterías PYME
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

                {/* Formulario */}
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <FormControl>
                        <FormLabel
                            htmlFor="username"
                            sx={{ color: "rgba(255,255,255,0.8)", mb: 1 }}
                        >
                            Usuario
                        </FormLabel>

                        <TextField
                            id="username"
                            placeholder="Ingresa tu usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            autoFocus
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "14px",
                                    color: "white",
                                    background: "rgba(255,255,255,0.05)",
                                },
                            }}
                        />
                    </FormControl>

                    <FormControl>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 1,
                            }}
                        >
                            <FormLabel
                                htmlFor="password"
                                sx={{ color: "rgba(255,255,255,0.8)" }}
                            >
                                Contraseña
                            </FormLabel>


                        </Box>

                        <TextField
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            variant="outlined"
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "14px",
                                    color: "white",
                                    background: "rgba(255,255,255,0.05)",
                                },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleTogglePassword}
                                        >
                                            {showPassword ? (
                                                <IoEyeOffOutline color="white" />
                                            ) : (
                                                <IoEyeOutline color="white" />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Checkbox
                                sx={{
                                    color: "rgba(255,255,255,0.7)",
                                }}
                            />
                        }
                        label={
                            <Typography
                                sx={{
                                    color: "rgba(255,255,255,0.8)",
                                }}
                            >
                                Recordarme
                            </Typography>
                        }
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loadingLogin}
                        sx={{
                            py: 1.5,
                            borderRadius: "14px",
                            fontWeight: "bold",
                            fontSize: "1rem",
                            textTransform: "none",
                            background:
                                "linear-gradient(135deg, #22c55e, #16a34a)",
                            boxShadow:
                                "0 8px 20px rgba(34,197,94,0.35)",
                            "&:hover": {
                                background:
                                    "linear-gradient(135deg, #16a34a, #15803d)",
                            },
                        }}
                    >
                        {loadingLogin ? "Ingresando..." : "Iniciar Sesión"}
                    </Button>


                </Box>
            </Card>
        </Box >
    );
}

