"use client";

import { MdDelete, MdEdit } from "react-icons/md";
import CrudPage from "@/app/components/shared/CrudPage/CrudPage";
import { FormCustomer } from "@/app/screens/Customers/FormCustomer";

const model = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    documentType: "",
    documentNumber: "",
    address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
    },
};

const columns = ({ onEdit, onDelete }) => [
    { field: "firstName", headerName: "Nombre", flex: 1 },
    { field: "lastName", headerName: "Apellido", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Teléfono", width: 150 },
    { field: "documentType", headerName: "Tipo Doc", width: 150 },
    { field: "documentNumber", headerName: "Número Doc", width: 150 },
    {
        field: "address", headerName: "Dirección", flex: 1, valueGetter: (params) => {
            const addr = params || {};
            return `${addr.street || ""} ${addr.city || ""} ${addr.state || ""} ${addr.country || ""} ${addr.postalCode || ""}`.trim() || "Sin dirección";
        }
    },
    {
        field: "createdAt",
        headerName: "Fecha de Registro",
        flex: 1,
        valueGetter: (params) => {
            return new Date(params).toLocaleString("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            });
        },
    },

    {
        field: "actions",
        headerName: "Acciones",
        width: 180,
        renderCell: (params) => (
            <>
                <MdEdit
                    style={{ cursor: "pointer", marginRight: 10 }}
                    size={20}
                    onClick={() => onEdit(params.row)}
                />
                <MdDelete
                    style={{ cursor: "pointer", color: "red" }}
                    size={20}
                    onClick={() => onDelete(params.row)}
                />
            </>
        ),
    },
];

export default function CustomersPage() {
    return (
        <CrudPage
            title="Gestión de Clientes"
            apiEndpoint="/api/customers"
            model={model}
            columns={columns}
            FormComponent={FormCustomer}
        />
    );
}
