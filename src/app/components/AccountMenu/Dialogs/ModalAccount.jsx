import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { IoIosClose } from "react-icons/io";
import { AiOutlineUser } from 'react-icons/ai';
import useUser from '@/app/hooks/useUser';
import { MenuList } from '@mui/material';



const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    backgroundColor: theme.palette.grey[200],
    borderRadius: 16,
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    borderRadius: 16,
    padding: theme.spacing(1),
  },
}));


export default function ModalAccount({ open, onClose }) {
  const user = useUser();
  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
    >
      <DialogTitle sx={{
        m: 0,
        p: 3,
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
      }} id="customized-dialog-title">
        {user ? `${user.userRol === "admin" ? "Administrador" : "Empleado"}` : 'No rol data available'}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={(theme) => ({
          color: "grey.500",
          position: 'absolute',
          right: 8,
          top: 8,

        })}
      >
        <IoIosClose size={26} />
      </IconButton>
      <DialogContent dividers>

        <AiOutlineUser size={100} style={{ display: 'block', margin: '0 auto 20px auto' }} />
        <MenuList>
          {user ? `Usuario: ${user.userName}` : 'No user data available'}
        </MenuList>
        <MenuList>
          {user ? `Correo: ${user.userEmail}` : 'No email data available'}
        </MenuList>
        <MenuList>
          {user ? `Telefono: ${user.userPhone}` : 'No phone data available'}
        </MenuList>
        <MenuList>
          {user ? `Usuario desde: ${new Date(user.userCreated).toLocaleDateString()}` : 'No created date available'}
        </MenuList>

      </DialogContent>

    </BootstrapDialog>
  );
}