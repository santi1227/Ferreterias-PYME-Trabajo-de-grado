'use client';
import { useRouter } from 'next/navigation';
import useUser from '@/app/hooks/useUser';
import * as React from 'react';
import {
    ListItemIcon,
    IconButton,
    ListItem,
    MenuItem,
    Divider,
    Tooltip,
    Avatar,
    Stack,
    Menu,
    Box
} from '@mui/material';

import { MdOutlineAdminPanelSettings, MdSupervisedUserCircle, MdLogin } from "react-icons/md";
import { GrConfigure } from "react-icons/gr";
import ChangePassword from './Dialogs/ChangePassword';
import ModalAccount from './Dialogs/ModalAccount';

export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openModal, setOpenModal] = React.useState(false);
    const [openChangePassword, setOpenChangePassword] = React.useState(false);
    const open = Boolean(anchorEl);
    const router = useRouter();
    const user = useUser();

    const handleClick = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleLogout = () => {
        handleClose();
        router.push('/login');
    };

    const handleOpenModal = () => {
        handleClose();
        setOpenModal(true);
    };

    const handleOpenChangePassword = () => {
        handleClose();
        setOpenChangePassword(true);
    };

    if (!user) return <Avatar />;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Cuenta">
                <Stack direction="row" spacing={2}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MdSupervisedUserCircle size={30} />
                            <span>{user.userName}</span>
                        </Box>
                    </IconButton>
                </Stack>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <ListItem>{user.userEmail}</ListItem>
                <Divider />
                {user.userRol === 'admin' && (
                    <MenuItem onClick={handleOpenModal}>
                        <ListItemIcon>
                            <MdOutlineAdminPanelSettings size={20} />
                        </ListItemIcon>
                        Administrar
                    </MenuItem>
                )}
                <MenuItem onClick={handleOpenChangePassword}>
                    <ListItemIcon>
                        <GrConfigure size={20} />
                    </ListItemIcon>
                    Cambiar Contraseña
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <MdLogin size={20} />
                    </ListItemIcon>
                    Cerrar sesión
                </MenuItem>
            </Menu>

            {openModal && (
                <ModalAccount open={openModal} onClose={() => setOpenModal(false)} />
            )}
            {openChangePassword && (
                <ChangePassword
                    open={openChangePassword}
                    onClose={() => setOpenChangePassword(false)}
                />
            )}
        </Box>
    );
}
