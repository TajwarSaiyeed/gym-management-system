"use client";

import Link from "next/link";
import React, { useState } from "react";

import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";


import Logout from "@mui/icons-material/Logout";
import { signOut, useSession } from "next-auth/react";

import MuiDrawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";

import ListItems from "@/app/components/listItems";
import axios from "axios";
import useSWR from "swr";
import Loading from "../loading";

import { Notification } from "@prisma/client";
import {
    Container,
    Typography,
    IconButton,
    ListItemIcon, Box,
    List,
    Menu,
    Badge,
    Avatar,
    Tooltip,
    Divider,
    Toolbar,
    MenuItem
} from "@mui/material";
import { handleActiveStatus } from "@/utils";
import { useRouter } from "next/navigation";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
            },
        }),
    },
}));

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const defaultTheme = createTheme();

const fetcher = async (...args: Parameters<typeof axios>) => {
    const res = await axios(...args);
    return res;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { data } = useSession();
    const router = useRouter()

    const {
        data: notifyData,
        isLoading,
        mutate
    } = useSWR("/api/notification", fetcher);


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showNotifications, setShowNotifications] =
        useState<null | HTMLElement>(null);

    const [open, setOpen] = useState<boolean>(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuOpen = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRead = async (notificationId: string) => {
        try {
            const res = await axios.patch(`/api/notification/${notificationId}`);

            if (res.status === 201) {
                await mutate()
            }
        } catch (error) {
        }
    };

    const notificationsOpen = Boolean(showNotifications);
    const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
        setShowNotifications(event.currentTarget);
    };
    const handleNotificationsClose = () => {
        setShowNotifications(null);
    };

    const handleLogout = async () => {
        await handleActiveStatus(router, "offline")
        await signOut();
    }


    if (isLoading) {
        return <Loading />;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: "flex" }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: "24px", // keep right padding when drawer closed
                        }}
                    >
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                marginRight: "36px",
                                ...(open && { display: "none" }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            Gym
                        </Typography>
                        <Box>
                            <Tooltip title="Notifications">
                                <IconButton
                                    color="inherit"
                                    onClick={handleNotificationsClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={
                                        notificationsOpen ? "notification-menu" : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={notificationsOpen ? "true" : undefined}
                                >
                                    <Badge
                                        badgeContent={notifyData ? notifyData?.data?.unRead : 0}
                                        color="secondary"
                                    >
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>



                            <Menu
                                anchorEl={showNotifications}
                                id="notification-menu"
                                open={notificationsOpen}
                                onClose={handleNotificationsClose}
                                onClick={handleNotificationsClose}

                                transformOrigin={{ horizontal: "right", vertical: "top" }}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                            >
                                {notifyData &&
                                    notifyData?.data?.data?.filter((n: Notification) => !n.read)?.sort((a: Notification, b: Notification) => (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                    ).map((notification: Notification) => (
                                        <Link
                                            key={notification.id}
                                            href={notification?.pathName}
                                            onClick={() => handleRead(notification.id)}
                                            passHref
                                        >
                                            <MenuItem onClick={handleClose}>
                                                {notification?.notification_text.slice(0, 25)}
                                            </MenuItem>
                                        </Link>
                                    ))}
                                <Divider />
                                <Link href="/notifications" passHref>
                                    <MenuItem
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        View all notifications
                                    </MenuItem>
                                </Link>
                            </Menu>

                            <Tooltip title="Account settings">
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{ ml: 2 }}
                                    aria-controls={menuOpen ? "account-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={menuOpen ? "true" : undefined}
                                >
                                    <Avatar
                                        sx={{ width: 32, height: 32 }}
                                        src={data?.user?.image ? data?.user?.image : undefined}
                                        alt={data?.user?.name ? data?.user?.name : undefined}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={menuOpen}
                                onClose={handleClose}
                                onClick={handleClose}
                                sx={{
                                    overflow: "visible",
                                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                    mt: 1.5,
                                    "& .MuiAvatar-root": {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },

                                }}
                                transformOrigin={{ horizontal: "right", vertical: "top" }}
                                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                            >
                                <Link href="/profile" passHref>
                                    <MenuItem onClick={handleClose}>
                                        <Avatar
                                            src={data?.user?.image ? data?.user?.image : undefined}
                                            alt={data?.user?.name ? data?.user?.name : undefined}
                                        /> Profile
                                    </MenuItem>
                                </Link>

                                <Divider />

                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <Toolbar
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            px: [1],
                        }}
                    >
                        <IconButton onClick={toggleDrawer}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Toolbar>
                    <Divider />
                    <List component="nav">
                        <ListItems />
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === "light"
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: "100vh",
                        overflow: "auto",
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        {children}
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default DashboardLayout;
