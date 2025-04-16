"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { 
  Box, 
  Button, 
  CircularProgress, 
  Typography,
  Checkbox,
  FormControlLabel,
  Divider
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import "./stripePayStyle.css";
import { myCourseService, transactionService } from "../../services";
import CourseCheckoutForm from "./CourseCheckoutForm";

const stripePromise = loadStripe("pk_live_51OutBL02jxqBr0evcB8JFdfck1DrMljCBL9QaAU2Qai5h3IUdGgh22m3DCu1VMmWvn4tqEFcFdwfT34l0xh8e28s00YTdA2C87");
// const stripePromise = loadStripe("pk_test_51OutBL02jxqBr0ev5h0jPo7PWCsg0z3dDaAtKPF3fm8flUipuFtX7GFTWO2eLwVe6JzsJOZJ0f2tQ392tCgDWwdt00iCW9Qo66");


// this is for course
export default function CourseStripePay({
   isMobile, setStep, data, selectedChild, selectedDates, submittedId, totalAmount,
    setSubmitted, setSubmittedId, preserveSelections, setPreserveSelections  }) {
  
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [buyCourseId, setBuyCourseId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [useBalance, setUseBalance] = useState(true);
  const [message, setMessage] = useState("");

  // Calculate the amount to be paid through Stripe
  const amountToPayWithStripe = useBalance 
    ? Math.max(0, totalAmount - currentBalance) 
    : totalAmount;

  const handleGetCurrentAmount = async () => {
    const response = await transactionService.getSelfCurrentAmount();
    setCurrentBalance(response.currentBalance);
  };

  useEffect(() => {
    handleGetCurrentAmount();
  }, []);

  const handleConfirmPaymentWithBalance = async (courseId) => {
    setLoading(true);
    setError("");
    
    try {
      // Process payment with balance
      const courseResponse = await myCourseService.buyCourseWithBalanceOnly(courseId);

      if (courseResponse.variant === "success") {
        setMessage("Payment successful");
        window.location.href = `/payment/verify/${courseId}`;
      } else {
        setError(courseResponse.message || "An unexpected error occurred.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handlePaymentInitialization = async () => {
    if (!termsAccepted) {
      setError("Please accept our terms before proceeding.");
      return;
    }
    try {
      setLoading(true);
      setButtonDisabled(true);
      setError("");

      // If balance covers the entire amount, we don't need to create a payment intent
      if (useBalance && amountToPayWithStripe <= 0) {
        // Handle the case where balance covers everything
        handleConfirmPaymentWithBalance(submittedId);
        setButtonDisabled(false);
        return;
      }

      const response = await myCourseService.getPaymentIntentApi({
        items: [{ id: submittedId }],
        amountToCharge: amountToPayWithStripe
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

  const handleBack = () => {
    setPreserveSelections(true);
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
    <>
          

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
                    onClick={handleBack}
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
                  Book {data.courseTitle} for <span style={{ fontWeight: 'bold' }}>{selectedChild.childName}</span>

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
                    <Box sx={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: 2,
                      '& > *': {
                        flex: '0 1 auto',
                      }
                    }}>
                      {selectedDates.map((date, index) => {
                        // Convert date string to desired format (assuming input date is in valid format)
                        const formattedDate = new Date(date).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        });
                        
                        return (
                          <Typography 
                            key={index} 
                            variant="body1" 
                            color="text.primary" 
                            sx={{ 
                              fontWeight: 500,
                              backgroundColor: '#e3f2fd',
                              padding: '4px 12px',
                              borderRadius: '16px',
                              fontSize: '0.9rem'
                            }}
                          >
                            {formattedDate}
                          </Typography>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Current Super Coins Display */}
                {currentBalance > 0 && (
                  <Box sx={{ 
                    width: '100%', 
                    mb: 2,
                    p: 2,
                    bgcolor: '#f0f7ff',  // Light blue background
                    borderRadius: 1,
                    border: '1px solid #bbd6fe'
                  }}>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                      Your Current Super Coins
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        £{currentBalance.toFixed(2)}
                      </Typography>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={useBalance}
                            onChange={(e) => setUseBalance(e.target.checked)}
                            color="primary"
                          />
                        }
                        label="Use coins for this payment"
                      />
                    </Box>
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
                  
                  {currentBalance > 0 && useBalance && (
                    <>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 1
                      }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Applied from Balance
                        </Typography>
                        <Typography variant="body1" color="success.main" sx={{ fontWeight: 600 }}>
                          -£{Math.min(currentBalance, totalAmount).toFixed(2)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                      }}>
                        <Typography variant="subtitle1" color="text.secondary">
                          Amount to Pay
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                          £{amountToPayWithStripe.toFixed(2)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>

                {/* Terms and Cancellation Policy Acceptance */}
                <Box sx={{ width: '100%' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        color="primary"
                        sx={{ padding: 0, marginRight: 1 }}
                      />
                    }
                    label={
                      <Typography variant="body2">
                           Please confirm if you accept our terms, including the{" "}
                        <a 
                          href="/policy/cancellationPolicy" 
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
                    sx={{ alignItems: 'flex-start' }}
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
                    backgroundColor: (buttonDisabled || loading || !termsAccepted) ? '#fc7658' : 'primary.main',
                    '&:disabled': {
                      backgroundColor: '#fc7658',
                      color: 'white'
                    }
                  }}
                >
                  {loading ? "Processing..." : useBalance && amountToPayWithStripe <= 0 
                    ? "Complete Booking with Balance" 
                    : `Pay £${amountToPayWithStripe.toFixed(2)} with Debit Card`}
                </Button>
                {error && (
                  <Typography color="error" variant="body2">
                    {error}
                  </Typography>
                )}
                {message && (
                  <Typography color="success.main" variant="body2">
                    {message}
                  </Typography>
                )}
              </Box>
            </>
          ) : (
            <Elements options={options} stripe={stripePromise} style={{ width: '100%' }}>
              <CourseCheckoutForm 
                data={data}
                isMobile={isMobile}
                setClientSecret={setClientSecret}
                selectedChild={selectedChild}
                buyCourseId={buyCourseId}
                totalAmount={totalAmount}
              />
            </Elements>
          )}

    </>
  );
}