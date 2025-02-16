"use client";

import { useState, useRef, useContext } from "react";
import {
  Grid,
  TextField,
  Fab,
  InputAdornment,
  IconButton,
  CircularProgress,
  
} from "@mui/material";
import { FcKey } from "react-icons/fc";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { LOGIN_USER } from "../../Context/types";
import MainContext from "../../Context/MainContext";
import { useLogin } from "@/app/hooks/auth/useLogin";
import MySnackbar from "../../MySnackbar/MySnackbar";

function LoginForm({ isRedirectToDashboard }) {
  const [showPassword, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const { dispatch } = useContext(MainContext);
  const { login } = useLogin();
  const router = useRouter();
  const snackRef = useRef();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success && res.token) {
        dispatch({ type: LOGIN_USER, payload: res });
        snackRef.current.handleSnack({
          message: "Login Successful! Please Wait",
          variant: "success",
        });
        if (isRedirectToDashboard == true) {
          router.push("/userDash");
          window.location.reload();
        }
      } else {
        snackRef.current.handleSnack({
          message: "Invalid Login. Please enter correct credentials.",
          variant: "error",
        });
      }
    } catch (error) {
      console.error(error);
      snackRef.current.handleSnack({
        message: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{marginTop:"20px", justifyContent:"center", }}>
      <form onSubmit={handleLogin} id="login-form" className="loginDataBox"  >
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              id="loginEmail"
              fullWidth
              focused
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="Email Address"
              label="Email Address"
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="loginPass"
              fullWidth
              focused
              required
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Password"
              label="Password"
              variant="outlined"
              inputProps={{ autoComplete: "on" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPass(!showPassword)}
                      edge="start"
                    >
                      {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} className="center">
            <Fab
              variant="extended"
              type="submit"
              color="primary"
              aria-label="loginBtn"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="secondary" size={24} />
              ) : (
                <>
                  <FcKey style={{ fontSize: 25, marginRight: 10 }} />
                  Login
                </>
              )}
            </Fab>
          </Grid>
        </Grid>
      </form>
      <MySnackbar ref={snackRef} />

    </div>
  );
}

export default LoginForm;
