// FormProviders.jsx
import React from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export const FormProviders = ({ formData, handleChange, isEdit }) => {
    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
            <Grid container spacing={2} flexDirection={"column"}>
                
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                        label="Nombre del Proveedor"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                        label="NIT"
                        name="nit"
                        value={formData.nit}
                        onChange={handleChange}
                        fullWidth
                        required
                        disabled={isEdit} // no debería cambiarse en edición
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                        label="Persona de Contacto"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                        label="Teléfono"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                <Grid item xs={12} sm={6} md={6}>
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
                        label="Dirección"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        multiline
                    />
                </Grid>

                {/* Estado */}
                <Grid item xs={12} sm={6} md={6}>
                    <TextField
                        select
                        label="Estado"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value={1}>Activo</MenuItem>
                        <MenuItem value={0}>Inactivo</MenuItem>
                    </TextField>
                </Grid>

            </Grid>
        </Box>
    );
};
