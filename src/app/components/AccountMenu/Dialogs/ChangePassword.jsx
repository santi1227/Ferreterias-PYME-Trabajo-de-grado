"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    Button,
    Stack,
    Typography,
    InputAdornment,
} from "@mui/material";
import { IoIosClose } from "react-icons/io";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import useUser from "@/app/hooks/useUser";

const DialogStyled = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        backgroundColor: theme.palette.grey[200],
        borderRadius: 16,
        padding: theme.spacing(3),
    },
    "& .MuiDialogActions-root": {
        borderRadius: 16,
        padding: theme.spacing(1),
    },
}));

export default function ChangePassword({ open, onClose }) {
    const user = useUser(); // obtener usuario actual
    console.log("user", user)
    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleUpdate = async () => {
        if (!password || !confirmPassword) {
            toast.error("Por favor completa todos los campos");
            return;
        }
        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Las contraseñas no coinciden");
            return;
        }

        try {
            setLoading(true);
            const res = await fetch("/api/users/change-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.userId,
                    newPassword: password,
                    confirmPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al actualizar contraseña");

            toast.success(data.message || "Contraseña actualizada correctamente");
            setPassword("");
            setConfirmPassword("");
            onClose();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogStyled onClose={onClose} open={open} aria-labelledby="change-password-dialog">
            <DialogTitle
                sx={{
                    m: 0,
                    p: 3,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                }}
                id="change-password-dialog"
            >
                Cambiar Contraseña
            </DialogTitle>

            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    color: "grey.500",
                    position: "absolute",
                    right: 8,
                    top: 8,
                }}
            >
                <IoIosClose size={26} />
            </IconButton>

            <DialogContent dividers>
                <Stack spacing={2}>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Por seguridad, asegúrate de que tu nueva contraseña sea segura.
                    </Typography>

                    <TextField
                        type={showPassword ? "text" : "password"}
                        label="Nueva Contraseña"
                        variant="outlined"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <IoEyeOffOutline size={20} />
                                        ) : (
                                            <IoEyeOutline size={20} />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        type={showConfirmPassword ? "text" : "password"}
                        label="Repetir Contraseña"
                        variant="outlined"
                        fullWidth
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? (
                                            <IoEyeOffOutline size={20} />
                                        ) : (
                                            <IoEyeOutline size={20} />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                        <Button variant="outlined" color="inherit" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            {loading ? "Actualizando..." : "Actualizar"}
                        </Button>
                    </Stack>
                </Stack>
            </DialogContent>
        </DialogStyled>
    );
}
