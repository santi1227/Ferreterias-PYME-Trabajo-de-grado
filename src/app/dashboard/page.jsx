"use client";

import * as React from 'react';
import { useIdleLogout } from "@/app/hooks/useIdleLogout";
import { useRouter } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import { MdInventory, MdPeople } from 'react-icons/md';
import { FaSellcast } from "react-icons/fa6";
import { FaUserTie } from "react-icons/fa";
import { TiChevronRight, TiChevronLeft } from "react-icons/ti";
import { LiaUsersSolid } from "react-icons/lia";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { CiMenuBurger } from "react-icons/ci";
import Providers from '@/app/screens/Providers/Providers';
import Purchases from '../screens/Purchases/Purchases';
import Products from '@/app/screens/Products/Products';
import Customers from '../screens/Customers/Customers';
import Users from '@/app/screens/Users/Users';
import Home from '@/app/screens/Home/Home';
import Sales from '../screens/Sales/Sales';
import AccountMenu from '@/app/components/AccountMenu/AccountMenu';
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        width: "100%",
        overflowX: "hidden",
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    })
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function Dashboard() {
    const router = useRouter();
    const theme = useTheme();
    useIdleLogout(30 * 60 * 1000);
    const [open, setOpen] = React.useState(true);
    const [selectedPage, setSelectedPage] = React.useState("home");

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);
    const handleLogout = () => router.push('/login');

    const renderContent = () => {
        switch (selectedPage) {
            case "products":
                return <Products />;
            case "users":
                return <Users />;
            case "providers":
                return <Providers />;
            case "purchases":
                return <Purchases />;
            case "sales":
                return <Sales />;
            case "customers":
                return <Customers />;
            default:
                return <Home />;
        }
    };
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2, ...(open && { display: 'none' }) }}
                    >
                        <CiMenuBurger />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>Ferreterias Pyme </Typography>
                    <AccountMenu />
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <TiChevronLeft /> : <TiChevronRight />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {[
                        { text: "Inicio", icon: <TiChevronRight />, key: "Inicio" },
                        { text: "Compras", icon: <BiSolidPurchaseTag />, key: "purchases" },
                        { text: "Clientes", icon: <LiaUsersSolid />, key: "customers" },
                        { text: "Ventas", icon: <FaSellcast />, key: "sales" },
                        { text: "Usuarios", icon: <MdPeople />, key: "users" },
                        { text: "Productos", icon: <MdInventory />, key: "products" },
                        { text: "Proveedores", icon: <FaUserTie />, key: "providers" },
                    ].map((item) => (
                        <ListItem key={item.key} disablePadding>
                            <ListItemButton onClick={() => setSelectedPage(item.key)}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Main open={open}  sx={{ width: "100%", overflowX: "hidden" }}> 
                <DrawerHeader /> 
                {renderContent()} 
            </Main>
        </Box>
    );
}