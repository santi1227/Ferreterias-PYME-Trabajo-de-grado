// FormUser.jsx
import React, { useEffect } from "react";
import useUser from '@/app/hooks/useUser';
// import { cookies } from "next/headers";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export const FormUsers = ({ formData, handleChange, isEdit }) => {
    console.log("isEdit", isEdit)
    const user = useUser();
    const currentUserRole = user?.rol && user.rol.toLowerCase() === 'empleado' ? "empleado" : "admin";
    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
            <Grid container spacing={2} flexDirection={"column"}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Usuario"
                        name="user_name"
                        value={formData.user_name}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        label="Teléfono"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                {!isEdit && ( 
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                )}

                {/* Select de rol */}
                <Grid item xs={12} sm={6} md={12}>
                    <TextField
                        select
                        label="Rol"
                        name="rol"
                        value={formData.rol}
                        onChange={handleChange}
                        fullWidth
                        disabled={currentUserRole !== "admin"}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="empleado">Empleado</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
        </Box>
    );
};
