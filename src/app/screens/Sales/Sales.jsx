import { MdDelete, MdEdit } from "react-icons/md";
import CrudPage from "@/app/components/shared/CrudPage/CrudPage";
import { FormSale } from "@/app/screens/Sales/FormSale";

const model = {
    customer: "",
    products: [],
    total: 0,
    invoiceNumber: "",
    createdAt: "",
};

const columns = ({ onEdit, onDelete }) => [
    { field: "invoiceNumber", headerName: "Factura", width: 150 },

    {
        field: "customer",
        headerName: "Cliente",
        flex: 1,
        valueGetter: (params) => params?.name || "Sin cliente",
    },

    { field: "total", headerName: "Total", width: 150 },

    {
        field: "createdAt",
        headerName: "Fecha de Venta",
        flex: 1,
        valueGetter: (params) =>
            new Date(params).toLocaleString("es-CO", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }),
    },

    {
        field: "actions",
        headerName: "Acciones",
        width: 200,
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

export default function Sales() {
    return (
        <CrudPage
            title="Gestión de Ventas"
            apiEndpoint="/api/sales"
            model={model}
            columns={columns}
            FormComponent={FormSale}
        />
    );
}
