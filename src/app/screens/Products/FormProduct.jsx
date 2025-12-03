import React from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export const FormProduct = ({ formData, handleChange, handleBlur }) => {
    return (
        <Box sx={{ maxWidth: 900, mx: "auto", mt:3 }}>
            <Grid container spacing={2} flexDirection={"column"}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Código"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Nombre"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Categoría"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Precio de Compra"
                        name="purchasePrice"
                        type="number"
                        value={formData.purchasePrice}
                        onChange={handleChange}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Precio de Venta"
                        name="salePrice"
                        type="number"
                        value={formData.salePrice}
                        onChange={handleChange}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        label="Stock"
                        name="stock"
                        type="number"
                        value={formData.stock}
                        onChange={handleChange}
                        fullWidth
                        sx={{ minWidth: 250 }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Descripción"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                        sx={{ minWidth: 500 }}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
