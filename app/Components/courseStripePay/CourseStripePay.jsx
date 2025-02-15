"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { 
  Box, 
  Button, 
  CircularProgress, 
  Paper,
  Typography,
  Container,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from "@mui/material/styles";

import "./stripePayStyle.css";
import { myCourseService } from "../../services";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_live_51OutBL02jxqBr0evcB8JFdfck1DrMljCBL9QaAU2Qai5h3IUdGgh22m3DCu1VMmWvn4tqEFcFdwfT34l0xh8e28s00YTdA2C87");
// const stripePromise = loadStripe("pk_test_51OutBL02jxqBr0ev5h0jPo7PWCsg0z3dDaAtKPF3fm8flUipuFtX7GFTWO2eLwVe6JzsJOZJ0f2tQ392tCgDWwdt00iCW9Qo66");

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));
// this is for course
export default function CourseStripePay({ isMobile, setStep, data, selectedChild, selectedDates, submittedId, totalAmount, setSubmitted, setSubmittedId  }) {
  console.log({ isMobile, setStep, data, selectedChild, selectedDates, submittedId, totalAmount, setSubmitted, setSubmittedId  })
  
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [buyCourseId, setBuyCourseId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handlePaymentInitialization = async () => {
    if (!termsAccepted) {
      setError("Please accept our terms before proceeding.");
      return;
    }
    try {
      setLoading(true);
      setButtonDisabled(true);
      setError("");

      const response = await myCourseService.getPaymentIntentApi({
        items: [{ id: submittedId }],
      });

      if (response.variant === "success") {
        setClientSecret(response.clientSecret);
        setBuyCourseId(response.buyCourseId);
      } else {
        if (response.message){
           setError(response.message);
          } else {
            setError("Failed to initialize payment. Please try again.");

          }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  const handleUpdateCourse = () => {
    setStep(3);
    setSubmitted(false);
  };

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#1976d2",
      colorBackground: "#ffffff",
      borderRadius: "4px",
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper elevation={3}>
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          gap: 2 
        }}>
          {!clientSecret ? (
            <>
              <Box sx={{ 
                display: "flex", 
                flexDirection: "column",
                alignItems: "flex-start",
                gap: 2,
                padding: isMobile ? "20px" : "1px"
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                  <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => { setSubmitted(false); setStep(3); }}
                    sx={{ 
                      width: isMobile ? "30%" : '20%',
                      minWidth: 'auto',
                      color: 'white', 
                      backgroundColor: '#fc7658', 
                      '&:hover': { backgroundColor: 'darkred' }
                    }}
                  >
                    Back
                  </Button>
                  <Typography variant="h7" sx={{ width: isMobile ? "70%" : '80%', fontWeight: 400 }}>
                    Book {data.courseType?.label} Course for <span style={{ fontWeight: 'bold' }}>{selectedChild.childName}</span>
                  </Typography>
                </Box>

                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  width: "100%" 
                }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Secure Payment
                  </Typography>
                  <CloseIcon onClick={handleUpdateCourse} style={{ cursor: 'pointer' }} />
                </Box>

                {/* Course Details Display */}
                {selectedDates && selectedDates.length > 0 && (
                  <Box sx={{ 
                    width: '100%', 
                    mb: 2,
                    p: 2,
                    bgcolor: '#f8fafc',
                    borderRadius: 1,
                    border: '1px solid #e2e8f0'
                  }}>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      Selected Course Dates
                    </Typography>
                    {selectedDates.map((date, index) => (
                      <Typography key={index} variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                        {date}
                      </Typography>
                    ))}
                  </Box>
                )}

                {/* Amount Display */}
                <Box sx={{ 
                  width: '100%', 
                  mb: 2,
                  p: 2,
                  bgcolor: '#f8fafc',
                  borderRadius: 1,
                  border: '1px solid #e2e8f0'
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1
                  }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      £{totalAmount?.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {/* Terms and Cancellation Policy Acceptance */}
                <Box sx={{ width: '100%' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Please confirm if you accept our terms, including the{" "}
                        <a 
                          href="/policy/privacyPolicy" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ 
                            fontWeight: "bold", 
                            fontSize: "1rem",
                            textDecoration: "underline",
                            color: "#1976d2"
                          }}
                        >
                          CANCELLATION Policy
                        </a>.
                      </Typography>
                    }
                  />
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CreditCardIcon />}
                  onClick={handlePaymentInitialization}
                  disabled={buttonDisabled || loading || !termsAccepted}
                  sx={{
                    minWidth: 240,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                  }}
                >
                  {loading ? "Processing..." : `Pay £${totalAmount?.toFixed(2)} with Debit Card`}
                </Button>
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            <Elements options={options} stripe={stripePromise} style={{ width: '100%' }}>
              <CheckoutForm 
                data={data}
                isMobile={isMobile}
                setClientSecret={setClientSecret}
                selectedChild={selectedChild}
                buyCourseId={buyCourseId}
                totalAmount={totalAmount}
              />
            </Elements>
          )}
        </Box>
      </StyledPaper>
    </Container>
  );
}