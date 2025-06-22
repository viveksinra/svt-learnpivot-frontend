"use client";
import React, { useEffect, useState } from "react";
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
import { mockTestService, transactionService } from "../../services";
import MockCheckoutForm from "./MockCheckoutForm";
import AnimatedButton from "../Common/AnimatedButton";
import FullPageLoadingTransparent from "../Common/FullPageLoadingTransparent";
import { FRONT_ENDPOINT } from "@/app/utils";
import frontKey from "@/app/utils/frontKey";

const stripeKeys = frontKey.stripeKeys || (frontKey.default ? frontKey.default.stripeKeys : []);

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
  // State to track acceptance of the terms
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  // New state to track if user wants to Use coins
  const [useBalance, setUseBalance] = useState(true);
  // Calculate the amount to be paid through Stripe
  const amountToPayWithStripe = useBalance 
    ? Math.max(0, totalAmount - currentBalance) 
    : totalAmount;
  // Add message state for feedback to user
  const [message, setMessage] = useState("");

  const handleGetCurrentAmount = async () => {
    const response = await transactionService.getSelfCurrentAmount();
    setCurrentBalance(response.currentBalance);
  };

  useEffect(() => {
    handleGetCurrentAmount();
  }, []);
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
  const handleConfirmPaymentWithBalance = async (mockId) => {
    setLoading(true);
    setError("");
    
    try {
      // Check if all batches are free (available)
      let res = await mockTestService.isFullByBuyMock({
        id: `${mockId}`
      });
      
      if (res.variant !== "success" || !res?.isFree) {
        setError("Some Batches got full. Refresh and try again later.");
        setLoading(false);
        return;
      }

      // Process payment with balance
      const mockResponse = await mockTestService.buyMockWithBalanceOnly(mockId);

      if (mockResponse.variant === "success") {
        setMessage("Payment successful");
        window.location.href = `${FRONT_ENDPOINT}/payment/verifyMock/${mockId}`;
      } else {
        setError(mockResponse.message || "An unexpected error occurred.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
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
      useBalance: useBalance && currentBalance > 0, // Flag to indicate if we're using balance
      balanceToUse: useBalance ? Math.min(currentBalance, totalAmount) : 0 // Amount of balance to use
    };

    try {
      // Step 1: Buy mock test
      setLoading(true);
      setButtonDisabled(true);
      setError("");
      const mockResponse = await mockTestService.buyMockStepOne(buyData);
      
      if (mockResponse.variant !== "success" || !mockResponse._id) {
        setError("Failed to create mock test order");
        setLoading(false);
        setButtonDisabled(false);
        return;
      }

      // Update state with mock test details
      setSubmitted(true);
      setSubmittedId(mockResponse._id);
      setTotalAmount(mockResponse.totalAmount);

      // If balance covers the entire amount, we don't need to create a payment intent
      if (useBalance && amountToPayWithStripe <= 0) {
        // Handle the case where balance covers everything
        handleConfirmPaymentWithBalance(mockResponse._id);
        setButtonDisabled(false);
        return;
      }

      // Step 2: Get payment intent for remaining amount
      const paymentResponse = await mockTestService.getPaymentIntentApi({
        items: [{ id: mockResponse._id }],
        amountToCharge: amountToPayWithStripe
      });

      if (paymentResponse.variant === "success") {
        setClientSecret(paymentResponse.clientSecret);
        setBuyMockId(paymentResponse.buyMockId);
        setLoading(false);
        setButtonDisabled(false);
      } else {
        setError(paymentResponse.message || "Failed to initialize payment");
        setLoading(false);
        setButtonDisabled(false);
      }

    } catch (error) {
      console.error("Payment process error:", error);
      setError(error.message || "An unexpected error occurred. Please try again later.");
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

  // compute dynamic publishable key
  const publishableKey = React.useMemo(() => {
    const keyId = data?.stripeAccount?.id || "key1";
    const obj = stripeKeys.find(k => k.id === keyId) || stripeKeys[0];
    return obj.LivePublishablekey;
  }, [data]);

  const stripePromise = React.useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <>
      {loading && <FullPageLoadingTransparent message="Processing your payment..." />}
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
                Your Super Coins Balance
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
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <AnimatedButton 
            variant="contained" 
            startIcon={<CreditCardIcon />}
            onClick={handlePaymentClick}
            disabled={buttonDisabled || loading || !termsAccepted}
            sx={{
              minWidth: 240,
              py: 1.5,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            {useBalance && amountToPayWithStripe <= 0 
              ? "Complete Booking with Balance" 
              : `Pay £${amountToPayWithStripe.toFixed(2)} with Debit Card`}
          </AnimatedButton>
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
            amountToPayWithStripe={amountToPayWithStripe}
          />
        </Elements>
      )}
    </>
  );
}
