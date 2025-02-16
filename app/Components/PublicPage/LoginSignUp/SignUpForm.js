"use client";
import { useState, useContext, useEffect } from "react";
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
  const [passwordFieldId, setPasswordFieldId] = useState('');
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

  useEffect(() => {
    const generateId = () => {
      setPasswordFieldId(`pass_${Math.random().toString(36).slice(2)}_${Date.now()}`);
    };
    
    generateId();
    const interval = setInterval(generateId, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const commonTextFieldProps = {
    autoComplete: "off",
    autoCorrect: "off",
    autoCapitalize: "off",
    spellCheck: "false",
    inputProps: {
      autoComplete: "chrome-off",
      'data-lpignore': "true",
      'data-form-type': "other",
      'data-private': "true",
      'role': "presentation",
      'autocorrect': "off",
      'autocapitalize': "off",
      'aria-hidden': "true",
      style: { 
        'webkitTextSecurity': 'disc',
      }
    }
  };


// Enhanced dummy fields component with more honeypots
const DummyFields = () => (
  <div style={{ opacity: 0, position: 'absolute', left: '-9999px', pointerEvents: 'none' }}>
    {/* Multiple sets of dummy fields to confuse autofill */}
    <input type="text" name="username" autoComplete="off" tabIndex="-1" />
    <input type="password" name="password" autoComplete="off" tabIndex="-1" />
    <input type="email" name="email" autoComplete="off" tabIndex="-1" />
    <input type="text" name="firstname" autoComplete="off" tabIndex="-1" />
    <input type="text" name="lastname" autoComplete="off" tabIndex="-1" />
    <input type="text" name="postcode" autoComplete="off" tabIndex="-1" />
    {/* Additional honeypot fields */}
    <input type="text" name="address" autoComplete="off" tabIndex="-1" />
    <input type="text" name="phone" autoComplete="off" tabIndex="-1" />
  </div>
);

// Enhanced secure input field component
const SecureTextField = ({ name, label, type = "text", value, onChange, ...props }) => {
  const fieldId = `${name}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  
  return (
    <TextField
      {...commonTextFieldProps}
      fullWidth
      type={type}
      name={fieldId}
      id={fieldId}
      label={label}
      value={value}
      onChange={onChange}
      onFocus={(e) => {
        // Clear and restore value to prevent autofill
        const currentValue = e.target.value;
        e.target.value = '';
        setTimeout(() => {
          e.target.value = currentValue;
        }, 0);
      }}
      InputProps={{
        ...commonTextFieldProps.inputProps,
        autoComplete: "new-password",
        style: {
          backgroundColor: '#ffffff'
        }
      }}
      sx={{
        '& .MuiInputBase-input': {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 100px #fff inset !important',
            WebkitTextFillColor: '#000 !important',
            transition: 'background-color 5000s ease-in-out 0s',
          },
        },
      }}
      {...props}
    />
  );
};

// Enhanced password field component
const PasswordField = () => {
  const [localPassword, setLocalPassword] = useState('');
  const fieldId = `pass_${Math.random().toString(36).slice(2)}_${Date.now()}`;
  
  useEffect(() => {
    setPassword(localPassword);
  }, [localPassword]);

  return (
    <div className="password-wrapper" style={{ position: 'relative' }}>
      <SecureTextField
        type={showPassword ? "text" : "password"}
        name={fieldId}
        label="Password"
        value={localPassword}
        onChange={(e) => setLocalPassword(e.target.value)}
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
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
                tabIndex="-1"
              >
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

  return (
    <Container>
      <form 
      autoComplete="off" 
      onSubmit={(e) => e.preventDefault()} 
      data-lpignore="true"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
      >
         <DummyFields />
        {alert && (
          <Box mb={2}>
            <Alert severity={alert.severity}>{alert.message}</Alert>
          </Box>
        )}

        <Grid container spacing={2}>
          {!otpSent ? (
            <>
              <Grid item xs={12} md={6}>
                <SecureTextField
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={otpSent}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SecureTextField
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={otpSent}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SecureTextField
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={otpSent}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SecureTextField
                  name="mobile"
                  label="WhatsApp Number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  disabled={otpSent}
                  placeholder="e.g. 07123456789"
                />
              </Grid>

              {/* Address fields using SecureTextField */}
              <Grid item xs={12}>
                <AddressSelect
                  value={formData.address1}
                  onChange={handleChange}
                  error={!!errors.address1}
                  helperText={errors.address1}
                  disabled={otpSent}
                  inputProps={{
                    ...commonTextFieldProps.inputProps,
                    name: `address1_${Math.random().toString(36).slice(2)}`
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SecureTextField
                  name="address2"
                  label="Address Line 2"
                  value={formData.address2}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SecureTextField
                  name="address3"
                  label="Address Line 3"
                  value={formData.address3}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SecureTextField
                  name="city"
                  label="City/Town"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  error={!!errors.city}
                  helperText={errors.city}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <SecureTextField
                  name="postcode"
                  label="Postcode"
                  value={formData.postcode}
                  onChange={handleChange}
                  required
                  error={!!errors.postcode}
                  helperText={errors.postcode}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <PasswordField />
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
                        style={{ color: '#1976d2', textDecoration: 'underline' }}
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