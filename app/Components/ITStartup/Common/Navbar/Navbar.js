"use client";
import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import MenuItem from "./MenuItem";
import { menus } from "./menus";
import { Avatar, Button, Menu, MenuItem as MuiMenuItem, useMediaQuery, useTheme } from "@mui/material";
import MainContext from "@/app/Components/Context/MainContext";
import { FaUserCircle } from "react-icons/fa";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useLogout } from "@/app/hooks/auth/uselogout";
import { CookieNotice } from "@/app/CookieNotice";
import { authService, myProfileService } from "@/app/services";

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleNavbar = () => {
    setCollapsed(!collapsed);
  };
  const currentUser = JSON.parse(Cookies.get("currentUser") || "{}");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { state } = useContext(MainContext);
  const router = useRouter();
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const openProfile = Boolean(anchorElProfile);

  const { logout } = useLogout();


  useEffect(() => {
    console.log("state?.isAuthenticated",state?.isAuthenticated)
    if (state?.isAuthenticated && currentUser?.firstName) {
    console.log("currentUser?.firstName",currentUser?.firstName)

      const checkUserStatus = async () => {
        try {
          const response = await myProfileService.getCheckUserStatus();
          if (response?.loginBlocked) {
            logout();
          }
          
          // else if(response == "undefined"){
          //   logout();
          // }
        } catch (error) {
          console.error('Error checking user status:', error);
        }
      };
      checkUserStatus();
    }
  }, [ currentUser?.firstName ]);
  useEffect(() => {
    const handleScroll = () => {
      const elementId = document.getElementById("navbar");
      if (window.scrollY > 170) {
        elementId?.classList.add("is-sticky");
      } else {
        elementId?.classList.remove("is-sticky");
      }
    };
    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarClass = collapsed
    ? "collapse navbar-collapse"
    : "collapse navbar-collapse show";
  const togglerClass = collapsed
    ? "navbar-toggler navbar-toggler-right collapsed"
    : "navbar-toggler navbar-toggler-right";

  return (
    <div id="navbar" className="navbar-area">
            <CookieNotice />
      
      <style jsx>{`
        .navbar-toggler {
          border: none;
          background: #eee !important;
          padding: 10px;
          border-radius: 0;
          width: 28px;
margin-right: 12px;
        }
        .navbar-toggler:focus {
          box-shadow: none;
        }
        .navbar-toggler .icon-bar {
          width: 28px;
          transition: all 0.3s;
          background: #0000ff;
          height: 2px;
          display: block;
        }
        .navbar-toggler .top-bar {
          transform: rotate(45deg);
          transform-origin: 10% 10%;
          left: 4px;
          position: relative;
        }
        .navbar-toggler .middle-bar {
          opacity: 0;
          margin: 6px 0;
        }
        .navbar-toggler .bottom-bar {
          transform: rotate(-45deg);
          transform-origin: 10% 90%;
          left: 4px;
          position: relative;
        }
        .navbar-toggler.collapsed .top-bar {
          transform: rotate(0);
          left: 0;
        }
        .navbar-toggler.collapsed .middle-bar {
          opacity: 1;
        }
        .navbar-toggler.collapsed .bottom-bar {
          transform: rotate(0);
          left: 0;
        }
      `}</style>
      <div className="main-nav">
        <div className="container">
          <nav className="navbar navbar-expand-md navbar-light" style={{ alignItems: "center"}}>
            <Link href="/" className="navbar-brand">
              <Image
                src="/images/logo.png"
                alt="logo"
                width={124}
                height={38}
                loading="lazy"
              />
            </Link>

            <button
              onClick={toggleNavbar}
              className={togglerClass}
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{ 
                // padding: "0.75rem",
                height: "45px",  // Add fixed height
                width: "45px",   // Add fixed width
                // display: "flex",
                // flexDirection: "column",
                // justifyContent: "space-around",
                // alignItems: "center"
              }}
            >
              <span className="icon-bar top-bar"></span>
              <span className="icon-bar middle-bar"></span>
              <span className="icon-bar bottom-bar"></span>
            </button>

            <div 
              className={`${navbarClass} max-md:bg-white md:bg-transparent absolute md:static w-full left-0 top-full`} 
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav">
                {menus.map((menuItem) => (
                  <MenuItem key={menuItem.label} {...menuItem} />
                ))}
              </ul>
            </div>

            <div className="others-options" style={{ marginTop: isMobile? "-15px" : "0px" }}>
              {state?.isAuthenticated && currentUser?.firstName ? (
                <>
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorElProfile}
                    open={openProfile}
                    onClose={() => setAnchorElProfile(null)}
                    MenuListProps={{ "aria-labelledby": "basic-button-profile" }}
                  >
                    <MuiMenuItem disabled>
                      Hi {currentUser.firstName}!
                    </MuiMenuItem>
                    <MuiMenuItem
                      onClick={() => {
                        router.push("/userDash");
                      }}
                    >
                      Dashboard
                    </MuiMenuItem>
                    <MuiMenuItem
                      onClick={() => {
                        logout();

                        router.push("/");
                      }}
                    >
                      Logout
                    </MuiMenuItem>
                
                  </Menu>
                  <Avatar
                    sx={{ height: 40, width: 40, ml: 1, cursor: "pointer" }}
                    id="basic-button-profile"
                    aria-controls={openProfile ? "profile-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openProfile ? "true" : undefined}
                    alt="User"
                    // src={currentUser.userImage}
                    src={"https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg"}

                    onClick={(e) => setAnchorElProfile(e.currentTarget)}
                  />
                </>
              ) : (
                <Link href="/login">
                  <Button 
                    startIcon={<FaUserCircle />} 
                    onClick={() => {
                      if (router.pathname === "/login") {
                        router.reload();
                      }
                    }}
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
      <div className="navbar-space"></div>
    </div>
  );
};

export default Navbar;