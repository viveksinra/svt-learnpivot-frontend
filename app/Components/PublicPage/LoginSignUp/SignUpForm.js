"use client";
import { useState, useContext } from "react";
import {
  Container,
  Grid,
  TextField,
  MenuItem,
  Fab,
  IconButton,
  InputAdornment,
  Box,
  Alert,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { FcFeedback } from "react-icons/fc";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import MainContext from "../../Context/MainContext";
import { LOGIN_USER } from "../../Context/types";
import { authService } from "@/app/services";
import AddressSelect from "./AddressInput";

const SignUpForm = ({ isRedirectToDashboard, setIsLogin }) => {
  const [formData, setFormData] = useState({
    enquiryFor: "self",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    address1: "",
    address2: "",
    address3: "",
    city: "",
    postcode: "",
    marketing: "",
    message: "",
    selectedDates: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [acceptedTnC, setAcceptedTnC] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const { dispatch } = useContext(MainContext);

  const handleChange = (e) => {
    const { name, value, ...extra } = e.target;
    // Remove _unique suffix from field names
    const actualFieldName = name.replace('_unique', '');
    
    setFormData((prev) => ({
      ...prev,
      [actualFieldName]: value,
      ...extra,
    }));

    if (errors[actualFieldName]) {
      setErrors((prev) => ({ ...prev, [actualFieldName]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Phone number is required";
    if (!formData.address1.trim()) newErrors.address1 = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.postcode.trim()) newErrors.postcode = "PostCode is required";
    if (!password.trim()) newErrors.password = "Password is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    const phoneRegex = /^0\d{10}$/;
    if (formData.mobile && !phoneRegex.test(formData.mobile)) {
      newErrors.mobile = "Phone number must be 11 digits and start with 0";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtpClick = async () => {
    if (!acceptedTnC) {
      setAlert({ message: "Please accept the Terms and Conditions", severity: "error" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    const emailOtpData = {
      email: formData.email,
      mobile: formData.mobile,
      password: password,
      purpose: "signup",
    };

    try {
      const res = await authService.sendOtp(emailOtpData);
      if (res.variant === "success") {
        setOtpSent(true);
        setAlert({ message: `OTP Sent to ${formData.email}`, severity: "success" });
      } else {
        setAlert({
          message: res?.message || "Failed to send you OTP. Please try again later.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setAlert({ message: "System Failed to send OTP. Please try again later.", severity: "error" });
    }
  };

  const handleSignUpClick = async () => {
    if (!otp.trim()) {
      setAlert({ message: `Please enter OTP sent to ${formData.email}`, severity: "error" });
      return;
    }

    const signUpData = {
      ...formData,
      password,
      otp,
    };

    try {
      const res = await authService.signUp(signUpData);
      if (res.success && res.token) {
        setOpenDialog(true);
        dispatch({ type: LOGIN_USER, payload: res });
      } else {
        setAlert({ message: res.message || "Registration failed. Please try again.", severity: "error" });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      setAlert({ message: "Registration failed. Please try again.", severity: "error" });
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setIsLogin(true);
    if (isRedirectToDashboard) {
      router.push("/userDash");
      window.location.reload();
    } else {
      router.refresh();
    }
  };

  const allMarketing = [
    "Web Search / Google",
    "Friend or colleague Recommendation",
    "Social Media",
    "Direct Mailer",
    "Family Member",
    "Email",
    "Blog or Publication",
  ];

  const commonTextFieldProps = {
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: "false",
    inputProps: {
      autoComplete: "new-password",
      'data-lpignore': "true",
      'data-form-type': "other",
    }
  };

  return (
    <Container>
      <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        {alert && (
          <Box mb={2}>
            <Alert severity={alert.severity}>{alert.message}</Alert>
          </Box>
        )}

        <Grid container spacing={2}>
          {!otpSent ? (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  name="firstName_unique"
                  value={formData.firstName}
                  onChange={handleChange}
                  label="First Name"
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={otpSent}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  name="lastName_unique"
                  value={formData.lastName}
                  onChange={handleChange}
                  label="Last Name"
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={otpSent}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  name="email_unique"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  label="Email"
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={otpSent}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  name="mobile_unique"
                  value={formData.mobile}
                  onChange={handleChange}
                  label="WhatsApp Number"
                  placeholder="e.g. 07123456789"
                  required
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  disabled={otpSent}
                />
              </Grid>

              <Grid item xs={12}>
                <AddressSelect
                  value={formData.address1}
                  onChange={handleChange}
                  error={!!errors.address1}
                  helperText={errors.address1}
                  disabled={otpSent}
                  inputProps={{
                    ...commonTextFieldProps.inputProps,
                    name: "address1_unique"
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  name="address2_unique"
                  value={formData.address2}
                  onChange={handleChange}
                  label="Address Line 2"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  name="address3_unique"
                  value={formData.address3}
                  onChange={handleChange}
                  label="Address Line 3"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  name="city_unique"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  label="City/Town"
                  error={errors.city}
                  helperText={errors.city}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  required
                  name="postcode_unique"
                  value={formData.postcode}
                  onChange={handleChange}
                  label="Postcode"
                  error={errors.postcode}
                  helperText={errors.postcode}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  name="password_unique"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  label="Password"
                  required
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={otpSent}
                  InputProps={{
                    ...commonTextFieldProps.inputProps,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label={showPassword ? "Hide password" : "Show password"}
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
                  {...commonTextFieldProps}
                  fullWidth
                  select
                  name="marketing_unique"
                  value={formData.marketing}
                  onChange={handleChange}
                  label="How did you hear about us?"
                  disabled={otpSent}
                >
                  {allMarketing.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptedTnC}
                      onChange={(e) => setAcceptedTnC(e.target.checked)}
                      name="acceptedTnC"
                    />
                  }
                  label={
                    <span>
                      I accept the{" "}
                      <a
                        href="/policy/termandcondition"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms and Conditions
                      </a>
                    </span>
                  }
                />
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Fab variant="extended" color="primary" onClick={handleSendOtpClick}>
                  <FcFeedback style={{ marginRight: 8 }} />
                  Send Email OTP
                </Fab>
              </Grid>
            </>
          ) : (
            <>
              <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
                <TextField
                  {...commonTextFieldProps}
                  fullWidth
                  name="otp_unique"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  label="Enter Email OTP"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: "center", color: "text.secondary", mb: 2 }}>
                  Check your email spam/junk folder if OTP is not received in inbox.
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Fab variant="extended" color="primary" onClick={handleSignUpClick}>
                  <FcFeedback style={{ marginRight: 8 }} />
                  Register Now
                </Fab>
              </Grid>
            </>
          )}
        </Grid>
      </form>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Registration Successful!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your registration was successful. Click the button below to login.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" style={{ backgroundColor: "#3f51b5", color: "#fff" }}>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SignUpForm;