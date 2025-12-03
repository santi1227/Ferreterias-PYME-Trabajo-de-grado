"use client";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";

export default function ToasterGeneric({
    open = false,
    title = "Confirmar",
    message = "¿Estás seguro?",
    confirmText = "Aceptar",
    cancelText = "Cancelar",
    onConfirm = () => { },
    onCancel = () => { },
}) {
    return (
        <Dialog open={open} onClose={() => { }} disableEscapeKeyDown>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>{message}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{cancelText}</Button>
                <Button variant="contained" color="error" onClick={onConfirm}>
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
