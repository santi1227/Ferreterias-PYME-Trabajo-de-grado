"use client";
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    TextField,
    MenuItem,
    Button,
} from "@mui/material";
import toast from "react-hot-toast";

export const FormSale = ({ formData, isEdit, handleChange, handleDirectChange }) => {
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingIndex, setEditingIndex] = useState(null);
    const [tempProduct, setTempProduct] = useState({ product: "", quantity: 1, price: 0, subtotal: 0 });
    console.log("customers", customers);
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [customersRes, productsRes] = await Promise.all([
                    fetch("/api/customers?page=1&limit=100"),
                    fetch("/api/products?page=1&limit=100"),
                ]);
                const customersData = await customersRes.json();
                const productsData = await productsRes.json();
                setCustomers(customersData.data || []);
                setProducts(productsData.data || []);
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        if (formData && Array.isArray(formData.products) && isEdit) {
            const formattedProducts = formData.products.map((p) => ({
                product: typeof p.product === "object" ? p.product._id : p.product,
                quantity: p.quantity || 0,
                price: p.price || 0,
                subtotal: (p.quantity || 0) * (p.price || 0),
            }));

            const formattedCustomer =
                typeof formData.customer === "object"
                    ? formData.customer._id
                    : formData.customer;

            if (JSON.stringify(formData.products) !== JSON.stringify(formattedProducts)) {
                handleDirectChange("products", formattedProducts);
            }
            if (formData.customer !== formattedCustomer) {
                handleDirectChange("customer", formattedCustomer);
            }
        }
    }, [formData]);

    const handleTempChange = (field, value) => {
        setTempProduct(prev => {
            const updated = { ...prev, [field]: value };
            if (["product", "quantity", "price"].includes(field)) {
                const price = parseFloat(updated?.price || 0);
                const qty = parseFloat(updated.quantity || 0);
                updated.price = price;
                updated.subtotal = price * qty;
            }
            return updated;
        });
    };

    const handleSaveProduct = () => {
        if (!tempProduct.product || tempProduct.quantity <= 0) {
            toast.error("Selecciona un producto y una cantidad válida");
            return;
        }

        let updatedProducts = [...formData.products];
        const existingIndex = updatedProducts.findIndex(p => p.product === tempProduct.product);

        if (editingIndex !== null) {
            updatedProducts[editingIndex] = tempProduct;
        } else if (existingIndex !== -1) {
            const existing = updatedProducts[existingIndex];
            const newQuantity = existing.quantity + Number(tempProduct.quantity);
            const newSubtotal = newQuantity * Number(tempProduct.price || existing.price);

            updatedProducts[existingIndex] = {
                ...existing,
                quantity: newQuantity,
                subtotal: newSubtotal,
                price: existing.price,
            };
        } else {
            updatedProducts.push(tempProduct);
        }

        const newTotal = updatedProducts.reduce((acc, p) => acc + (p.subtotal || 0), 0);
        handleDirectChange("products", updatedProducts);
        handleDirectChange("total", newTotal);

        setTempProduct({ product: "", quantity: 1, price: 0, subtotal: 0 });
        setEditingIndex(null);
    };

    const handleEditProduct = index => {
        setEditingIndex(index);
        setTempProduct(formData.products[index]);
    };

    const handleDeleteProduct = index => {
        const updated = formData.products.filter((_, i) => i !== index);
        const newTotal = updated.reduce((acc, p) => acc + (p.subtotal || 0), 0);
        handleDirectChange("products", updated);
        handleDirectChange("total", newTotal);
    };

    if (loading) return <Typography>Cargando datos...</Typography>;

    return (
        <Box sx={{ maxWidth: 1000, mx: "auto", mt: 4 }}>
            <Typography variant="h6">Registrar Venta</Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    select
                    required
                    label="Cliente"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    fullWidth
                >
                    {customers.map(c => <MenuItem key={c._id} value={c._id}>{c.firstName}</MenuItem>)}
                </TextField>

                <TextField
                    required
                    label="Número de Factura"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    fullWidth
                />
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Producto</TableCell>
                        <TableCell align="center">Cantidad</TableCell>
                        <TableCell align="center">Precio</TableCell>
                        <TableCell align="center">Subtotal</TableCell>
                        <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {formData.products.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{products.find(p => p._id === item.product)?.name || "-"}</TableCell>
                            <TableCell align="center">{item.quantity}</TableCell>
                            <TableCell align="center">{item.price.toFixed(2)}</TableCell>
                            <TableCell align="center">{item.subtotal.toFixed(2)}</TableCell>
                            <TableCell align="center">
                                <IconButton color="primary" onClick={() => handleEditProduct(index)}>✏️</IconButton>
                                <IconButton color="error" onClick={() => handleDeleteProduct(index)}>🗑️</IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <TextField
                    select
                    required
                    label="Producto"
                    value={tempProduct.product}
                    onChange={(e) => handleTempChange("product", e.target.value)}
                    onBlur={(e) =>
                        handleTempChange(
                            "price",
                            products.find(p => p._id === e.target.value)?.salePrice || 0
                        )
                    }
                    fullWidth
                >
                    {products.map(p => <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>)}
                </TextField>

                <TextField
                    required
                    type="number"
                    label="Cantidad"
                    value={tempProduct.quantity}
                    onChange={(e) => handleTempChange("quantity", e.target.value)}
                    fullWidth
                />

                <TextField
                    required
                    type="number"
                    label="Precio de Venta"
                    value={tempProduct.price}
                    onChange={(e) => handleTempChange("price", e.target.value)}
                    fullWidth
                />

                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSaveProduct}
                    sx={{
                        paddingLeft: "20px",
                        paddingRight: "20px",
                        minWidth: "120px",
                        whiteSpace: "nowrap",
                        textTransform: "none",
                        fontSize: "14px",
                    }}
                >
                    {editingIndex !== null ? "Actualizar" : "Guardar"}
                </Button>
            </Box>

            <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                Total: ${formData.total.toFixed(2)}
            </Typography>
        </Box>
    );
};
