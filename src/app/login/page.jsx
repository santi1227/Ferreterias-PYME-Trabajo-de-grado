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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
// Card con estilos personalizados
const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    [theme.breakpoints.up("sm")]: {
        width: "450px",
    },
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
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Error en el login ❌");
                setLoadingLogin(false);
                return;
            }

            toast.success("Login exitoso ✅");
            router.push("/dashboard");
        } catch (err) {
            toast.error("Error de conexión con el servidor ⚡");
        } finally {
            setLoadingLogin(false);
        }
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                background: "linear-gradient(135deg, #0a0f2c, #1a237e)",
            }}
        >
            <Card variant="outlined">
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                >
                    Sign in
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                    <FormControl>
                        <FormLabel htmlFor="username">Usuario</FormLabel>
                        <TextField
                            id="username"
                            name="username"
                            placeholder="Tu usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoFocus
                            required
                            fullWidth
                            variant="outlined"
                        />
                    </FormControl>

                    <FormControl>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Link
                                component="button"
                                type="button"
                                variant="body2"
                                sx={{ alignSelf: "baseline" }}
                                onClick={() => alert("Forgot password flow")}
                            >
                                Forgot your password?
                            </Link>
                        </Box>
                        <TextField
                            name="password"
                            placeholder="••••••"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            fullWidth
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleTogglePassword} edge="end">
                                            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </FormControl>

                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loadingLogin}
                        sx={{ py: 1.2, fontWeight: "bold" }}
                    >
                        {loadingLogin ? "Iniciando..." : "Sign in"}
                    </Button>

                    <Typography sx={{ textAlign: "center" }}>
                        Don’t have an account?{" "}
                        <Link href="/signup" variant="body2">
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Card>
        </Box>
    );
}
