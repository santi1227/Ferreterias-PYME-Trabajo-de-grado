"use client";

import * as React from "react";
import { useIdleLogout } from "@/app/hooks/useIdleLogout";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

import { styled, useTheme, alpha } from "@mui/material/styles";
import {
    CssBaseline,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    IconButton,
    ListItem,
    Toolbar,
    Divider,
    Drawer,
    List,
    Box,
    Tooltip,
} from "@mui/material";

import MuiAppBar from "@mui/material/AppBar";

import { MdInventory, MdPeople, MdDashboard } from "react-icons/md";
import { FaSellcast, FaUserTie } from "react-icons/fa6";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { LiaUsersSolid } from "react-icons/lia";
import { TiChevronRight, TiChevronLeft } from "react-icons/ti";
import { CiMenuBurger } from "react-icons/ci";

import AccountMenu from "@/app/components/AccountMenu/AccountMenu";

const drawerWidth = 270;

const Main = styled("main", {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    flexGrow: 1,
    minHeight: "100vh",
    padding: theme.spacing(4),
    transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    background: `
        radial-gradient(circle at top left, rgba(34,197,94,0.08), transparent 20%),
        radial-gradient(circle at bottom right, rgba(59,130,246,0.08), transparent 20%),
        linear-gradient(135deg, #020617 0%, #0f172a 40%, #111827 100%)
    `,
    ...(open && {
        transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    }),
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    background: "rgba(15, 23, 42, 0.75)",
    backdropFilter: "blur(18px)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "none",
    transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
    }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 2),
    minHeight: "64px",
    color: "white",
}));

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();

    useIdleLogout(30 * 60 * 1000);

    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const menuItems = [
        { text: "Inicio", icon: <MdDashboard size={22} />, href: "/dashboard" },
        { text: "Compras", icon: <BiSolidPurchaseTag size={22} />, href: "/dashboard/purchases" },
        { text: "Clientes", icon: <LiaUsersSolid size={22} />, href: "/dashboard/customers" },
        { text: "Ventas", icon: <FaSellcast size={20} />, href: "/dashboard/sales" },
        { text: "Usuarios", icon: <MdPeople size={22} />, href: "/dashboard/users" },
        { text: "Productos", icon: <MdInventory size={22} />, href: "/dashboard/products" },
        { text: "Proveedores", icon: <FaUserTie size={20} />, href: "/dashboard/providers" },
    ];

    const isActive = (href) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* APPBAR */}
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    {!open && (
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerOpen}
                            sx={{ mr: 2 }}
                        >
                            <CiMenuBurger />
                        </IconButton>
                    )}

                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            flexGrow: 1,
                            fontWeight: "bold",
                            color: "white",
                            letterSpacing: 1,
                        }}
                    >
                        Ferretería Inventario
                    </Typography>

                    <AccountMenu />
                </Toolbar>
            </AppBar>

            {/* SIDEBAR */}
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        background: "linear-gradient(180deg, #0f172a 0%, #111827 100%)",
                        color: "white",
                        borderRight: "1px solid rgba(255,255,255,0.06)",
                        boxSizing: "border-box",
                    },
                }}
            >
                <DrawerHeader>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                color: "#4ade80",
                            }}
                        >
                            FERRETERÍA
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "rgba(255,255,255,0.6)",
                            }}
                        >
                            Gestión PYME
                        </Typography>
                    </Box>

                    <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
                        {theme.direction === "ltr" ? <TiChevronLeft /> : <TiChevronRight />}
                    </IconButton>
                </DrawerHeader>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />

                <List sx={{ px: 2, py: 3 }}>
                    {menuItems.map((item) => {
                        const active = isActive(item.href);

                        return (
                            <ListItem key={item.href} disablePadding sx={{ mb: 1 }}>
                                <Tooltip title={item.text} placement="right">
                                    <ListItemButton
                                        component={Link}
                                        href={item.href}
                                        sx={{
                                            borderRadius: "14px",
                                            py: 1.3,
                                            background: active
                                                ? "linear-gradient(135deg, #22c55e, #16a34a)"
                                                : "transparent",
                                            color: active
                                                ? "white"
                                                : "rgba(255,255,255,0.78)",
                                            transition: "0.25s",
                                            "&:hover": {
                                                background: active
                                                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                                                    : alpha("#ffffff", 0.08),
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color: "inherit",
                                                minWidth: 40,
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>

                                        <ListItemText
                                            primary={item.text}
                                            primaryTypographyProps={{
                                                fontSize: 15,
                                                fontWeight: active ? "bold" : 500,
                                            }}
                                        />
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
            </Drawer>

            {/* CONTENIDO */}
            <Main open={open}>
                <DrawerHeader />

                <Box
                    sx={{
                        borderRadius: "24px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        backdropFilter: "blur(10px)",
                        p: 3,
                        minHeight: "85vh",
                        boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
                    }}
                >
                    {children}
                </Box>
            </Main>
        </Box>
    );
}
