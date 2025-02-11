"use client";

import "./loginStyle.css";
import { useState, useRef } from "react";


import MySnackbar from "../Components/MySnackbar/MySnackbar";
import Navbar from "../Components/ITStartup/Common/Navbar/Navbar";
import ComLogSigForm from "../Components/PublicPage/LoginSignUp/ComLogSigForm";
import { Grid } from "@mui/material";

function Login() {
  const snackRef = useRef();
  return (
    <main>
      <Navbar />
      <div id="loginBg" style={{ backgroundColor: "#fff" }}>
        <Grid container>
        <Grid
    item
    xs={12}
    md={5}
    className="center"
    style={{ flexDirection: "column", padding: "20px" , }}
  >
        <ComLogSigForm isRedirectToDashboard={true} />
        </Grid>
          <Grid item xs={12} md={7} id="LoginImgSide">
            <img
              src="https://res.cloudinary.com/oasismanors/image/upload/v1696145088/Login2_pvckvi.svg"
              style={{ width: "100%", height: "400px" }}
              alt="Login-Img"
            />
          </Grid>
        </Grid>
      </div>
      <MySnackbar ref={snackRef} />
    </main>
  );
}

export default Login;
