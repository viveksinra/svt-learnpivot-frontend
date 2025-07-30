"use client";
import React, { useState, Suspense } from "react";
import "./dashboardStyle.css";
import {
  Box,
  CssBaseline,
  Toolbar,
  IconButton,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  SwipeableDrawer,
  Menu,
  Avatar,
  MenuItem,
  Tooltip,
  styled,
} from "@mui/material/";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { MdDashboard, MdPayment, MdAccountCircle, MdLogout, MdPerson, MdMenu, MdChevronLeft, MdAssignment } from "react-icons/md";
import { FaUser, FaChild, FaFileAlt } from "react-icons/fa";
import { FcEngineering } from "react-icons/fc";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "../Components/Loading/Loading";
import { useLogout } from "../hooks/auth/uselogout";
import { authService } from "../services";
import Link from "next/link";

const drawerWidth = 240;

const DrawerData = ({ open, setMobileOpen }) => {
  const router = useRouter();
  const { logout } = useLogout();
  const [dashList, setDashList] = useState([
    { title: "Dashboard", active: true, link: "/userDash", icon: <MdDashboard className="drawer-icon" size={24} color="#1976d2" /> },
    { title: "Transaction", active: false, link: "/userDash/reports/allPayment", icon: <MdPayment className="drawer-icon" size={24} color="#2e7d32" /> },
    { title: "My Report", active: false, link: "/userDash/mockTestReport", icon: <MdAssignment className="drawer-icon" size={24} color="#9c27b0" /> },
   
    { title: "Profile", active: false, link: "/userDash/myProfile", icon: <FaUser className="drawer-icon" size={22} color="#0288d1" /> },
    { title: "My Child", active: false, link: "/userDash/myProfile/myChild", icon: <FaChild className="drawer-icon" size={22} color="#d32f2f" /> },
    { title: "My Super Coin", active: false, link: "/userDash/reports/myAccount", icon: <FcEngineering className="drawer-icon" size={24} color="#9c27b0" /> },
    { title: "My Account", active: false, link: "/userDash/reports/myUserReport", icon: <FaFileAlt className="drawer-icon" size={22} color="#ed6c02" /> },
  ]);

  const handleLink = (item, index, listType) => {
    let newList;
    if (listType === "dashList") {
      newList = dashList.map((obj, i) => ({ ...obj, active: i === index }));
      setDashList(newList);
    }
    router.push(item.link);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <div>
      <List sx={{ px: 1 }}>
        {dashList.map((item, index) => (
          <ListItem
            key={index}
            onClick={() => handleLink(item, index, "dashList")}
            disablePadding
            className={item.active ? "activeLink" : ""}
            sx={{ mb: 0.5, borderRadius: '8px' }}
          >
            <ListItemButton
              sx={{ 
                minHeight: 48, 
                justifyContent: open ? "initial" : "center", 
                px: 2.5,
                borderRadius: '8px',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <Tooltip title={item.title} placement="right">
                <ListItemIcon 
                  sx={{ 
                    minWidth: 0, 
                    mr: open ? 3 : "auto", 
                    fontSize: 24,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
              </Tooltip>
              <ListItemText 
                primary={item.title} 
                sx={{ 
                  opacity: open ? 1 : 0,
                  '& .MuiTypography-root': {
                    fontWeight: item.active ? 600 : 400
                  }
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />

      <List sx={{ px: 1, width: "100%" }}>
        <ListItem
          onClick={() => {
            logout();
            router.push("/");
          }}
          disablePadding
          sx={{ borderRadius: '8px' }}
        >
          <ListItemButton 
            sx={{ 
              minHeight: 48, 
              justifyContent: open ? "initial" : "center", 
              px: 2.5,
              borderRadius: '8px',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: '#ffebee'
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                minWidth: 0, 
                mr: open ? 3 : "auto", 
                fontSize: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MdLogout color="#d32f2f" size={24} className="drawer-icon" />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              sx={{ 
                opacity: open ? 1 : 0,
                color: '#d32f2f' 
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    [theme.breakpoints.up("sm")]: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

function DashboardLayout({ children }) {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const { logout } = useLogout();
  const openProfile = Boolean(anchorElProfile);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawer = () => setOpen(!open);

  return (
    <Box sx={{ display: "flex", background: "#fff" }}>
      <CssBaseline />
      <AppBar position="fixed" color="default" open={open} elevation={1}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            sx={{ marginRight: 5, display: { xs: "none", sm: "block" }, ...(open && { display: "none" }) }}
          >
            <MdMenu size={26} />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="Mobile Drawer"
            onClick={() => setMobileOpen(!mobileOpen)}
            edge="start"
            sx={{ marginRight: 2, marginLeft: 1, display: { xs: "block", sm: "none" } }}
          >
            <MdMenu size={26} />
          </IconButton>
          <Link href="/" className="navbar-brand">
            <Image
              width={160}
              height={60}
              src="https://res.cloudinary.com/qualifier/image/upload/v1706185907/Logo/chelmsford-high-resolution-logo_vc9ewh.svg"
              alt="Chelmsford"
              loading="lazy"
            />
          </Link>
          <span style={{ flexGrow: 1 }} />
  
          <Menu
            id="profile-menu"
            anchorEl={anchorElProfile}
            open={openProfile}
            onClose={() => setAnchorElProfile(null)}
            MenuListProps={{ "aria-labelledby": "basic-button-profile" }}
          >
            <MenuItem disabled>
              Hi {authService.getLoggedInUser()?.firstName ?? "User"}!
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Logout
            </MenuItem>
          </Menu>
          <Avatar
            sx={{ height: 40, width: 40, ml: 1, cursor: "pointer" }}
            id="basic-button-profile"
            aria-controls={openProfile ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openProfile ? "true" : undefined}
            alt="User"
            src={"https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"}
            onClick={(e) => setAnchorElProfile(e.currentTarget)}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{ display: { xs: "none", sm: "block" }, "& .MuiDrawer-paper": { boxSizing: "border-box", boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)' } }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawer} sx={{ ...(!open && { display: "none" }) }}>
            <MdChevronLeft size={24} color="#757575" />
          </IconButton>
        </DrawerHeader>
        <DrawerData open={open} />
        <Divider />
      </Drawer>
      <SwipeableDrawer
        open={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: "block", sm: "none" }, zIndex: 2200, "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth } }}
      >
        <DrawerData open={mobileOpen} setMobileOpen={() => setMobileOpen(!mobileOpen)} />
      </SwipeableDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </Box>
    </Box>
  );
}

export default DashboardLayout;
