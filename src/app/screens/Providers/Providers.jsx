import { MdDelete, MdEdit } from "react-icons/md";
import CrudPage from "@/app/components/shared/CrudPage/CrudPage";
import { FormProviders } from "@/app/screens/Providers/FormProviders";

const modelProvider = {
    name: "",
    nit: "",
    contactName: "",
    phone: "",
    email: "",
    address: "",
    state: 1,
};

const columns = ({ onEdit, onDelete }) => [
    { field: "name", headerName: "Nombre", flex: 1 },
    { field: "nit", headerName: "NIT", width: 150 },
    { field: "contactName", headerName: "Contacto", flex: 1 },
    { field: "phone", headerName: "Teléfono", width: 150 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "address", headerName: "Dirección", flex: 1 },
    {
        field: "state",
        headerName: "Estado",
        width: 120,
        renderCell: (params) => (params.row.state === 1 ? "Activo" : "Inactivo"),
    },
    {
        field: "actions",
        headerName: "Acciones",
        width: 150,
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

export default function Providers() {
    return (
        <CrudPage
            title="Gestión de Proveedores"
            apiEndpoint="/api/providers"
            model={modelProvider}
            columns={columns}
            FormComponent={FormProviders}
        />
    );
}
