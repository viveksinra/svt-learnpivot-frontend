"use client";
import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { 
  Box, 
  Button, 
  CircularProgress, 
  Paper,
  Typography,
  Container,
  Divider,
  Checkbox,            // <-- imported Checkbox
  FormControlLabel     // <-- imported FormControlLabel
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { styled } from "@mui/material/styles";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import "./mockStripePayStyle.css";
import { mockTestService } from "../../services";
import MockCheckoutForm from "./MockCheckoutForm";

const stripePromise = loadStripe("pk_live_51OutBL02jxqBr0evcB8JFdfck1DrMljCBL9QaAU2Qai5h3IUdGgh22m3DCu1VMmWvn4tqEFcFdwfT34l0xh8e28s00YTdA2C87");

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

export default function MockStripePay({isMobile, setStep, data, selectedChild, selectedBatch, submittedId, setTotalAmount, totalAmount, setSubmitted, setSubmittedId }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [buyMockId, setBuyMockId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [error, setError] = useState("");
  // New state to track acceptance of the terms
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Format the date and time
  const formatBatchDateTime = (batch) => {
    if (!batch || !batch.date) return null;
    
    const dateObj = new Date(batch.date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    });
    return `${formattedDate} @ ${batch.startTime} - ${batch.endTime}`;
  };

  const handlePaymentClick = async () => {
    // Validate prerequisites
    if (!termsAccepted) {
      setError("Please accept our terms before proceeding.");
      return;
    }

    if (totalAmount === 0) {
      setError("Invalid payment amount");
      return;
    }

    // Prepare data for mock test purchase
    const buyData = {
      mockTestId: data._id,
      selectedBatch,
      selectedChild,
    };

    try {
      // Step 1: Buy mock test
      setLoading(true);
      setButtonDisabled(true);
      setError("");
      const mockResponse = await mockTestService.buyMockStepOne(buyData);
      
      if (mockResponse.variant !== "success" || !mockResponse._id) {
        setError("Failed to create mock test order");
        return;
      }

      // Update state with mock test details
      setSubmitted(true);
      setSubmittedId(mockResponse._id);
      setTotalAmount(mockResponse.totalAmount);

      // Step 2: Get payment intent
      const paymentResponse = await mockTestService.getPaymentIntentApi({
        items: [{ id: mockResponse._id }],
      });

      if (paymentResponse.variant === "success") {
        setClientSecret(paymentResponse.clientSecret);
        setBuyMockId(paymentResponse.buyMockId);
      } else {
        setError(paymentResponse.message || "Failed to initialize payment");
      }

    } catch (error) {
      console.error("Payment process error:", error);
      setError(error.message || "An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  const handleUpdateBatch = () => {
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
    <>
      {!clientSecret ? (
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
              Book {data.testType?.label} Mock Test for <span style={{ fontWeight: 'bold' }}>{selectedChild.childName}</span>
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
            <CloseIcon onClick={handleUpdateBatch} style={{ cursor: 'pointer' }} />
          </Box>
          
          {/* Batch Details Display */}
          {selectedBatch && selectedBatch[0] && (
            <Box sx={{ 
              width: '100%', 
              mb: 2,
              p: 2,
              bgcolor: '#f8fafc',
              borderRadius: 1,
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Selected Batches
              </Typography>
              {selectedBatch.map((batch, index) => ( 
                <Typography key={index} variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                  {formatBatchDateTime(batch)}
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
                    href="/policy/cancellationPolicy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      fontWeight: "bold", 
                      fontSize: "1rem",  // slightly bigger font size
                      textDecoration: "underline",
                      color: "#1976d2"    // matching primary color
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
            onClick={handlePaymentClick}
            disabled={buttonDisabled || loading || !termsAccepted}  // <-- disabled if terms are not accepted
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
      ) : (
        <Elements options={options} stripe={stripePromise} style={{ width: '100%', backgroundColor:"green" }}>
          <MockCheckoutForm 
            data={data} 
            isMobile={isMobile} 
            setClientSecret={setClientSecret} 
            selectedChild={selectedChild} 
            buyMockId={buyMockId} 
            totalAmount={totalAmount} 
          />
        </Elements>
      )}
    </>
  );
}
