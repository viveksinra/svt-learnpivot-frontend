"use client";
import React, { useState, Suspense } from "react";
import "./dashboardStyle.css";
import {
  styled,
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
} from "@mui/material/";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import {
  FcMenu,
  FcLeft,
  FcComboChart,
  FcPlus,
  FcFlowChart,
  FcContacts,
  FcRightUp,
  FcCalculator,
  FcImport,
  FcStatistics,
} from "react-icons/fc";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "../Components/Loading/Loading";
import { useLogout } from "../hooks/auth/uselogout";
import { authService } from "../services";
import Link from "next/link";

export const drawerWidth = 240;

const DrawerData = ({ open, setMobileOpen }) => {
  const router = useRouter();
  const { logout } = useLogout();
  const [dashList1, setDashList] = useState([
    {
      title: "Dashboard",
      active: true,
      link: "/dashboard",
      icon: <FcComboChart />,
    },
    {
      title: "All Course",
      active: false,
      link: "/dashboard/addCourse",
      icon: <FcPlus />,
    },
    {
      title: "Mock Test",
      active: false,
      link: "/dashboard/addMockTest",
      icon: <FcFlowChart />,
    },
    {
      title: "Purchased Mock",
      active: false,
      link: "/dashboard/allBuyMock",
      icon: <FcContacts />,
    },
    { 
      title: "Purchased Course",
      active: false,
      link: "/dashboard/allBuyCourse",
      icon: <FcRightUp />
    },
    { 
      title: "All Payment",
      active: false,
      link: "/dashboard/allPayment",
      icon: <FcCalculator />
    },
    { 
      title: "Mock Batch Report",
      active: false,
      link: "/dashboard/report/mockBatchReport",
      icon: <FcStatistics />
    },
    { 
      title: "Course Batch Report",
      active: false,
      link: "/dashboard/report/courseBatchReport",
      icon: <FcStatistics />
    },
    { 
      title: "Parent Course Report",
      active: false,
      link: "/dashboard/report/parentCourseReport",
      icon: <FcStatistics />
    },
  ]);

  const handleLink = (v, n, Ar) => {
    if (Ar === "Ar1") {
      let newArr = dashList1.map((obj, j) => {
        if (n === j) {
          return { ...obj, active: true };
        } else {
          return { ...obj, active: false };
        }
      });
      setDashList(newArr);
    }

    router.push(v.link);
    if (setMobileOpen) {
      setMobileOpen();
    }
  };

  return (
    <div>
      <List>
        {dashList1.map((v, n) => (
          <ListItem
            key={n}
            onClick={() => handleLink(v, n, "Ar1")}
            disablePadding
            className={v?.active ? "activeLink" : ""}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  fontSize: 24,
                  justifyContent: "center",
                }}
              >
                {v.icon}
              </ListItemIcon>
              <ListItemText primary={v.title} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
      <List
        sx={{
          display: { xs: "none", md: "block" },
          width: "100%",
        }}
      >
        <ListItem
          onClick={() => {
            logout();
            router.push("/");
          }}
          disablePadding
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                fontSize: 24,
                justifyContent: "center",
              }}
            >
              <FcImport />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
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

function DashboardLayout({ children }) {
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const { logout } = useLogout();
  const openProfile = Boolean(anchorElProfile);
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawer = () => {
    setOpen(!open);
  };
  return (
    <Box sx={{ display: "flex",background:"#fff" }}>
      <CssBaseline />
      <AppBar position="fixed" color="default" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            sx={{
              marginRight: 5,
              display: { xs: "none", sm: "block" },
              ...(open && { display: "none" }),
            }}
          >
            <FcMenu />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Mobile Drawer"
            onClick={() => setMobileOpen(!mobileOpen)}
            edge="start"
            sx={{
              marginRight: 2,
              marginLeft: 1,
              display: { xs: "block", sm: "none" },
            }}
          >
            <FcMenu />
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
            MenuListProps={{
              "aria-labelledby": "basic-button-profile",
            }}
          >
            <MenuItem disabled>
              Hi {authService.getLoggedInUser()?.firstName ?? "User"} !
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
            sx={{
              height: 40,
              width: 40,
              ml: 1,
              cursor: "pointer",
            }}
            id="basic-button-profile"
            aria-controls={openProfile ? "profile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openProfile ? "true" : undefined}
            alt="User"
            // src={authService.getLoggedInUser()?.userImage}
            src={"https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"}
            onClick={(e) => setAnchorElProfile(e.currentTarget)}
          />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box" },
        }}
      >
        <DrawerHeader>
          <IconButton
            onClick={handleDrawer}
            sx={{
              ...(!open && { display: "none" }),
            }}
          >
            <FcLeft />
          </IconButton>
        </DrawerHeader>
        <DrawerData open={open} />
        <Divider />
      </Drawer>
      <SwipeableDrawer
        open={mobileOpen}
        onOpen={() => setMobileOpen(true)}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          zIndex: 2200,
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        <DrawerData
          open={mobileOpen}
          setMobileOpen={() => setMobileOpen(!mobileOpen)}
        />
      </SwipeableDrawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </Box>
    </Box>
  );
}

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

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default DashboardLayout;
