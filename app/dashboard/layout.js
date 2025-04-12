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
  Tooltip,
  Typography,
} from "@mui/material/";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { 
  MdDashboard, 
  MdPayment, 
  MdLogout, 
  MdMenu, 
  MdChevronLeft, 
  MdSchool, 
  MdQuiz,
  MdShoppingCart,
  MdDateRange,
  MdAnalytics, 
  MdPerson,
  MdFamilyRestroom,
  MdAssessment,
  MdCategory,
  MdOutlineReceiptLong
} from "react-icons/md";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "../Components/Loading/Loading";
import { useLogout } from "../hooks/auth/uselogout";
import { authService } from "../services";
import Link from "next/link";

export const drawerWidth = 240;

const MenuHeader = ({ title, open }) => (
  <Typography
    variant="body2"
    className="menu-header"
    sx={{ display: open ? 'block' : 'none' }}
  >
    {title}
  </Typography>
);

const DrawerData = ({ open, setMobileOpen }) => {
  const router = useRouter();
  const { logout } = useLogout();

  // Dashboard Item
  const dashboardItem = {
    title: "Dashboard",
    active: true,
    link: "/dashboard",
    icon: <MdDashboard className="drawer-icon" size={24} color="#1976d2" />,
  };

  // Course Items
  const courseItems = [
    {
      title: "All Course",
      active: false,
      link: "/dashboard/addCourse",
      icon: <MdSchool className="drawer-icon" size={24} color="#2e7d32" />,
    },
    { 
      title: "User Course Access",
      active: false,
      link: "/dashboard/report/userCourseAccess",
      icon: <MdAssessment className="drawer-icon" size={24} color="#0097a7" />
    },
    {
      title: "Mock Test",
      active: false,
      link: "/dashboard/addMockTest",
      icon: <MdQuiz className="drawer-icon" size={24} color="#9c27b0" />,
    },
  ];

  // Purchase Items
  const purchaseItems = [
    {
      title: "Purchased Mock",
      active: false,
      link: "/dashboard/allBuyMock",
      icon: <MdShoppingCart className="drawer-icon" size={24} color="#ed6c02" />,
    },
    { 
      title: "Purchased Course",
      active: false,
      link: "/dashboard/allBuyCourse",
      icon: <MdShoppingCart className="drawer-icon" size={24} color="#0288d1" />
    },
    { 
      title: "All Payment",
      active: false,
      link: "/dashboard/allPayment",
      icon: <MdPayment className="drawer-icon" size={24} color="#d32f2f" />
    },
  ];

  // Mock Report Items
  const mockReportItems = [
    { 
      title: "Mock Batch Report",
      active: false,
      link: "/dashboard/report/mockBatchReport",
      icon: <MdAnalytics className="drawer-icon" size={24} color="#7b1fa2" />
    },
  ];

  // Course Report Items
  const courseReportItems = [
    { 
      title: "Course Batch Report",
      active: false,
      link: "/dashboard/report/courseBatchReport",
      icon: <MdAnalytics className="drawer-icon" size={24} color="#00796b" />
    },
    { 
      title: "Course Date Report",
      active: false,
      link: "/dashboard/report/courseDateReport",
      icon: <MdDateRange className="drawer-icon" size={24} color="#5d4037" />
    },
    { 
      title: "Parent Course Report",
      active: false,
      link: "/dashboard/report/parentCourseReport",
      icon: <MdFamilyRestroom className="drawer-icon" size={24} color="#e64a19" />
    },
  ];

  // All User Items
  const userReportItems = [
    { 
      title: "All User",
      active: false,
      link: "/dashboard/report/userReport",
      icon: <MdPerson className="drawer-icon" size={24} color="#303f9f" />
    },
    { 
      title: "All Child",
      active: false,
      link: "/dashboard/report/childReport",
      icon: <MdFamilyRestroom className="drawer-icon" size={24} color="#c2185b" />
    },
    { 
      title: "Each User Report",
      active: false,
      link: "/dashboard/report/eachUserReport",
      icon: <MdAssessment className="drawer-icon" size={24} color="#0097a7" />
    },

  ];

  // Transaction Items
  const transactionItems = [
    { 
      title: "User Super Coins",
      active: false,
      link: "/dashboard/transaction/oneUserTransaction",
      icon: <MdOutlineReceiptLong className="drawer-icon" size={24} color="#689f38" />
    },
  ];

  // Combined array for all menu items
  const [dashList1, setDashList] = useState([
    dashboardItem,
    ...courseItems,
    ...purchaseItems,
    ...mockReportItems,
    ...courseReportItems,
    ...userReportItems,
    ...transactionItems
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

  const renderMenuItem = (item, index) => (
    <ListItem
      key={index}
      onClick={() => handleLink(item, index, "Ar1")}
      disablePadding
      className={item?.active ? "activeLink" : ""}
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
  );

  return (
    <div className="drawer-content">
      <List sx={{ px: 1 }}>
        {/* Dashboard */}
        {renderMenuItem(dashboardItem, 0)}
        
        {/* Course Management */}
        <MenuHeader title="Course Management" open={open} />
        {courseItems.map((item, idx) => 
          renderMenuItem(item, idx + 1)
        )}
        
        {/* Purchases */}
        <MenuHeader title="Purchases" open={open} />
        {purchaseItems.map((item, idx) => 
          renderMenuItem(item, idx + courseItems.length + 1)
        )}
        
        {/* Reports Section */}
        <MenuHeader title="Reports" open={open} />
        
        {/* Mock Reports */}
        <MenuHeader title="Mock Reports" open={open} />
        <div className="submenu-container">
          {mockReportItems.map((item, idx) => 
            renderMenuItem(item, idx + courseItems.length + purchaseItems.length + 1)
          )}
        </div>
        
        {/* Course Reports */}
        <MenuHeader title="Course Reports" open={open} />
        <div className="submenu-container">
          {courseReportItems.map((item, idx) => 
            renderMenuItem(
              item, 
              idx + courseItems.length + purchaseItems.length + mockReportItems.length + 1
            )
          )}
        </div>
        
        {/* All Users */}
        <MenuHeader title="All Users" open={open} />
        <div className="submenu-container">
          {userReportItems.map((item, idx) => 
            renderMenuItem(
              item, 
              idx + courseItems.length + purchaseItems.length + 
              mockReportItems.length + courseReportItems.length + 1
            )
          )}
        </div>
        
        {/* Transactions */}
        <MenuHeader title="Transactions" open={open} />
        {transactionItems.map((item, idx) => 
          renderMenuItem(
            item, 
            idx + courseItems.length + purchaseItems.length + 
            mockReportItems.length + courseReportItems.length + userReportItems.length + 1
          )
        )}
      </List>
      
      <Divider sx={{ my: 1 }} />
      
      <List
        sx={{
          display: { xs: "none", md: "block" },
          width: "100%",
          px: 1
        }}
      >
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
      <AppBar position="fixed" color="default" open={open} elevation={1}>
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={handleDrawer}
            edge="start"
            sx={{
              marginRight: 5,
              display: { xs: "none", sm: "block" },
              ...(open && { display: "none" }),
            }}
          >
            <MdMenu size={26} />
          </IconButton>
          <IconButton
            color="primary"
            aria-label="Mobile Drawer"
            onClick={() => setMobileOpen(!mobileOpen)}
            edge="start"
            sx={{
              marginRight: 2,
              marginLeft: 1,
              display: { xs: "block", sm: "none" },
            }}
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
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)',
            overflowY: "auto" 
          },
        }}
      >
        <DrawerHeader>
          <IconButton
            onClick={handleDrawer}
            sx={{
              ...(!open && { display: "none" }),
            }}
          >
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
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          zIndex: 2200,
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: drawerWidth,
            overflowY: "auto"
          },
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
