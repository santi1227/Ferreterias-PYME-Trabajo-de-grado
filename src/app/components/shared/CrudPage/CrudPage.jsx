"use client";

import React, { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Divider,
    alpha,
} from "@mui/material";

import { styled } from "@mui/material/styles";

import { DataGrid } from "@mui/x-data-grid";

import { IoMdAddCircle } from "react-icons/io";

import toast from "react-hot-toast";

import ToasterGeneric from "@/app/components/others/ToasterGeneric";
import LoadingOverlay from "@/app/components/others/LoadingOverlay";

import { Dialog } from "@/app/components/others/Dialog";

/* =========================
   STYLES
========================= */

const StyledCard = styled(Card)(() => ({

    background:
        "linear-gradient(145deg, rgba(15,23,42,0.88), rgba(30,41,59,0.82))",

    backdropFilter: "blur(18px)",

    border:
        "1px solid rgba(255,255,255,0.08)",

    borderRadius: "28px",

    boxShadow: `
        0 12px 40px rgba(0,0,0,0.35),
        inset 0 1px 0 rgba(255,255,255,0.05)
    `,

    marginBottom: "24px",

    overflow: "hidden",
}));

export default function CrudPage({
    title,
    apiEndpoint,
    model,
    columns,
    FormComponent,
}) {

    /* =========================
       STATES
    ========================= */

    const [openDialogDelete, setOpenDialogDelete] =
        useState(false);

    const [openDialogCreate, setOpenDialogCreate] =
        useState(false);

    const [formData, setFormData] =
        useState(() => ({ ...model }));

    const [openDialogEdit, setOpenDialogEdit] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [pageSize, setPageSize] =
        useState(5);

    const [rowCount, setRowCount] =
        useState(0);

    const [data, setData] =
        useState([]);

    const [page, setPage] =
        useState(0);

    /* =========================
       HANDLE CHANGE
    ========================= */

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name.includes(".")) {

            const [parent, child] =
                name.split(".");

            setFormData((prev) => ({
                ...prev,

                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));

        } else {

            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleDirectChange = (name, value) => {

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    /* =========================
       HANDLE BLUR
    ========================= */

    const handleBlur = (e) => {

        if (e.target.name === "code") {

            const code = e.target.value.trim();

            if (code) {
                fetchProductByCode(code);
            }
        }
    };

    /* =========================
       VALIDATE CODE
    ========================= */

    const fetchProductByCode = async (code) => {

        try {

            const res = await fetch(
                `${apiEndpoint}/${code}`
            );

            const data = await res.json();

            if (data && "_id" in data) {

                setFormData({ ...model });

                toast.error("El código ya existe");
            }

        } catch (error) {

            console.error(error);
        }
    };

    /* =========================
       FETCH DATA
    ========================= */

    useEffect(() => {

        const fetchData = async () => {

            setLoading(true);

            try {

                const res = await fetch(
                    `${apiEndpoint}?page=${page + 1}&limit=${pageSize}`
                );

                const json = await res.json();

                setData(json.data || []);

                setRowCount(json.total);

            } catch (error) {

                console.error(
                    "Error cargando datos:",
                    error
                );

            } finally {

                setLoading(false);
            }
        };

        fetchData();

    }, [page, pageSize, apiEndpoint]);

    /* =========================
       VALIDATE FORM
    ========================= */

    const validateFormData = () => {

        for (const [key, value] of Object.entries(formData)) {

            if (
                [
                    "created",
                    "updatedAt",
                    "createdAt",
                    "id",
                    "_id",
                ].includes(key)
            ) continue;

            if (
                typeof value === "string" &&
                value.trim() === ""
            ) {

                toast.error(
                    `Por favor completa el campo "${key}".`
                );

                return false;
            }

            if (
                Array.isArray(value) &&
                value.length === 0
            ) {

                toast.error(
                    `El campo "${key}" debe tener al menos un elemento.`
                );

                return false;
            }

            if (
                typeof value === "number" &&
                (isNaN(value) || value <= 0)
            ) {

                toast.error(
                    `El campo "${key}" debe tener un valor válido.`
                );

                return false;
            }
        }

        return true;
    };

    /* =========================
       CREATE
    ========================= */

    const handleCreate = async () => {

        if (!validateFormData()) return;

        setLoading(true);

        try {

            const res = await fetch(apiEndpoint, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(formData),
            });

            if (!res.ok) {

                const err = await res.json();

                toast.error(
                    err.error || "Error al crear"
                );

                return;
            }

            const newItem = await res.json();

            setData((prev) => [newItem, ...prev]);

            setRowCount((prev) => prev + 1);

            setOpenDialogCreate(false);

            setFormData({ ...model });

            toast.success("Creado exitosamente");

        } catch (error) {

            console.error(error);

            toast.error(
                "Error inesperado al crear"
            );

        } finally {

            setLoading(false);
        }
    };

    /* =========================
       EDIT
    ========================= */

    const handleEdit = async () => {

        setLoading(true);

        try {

            const res = await fetch(apiEndpoint, {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify(formData),
            });

            if (!res.ok) {

                toast.error(
                    "Error al actualizar"
                );

                return;
            }

            const updated = await res.json();

            setData((prev) =>
                prev.map((i) =>
                    i._id === updated._id
                        ? updated
                        : i
                )
            );

            setOpenDialogEdit(false);

            setFormData({ ...model });

            toast.success(
                "Actualizado exitosamente"
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    /* =========================
       DELETE
    ========================= */

    const handleDelete = async () => {

        setLoading(true);

        try {

            const res = await fetch(apiEndpoint, {
                method: "DELETE",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    id: formData._id,
                }),
            });

            if (!res.ok) {

                toast.error(
                    "Error al eliminar"
                );

                return;
            }

            setData((prev) =>
                prev.filter(
                    (i) => i._id !== formData._id
                )
            );

            setRowCount((prev) => prev - 1);

            setOpenDialogDelete(false);

            toast.success(
                "Eliminado exitosamente"
            );

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);
        }
    };

    return (

        <Box sx={{ width: "100%" }}>

            {/* HEADER */}

            <StyledCard>

                <CardContent
                    sx={{
                        p: 4,
                    }}
                >

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={2}
                    >

                        <Box>

                            <Typography
                                variant="h4"
                                sx={{
                                    color: "#ffffff",

                                    fontWeight: 800,

                                    letterSpacing: 0.5,

                                    mb: 1,
                                }}
                            >
                                {title}
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color:
                                        "rgba(255,255,255,0.72)",

                                    fontSize: "0.95rem",
                                }}
                            >
                                Gestiona y administra
                                la información del sistema.
                            </Typography>

                        </Box>

                        <Button
                            onClick={() =>
                                setOpenDialogCreate(true)
                            }

                            variant="contained"

                            startIcon={
                                <IoMdAddCircle size={24} />
                            }

                            sx={{

                                borderRadius: "16px",

                                px: 3.5,

                                py: 1.4,

                                textTransform: "none",

                                fontWeight: "bold",

                                fontSize: "0.95rem",

                                background:
                                    "linear-gradient(135deg, #22c55e, #16a34a)",

                                boxShadow:
                                    "0 10px 25px rgba(34,197,94,0.35)",

                                transition: "0.25s",

                                "&:hover": {

                                    transform:
                                        "translateY(-2px)",

                                    background:
                                        "linear-gradient(135deg, #16a34a, #15803d)",

                                    boxShadow:
                                        "0 14px 30px rgba(34,197,94,0.45)",
                                },
                            }}
                        >
                            Crear registro
                        </Button>

                    </Box>

                </CardContent>

            </StyledCard>

            {/* TABLE */}

            <StyledCard>

                <Box sx={{ height: 680 }}>

                    <DataGrid
                        rows={data}

                        getRowId={(row) => row._id}

                        pagination

                        paginationMode="server"

                        rowCount={rowCount}

                        paginationModel={{
                            page,
                            pageSize,
                        }}

                        onPaginationModelChange={(model) => {

                            setPage(model.page);

                            setPageSize(model.pageSize);
                        }}

                        pageSizeOptions={[
                            5,
                            10,
                            20,
                        ]}

                        loading={loading}

                        columns={columns({
                            onEdit: (row) => {

                                setFormData(row);

                                setOpenDialogEdit(true);
                            },

                            onDelete: (row) => {

                                setFormData(row);

                                setOpenDialogDelete(true);
                            },
                        })}

                        sx={{

                            border: "none",

                            "--DataGrid-containerBackground": "transparent",

                            color: "#f8fafc",

                            background:
                                "transparent",

                            /* HEADER */

                            "& .MuiDataGrid-columnHeaders": {

                                background:
                                    "linear-gradient(90deg, #0f172a, #1e293b)",

                                color: "#ffffff",

                                borderBottom:
                                    "1px solid rgba(255,255,255,0.08)",

                                minHeight:
                                    "62px !important",
                            },

                            "& .MuiDataGrid-columnHeader": {

                                background: "transparent",

                                color: "#ffffff",
                            },

                            "& .MuiDataGrid-columnHeaderTitle": {

                                fontWeight: 700,

                                fontSize: "0.95rem",

                                color: "#ffffff",

                                letterSpacing: 0.3,
                            },

                            "& .MuiDataGrid-columnHeaderTitle": {

                                fontWeight: 700,

                                fontSize: "0.95rem",

                                color: "#ffffff",

                                letterSpacing: 0.3,
                            },

                            "& .MuiDataGrid-columnSeparator": {
                                display: "none",
                            },

                            /* ROWS */

                            "& .MuiDataGrid-row": {

                                transition:
                                    "all 0.2s ease",

                                borderBottom:
                                    "1px solid rgba(255,255,255,0.04)",
                            },

                            "& .MuiDataGrid-row:hover": {

                                background:
                                    alpha(
                                        "#ffffff",
                                        0.06
                                    ),

                                transform:
                                    "scale(1.001)",
                            },
                            "& .MuiDataGrid-row.Mui-selected": {

                                background:
                                    "rgba(255,255,255,0.08) !important",
                            },

                            "& .MuiDataGrid-row.Mui-selected:hover": {

                                background:
                                    "rgba(255,255,255,0.12) !important",
                            },

                            "& .MuiDataGrid-cell": {

                                borderBottom:
                                    "none",

                                color: "#e2e8f0",

                                fontSize: "0.93rem",

                                fontWeight: 500,

                                display: "flex",

                                alignItems: "center",
                            },

                            "& .MuiDataGrid-cell:focus": {
                                outline: "none",
                            },

                            "& .MuiDataGrid-columnHeader:focus": {
                                outline: "none",
                            },

                            /* FOOTER */

                            "& .MuiDataGrid-footerContainer": {

                                borderTop:
                                    "1px solid rgba(255,255,255,0.08)",

                                background:
                                    "rgba(255,255,255,0.03)",

                                color: "#fff",
                            },

                            "& .MuiTablePagination-root": {
                                color: "#ffffff",
                            },

                            "& .MuiTablePagination-selectIcon": {
                                color: "#ffffff",
                            },

                            "& .MuiSvgIcon-root": {
                                color: "#ffffff",
                            },

                            /* CHECKBOX */

                            "& .MuiCheckbox-root": {
                                color:
                                    "#4ade80 !important",
                            },

                            /* SCROLLBAR */

                            "& ::-webkit-scrollbar": {
                                width: 10,
                                height: 10,
                            },

                            "& ::-webkit-scrollbar-thumb": {

                                background:
                                    "rgba(255,255,255,0.15)",

                                borderRadius: 10,
                            },

                            "& ::-webkit-scrollbar-track": {
                                background:
                                    "transparent",
                            },
                        }}
                    />

                </Box>

            </StyledCard>

            {/* DELETE */}

            {openDialogDelete && (

                <ToasterGeneric
                    open={openDialogDelete}

                    title="Confirmar Eliminación"

                    message="¿Seguro que deseas eliminar este registro?"

                    confirmText="Eliminar"

                    cancelText="Cancelar"

                    onConfirm={handleDelete}

                    onCancel={() => {

                        setOpenDialogDelete(false);

                        setFormData({ ...model });
                    }}
                />
            )}

            {/* CREATE / EDIT */}

            {(openDialogCreate || openDialogEdit) && (

                <Dialog
                    openDialog={
                        openDialogEdit ||
                        openDialogCreate
                    }

                    widthDialog="sm"

                    title={
                        openDialogEdit
                            ? "Editar Registro"
                            : "Crear Registro"
                    }

                    content={

                        <FormComponent
                            formData={formData}

                            handleChange={
                                handleChange
                            }

                            handleBlur={handleBlur}

                            handleDirectChange={
                                handleDirectChange
                            }

                            isEdit={
                                openDialogEdit
                            }
                        />
                    }

                    actions={

                        <>
                            <Button
                                onClick={() => {

                                    setFormData({
                                        ...model,
                                    });

                                    setOpenDialogCreate(false);

                                    setOpenDialogEdit(false);
                                }}

                                variant="contained"

                                sx={{

                                    background:
                                        "linear-gradient(135deg, #ef4444, #dc2626)",

                                    color: "#ffffff",

                                    borderRadius: "14px",

                                    px: 3,

                                    py: 1,

                                    textTransform: "none",

                                    fontWeight: "bold",

                                    boxShadow:
                                        "0 8px 20px rgba(239,68,68,0.35)",

                                    transition: "0.25s",

                                    "&:hover": {

                                        background:
                                            "linear-gradient(135deg, #dc2626, #b91c1c)",

                                        transform:
                                            "translateY(-2px)",

                                        boxShadow:
                                            "0 12px 24px rgba(239,68,68,0.45)",
                                    },
                                }}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="contained"

                                onClick={
                                    openDialogEdit
                                        ? handleEdit
                                        : handleCreate
                                }

                                sx={{

                                    borderRadius:
                                        "14px",

                                    px: 3,

                                    py: 1,

                                    textTransform:
                                        "none",

                                    fontWeight:
                                        "bold",

                                    background:
                                        "linear-gradient(135deg, #22c55e, #16a34a)",

                                    boxShadow:
                                        "0 8px 20px rgba(34,197,94,0.35)",
                                }}
                            >
                                {openDialogEdit
                                    ? "Actualizar"
                                    : "Crear"}
                            </Button>
                        </>
                    }

                    openLoadingOverlay={loading}
                />
            )}

            {loading && (
                <LoadingOverlay
                    loading={loading}
                />
            )}

        </Box>
    );
}