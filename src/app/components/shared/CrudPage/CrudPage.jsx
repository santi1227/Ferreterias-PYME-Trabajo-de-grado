"use client";

import React, { useEffect, useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import { DataGrid } from "@mui/x-data-grid";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import toast from "react-hot-toast";
import ToasterGeneric from "@/app/components/others/ToasterGeneric";
import LoadingOverlay from "@/app/components/others/LoadingOverlay";
import { Dialog } from "@/app/components/others/Dialog";

export default function CrudPage({
    title,
    apiEndpoint,
    model,
    columns,
    FormComponent
}) {
    
    const [openDialogDelete, setOpenDialogDelete] = useState(false);
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [formData, setFormData] = useState(() => ({ ...model }));
    const [openDialogEdit, setOpenDialogEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0); 
    // console.log("formData", formData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleDirectChange = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

    const handleBlur = (e) => {
        if (e.target.name === "code") {
            const code = e.target.value.trim();
            if (code) {
                fetchProductByCode(code);
            }
        }
    }

    const fetchProductByCode = async (code) => {
        try {
            const res = await fetch(`${apiEndpoint}/${code}`, { method: "GET" });
            const data = await res.json();
            if (data && '_id' in data){
                setFormData({ ...model });
                toast.error("El código ya existe");
            }
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${apiEndpoint}?page=${page + 1}&limit=${pageSize}`);
                const json = await res.json();
                setData(json.data || []);
                setRowCount(json.total);
            } catch (error) {
                console.error("Error cargando datos:", error);
            }
            setLoading(false);
        };
        fetchData();
    }, [page, pageSize, apiEndpoint]);
    
    const validateFormData = () => {
        for (const [key, value] of Object.entries(formData)) {
            if (["created", "updatedAt", "createdAt","id", "_id"].includes(key)) continue;
            if (typeof value === "string" && value.trim() === "") {
                toast.error(`Por favor completa el campo "${key}".`);
                return false;
            }
            if (Array.isArray(value) && value.length === 0) {
                toast.error(`El campo "${key}" debe tener al menos un elemento.`);
                return false;
            }
            if (typeof value === "number" && (isNaN(value) || value <= 0)) {
                toast.error(`El campo "${key}" debe tener un valor numérico válido.`);
                return false;
            }
            if (typeof value === "object" && value !== null && Object.keys(value).length === 0) {
                toast.error(`El campo "${key}" no puede estar vacío.`);
                return false;
            }
        }
        return true;
    };

    const handleCreate = async () => {
        if (!formData) return;
        if (!validateFormData()) return;
        setLoading(true);
        try {
            const res = await fetch(apiEndpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                setLoading(false);
                const err = await res.json();
                return toast.error(err.error || "Error al crear");
            }
            const newItem = await res.json();
            setData((prev) => [newItem, ...prev]);
            setRowCount((prev) => prev + 1);
            setOpenDialogCreate(false);
            setFormData({ ...model });
            toast.success("Creado exitosamente");
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al crear");
        }
        setLoading(false);
    };

    const handleEdit = async () => {
        setLoading(true);
        try {
            const res = await fetch(apiEndpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (!res.ok) return toast.error("Error al actualizar");
            const updated = await res.json();
            setData((prev) => prev.map((i) => (i._id === updated._id ? updated : i)));
            setOpenDialogEdit(false);
            setFormData({ ...model });
            toast.success("Actualizado exitosamente");
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const res = await fetch(apiEndpoint, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: formData._id }),
            });
            if (!res.ok) return toast.error("Error al eliminar");
            setData((prev) => prev.filter((i) => i._id !== formData._id));
            setRowCount((prev) => prev - 1);
            setOpenDialogDelete(false);
            toast.success("Eliminado exitosamente");
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    return (
        <Box sx={{ mx: "auto" }}>
            <Card>
                <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h3">{title}</Typography>
                        <IconButton
                            color="success"
                            onClick={() => setOpenDialogCreate(true)}
                            sx={{ mt: 2 }}
                        >
                            <IoMdAddCircle size={30} />
                        </IconButton>
                    </Box>
                </CardContent>
            </Card>

            <DataGrid
                rows={data}
                getRowId={(row) => row._id}
                pagination
                rowCount={rowCount}
                page={page}
                pageSize={pageSize}
                paginationMode="server"
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[5, 10, 20]}
                loading={loading}
                columns={columns({
                    onEdit: (row) => { setFormData(row); setOpenDialogEdit(true); },
                    onDelete: (row) => { setFormData(row); setOpenDialogDelete(true); }
                })}
                sx={{
                    height: 600,
                    width: "100%",
                    overflowX: "auto",
                    "& .MuiDataGrid-virtualScroller": { overflowX: "auto" }
                }}
            />

            {openDialogDelete && (
                <ToasterGeneric
                    open={openDialogDelete}
                    title="Confirmar Eliminación"
                    message="¿Seguro que deseas eliminar este registro?"
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    onConfirm={handleDelete}
                    onCancel={() => {setOpenDialogDelete(false); setFormData({ ...model });}}
                />
            )}

            {(openDialogCreate || openDialogEdit) && (
                <Dialog
                    openDialog={openDialogEdit || openDialogCreate}
                    widthDialog="sm"
                    title={openDialogEdit ? "Editar" : "Crear"}
                    content={
                        <FormComponent 
                            formData={formData} 
                            handleChange={handleChange} 
                            handleBlur={handleBlur}
                            handleDirectChange={handleDirectChange}
                            isEdit={openDialogEdit}
                        />
                    }
                    actions={
                        <>
                            <Button
                                onClick={() => {
                                    setFormData({ ...model });
                                    setOpenDialogCreate(false);
                                    setOpenDialogEdit(false);
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={openDialogEdit ? handleEdit : handleCreate}
                            >
                                {openDialogEdit ? "Actualizar" : "Crear"}
                            </Button>
                        </>
                    }
                    openLoadingOverlay={loading}
                />
            )}

            {loading && <LoadingOverlay loading={loading} />}
        </Box>
    );
}
