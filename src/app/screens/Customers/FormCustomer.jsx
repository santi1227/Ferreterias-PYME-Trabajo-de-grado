import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export const FormCustomer = ({ formData, handleChange, handleBlur }) => {
    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt: 3 }}>
            <Grid container spacing={2} flexDirection={"column"}>

                {/* Nombre */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Nombre"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>

                {/* Apellido */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Apellido"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>

                {/* Email */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>

                {/* Teléfono */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Teléfono"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>

                {/* Tipo de documento */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Tipo de Documento"
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleChange}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>

                {/* Número de documento */}
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Número de Documento"
                        name="documentNumber"
                        value={formData.documentNumber}
                        onChange={handleChange}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>

                {/* DIRECCIÓN */}
                {/* Calle */}
                <Grid item xs={12}>
                    <TextField
                        label="Calle"
                        name="address.street"
                        value={formData.address?.street || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                {/* Ciudad */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Ciudad"
                        name="address.city"
                        value={formData.address?.city || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                {/* Estado */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Estado / Departamento"
                        name="address.state"
                        value={formData.address?.state || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                {/* País */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="País"
                        name="address.country"
                        value={formData.address?.country || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

                {/* Código postal */}
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Código Postal"
                        name="address.postalCode"
                        value={formData.address?.postalCode || ""}
                        onChange={handleChange}
                        fullWidth
                    />
                </Grid>

            </Grid>
        </Box>
    );
};
