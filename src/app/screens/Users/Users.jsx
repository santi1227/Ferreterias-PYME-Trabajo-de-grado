import { MdDelete, MdEdit } from "react-icons/md";
import CrudPage from "@/app/components/shared/CrudPage/CrudPage";
import { FormUsers } from "@/app/screens/Users/FormUsers";

const modelUser = {
    user_name: "",
    password: "",
    email: "",
    phone: "",
    rol: "empleado",
    state: 1,
};

const columns = ({ onEdit, onDelete }) => [
    { field: "user_name", headerName: "Usuario", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "phone", headerName: "Teléfono", width: 150 },
    { field: "rol", headerName: "Rol", width: 120 },
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

export default function Users() {
    console.log("modelUser", modelUser) 
    return (
        <CrudPage
            title="Gestión de Usuarios"
            apiEndpoint="/api/users/user"
            model={modelUser}
            columns={columns}
            FormComponent={FormUsers}
        />
    );
}
