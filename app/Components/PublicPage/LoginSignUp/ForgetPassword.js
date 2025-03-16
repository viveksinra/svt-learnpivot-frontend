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
import { FcKey, FcFeedback } from "react-icons/fc";
import { BsEyeSlashFill, BsEyeFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import MainContext from "../../Context/MainContext";
import MySnackbar from "../../MySnackbar/MySnackbar";
import { authService } from "@/app/services";

function ForgetPassword({ setIsForget }) {
  const [showPassword, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const snackRef = useRef();
  const router = useRouter();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send OTP, email, and new password to the backend for resetting the password
      const res = await authService.resetPassword({ email, password, otp });
      console.log(res)
      if (res.variant === "success") {
        snackRef.current.handleSnack({
          message: "Password Reset Successful!",
          variant: "success",
        });

        // Redirect to dashboard or login after successful password reset
        setIsForget(false);
      } else {
        snackRef.current.handleSnack({
          message: res.message || "Failed to reset password.",
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      snackRef.current.handleSnack({
        message: "Something went wrong here. Please try again.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtpClick = async () => {
    const emailOtpData = {
      email,
      purpose: "password_reset",
    };

    try {
      const res = await authService.sendOtp(emailOtpData);
      if (res.variant === "success") {
        setOtpSent(true);
        snackRef.current.handleSnack({
          message: "OTP Sent Successfully!",
          variant: "success",
        });
      } else {
        if(res.message) {
        snackRef.current.handleSnack({
          message: res.message,
          variant: "error",
        });
        } else {
        snackRef.current.handleSnack({
          message: "Failed to send OTP to Email. Try again later.",
          variant: "error",
        });
      }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      snackRef.current.handleSnack({
        message: "Failed to send OTP to Email.",
        variant: "error",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleResetPassword} className="loginDataBox" style={{ width: "100%", marginHorizontal: 20 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              id="loginEmail"
              fullWidth
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              placeholder="Email Address"
              label="Email Address"
              variant="outlined"
              disabled={otpSent} // Disable email input after OTP is sent
            />
          </Grid>

          {otpSent && (
            <>
              <Grid item xs={12}>
                <TextField
                  id="newPassword"
                  fullWidth
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  label="New Password"
                  variant="outlined"
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

              <Grid item xs={12} md={6}>
                <TextField
                  id="emailOtp"
                  fullWidth
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter Email OTP"
                  label="Email OTP"
                  variant="outlined"
                />
              </Grid>
            </>
          )}

          {!otpSent && (
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Fab
                variant="extended"
                size="medium"
                color="primary"
                aria-label="send-otp"
                onClick={handleSendOtpClick}
                disabled={loading || !email} // Disable button when loading or email is empty
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <FcFeedback style={{ fontSize: 24, marginRight: 10 }} />
                    Send OTP to Email
                  </>
                )}
              </Fab>
            </Grid>
          )}

          {otpSent && (
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "center" }}
            >
              <Fab
                variant="extended"
                size="medium"
                color="primary"
                aria-label="reset-password"
                type="submit"
                disabled={loading || !otp || !password} // Disable button when loading or inputs are empty
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <FcFeedback style={{ fontSize: 24, marginRight: 10 }} />
                    Reset Password
                  </>
                )}
              </Fab>
            </Grid>
          )}
        </Grid>
      </form>
      <MySnackbar ref={snackRef} />
    </>
  );
}

export default ForgetPassword;
