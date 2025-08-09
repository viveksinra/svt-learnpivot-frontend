"use client";

import React, { useEffect, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Box, Button, CircularProgress, Typography, Checkbox, FormControlLabel, Divider } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import "../../courseStripePay/stripePayStyle.css";
import { paperService, transactionService } from "@/app/services";
import frontKey from "@/app/utils/frontKey";
import { FRONT_ENDPOINT } from "@/app/utils";

const stripeKeys = frontKey.stripeKeys || (frontKey.default ? frontKey.default.stripeKeys : []);

// Mirrors CourseStripePay for Papers
export default function PaperStripePay({
  isMobile, setStep, data, selectedChild, submittedId, totalAmount,
  setSubmitted, setSubmittedId, preserveSelections, setPreserveSelections
}) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [useBalance, setUseBalance] = useState(true);
  const [message, setMessage] = useState("");

  const amountToPayWithStripe = useBalance 
    ? Math.max(0, (Number(totalAmount || 0)) - currentBalance) 
    : Number(totalAmount || 0);

  const handleGetCurrentAmount = async () => {
    const response = await transactionService.getSelfCurrentAmount();
    setCurrentBalance(response.currentBalance);
  };

  useEffect(() => {
    handleGetCurrentAmount();
  }, []);

  const handleConfirmPaymentWithBalance = async (buyPaperId) => {
    setLoading(true);
    setError("");
    try {
      const paperResponse = await paperService.buyPaperWithBalanceOnly(buyPaperId);
      if (paperResponse.variant === "success") {
        setMessage("Payment successful");
        window.location.href = `${FRONT_ENDPOINT}/payment/verifyPaper/${buyPaperId}`;
      } else {
        setError(paperResponse.message || "An unexpected error occurred.");
        setLoading(false);
      }
    } catch (e) {
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

      // If balance covers entire amount
      if (useBalance && amountToPayWithStripe <= 0) {
        handleConfirmPaymentWithBalance(submittedId);
        setButtonDisabled(false);
        return;
      }

      // NOTE: As of now, backend has no dedicated stripePay route for papers.
      // We rely on balance-only flow or future extension. For now, error if card flow is needed.
      setError("Card payment for Papers is not enabled yet. Please use balance-only.");
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
      setButtonDisabled(false);
    }
  };

  const handleBack = () => {
    setPreserveSelections(true);
    setSubmitted(false);
  };

  // Determine publishable key
  const publishableKey = useMemo(() => {
    const keyId = data?.stripeAccount?.id || "key1";
    const obj = stripeKeys.find(k => k.id === keyId) || stripeKeys[0];
    return obj.LivePublishablekey;
  }, [data]);

  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey]);

  return (
    <>
      {!clientSecret ? (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, padding: isMobile ? "20px" : "1px" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                sx={{ width: isMobile ? "30%" : '20%', minWidth: 'auto', color: 'white', backgroundColor: '#fc7658', '&:hover': { backgroundColor: 'darkred' } }}
              >
                Back
              </Button>
              <Typography variant="h7" sx={{ width: isMobile ? "70%" : '80%', fontWeight: 400 }}>
                Buy Paper Set "{data.setTitle}"
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Secure Payment
              </Typography>
              <CloseIcon onClick={() => { setStep(3); setSubmitted(false); }} style={{ cursor: 'pointer' }} />
            </Box>

            {/* Current Balance */}
            {currentBalance > 0 && (
              <Box sx={{ width: '100%', mb: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px solid #bbd6fe' }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                  Your Current Super Coins
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                    £{currentBalance.toFixed(2)}
                  </Typography>
                  <FormControlLabel
                    control={<Checkbox checked={useBalance} onChange={(e) => setUseBalance(e.target.checked)} color="primary" />}
                    label="Use coins for this payment"
                  />
                </Box>
              </Box>
            )}

            {/* Amount Display */}
            <Box sx={{ width: '100%', mb: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1, border: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Total Amount
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                  £{Number(totalAmount || 0).toFixed(2)}
                </Typography>
              </Box>

              {currentBalance > 0 && useBalance && (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      Applied from Balance
                    </Typography>
                    <Typography variant="body1" color="success.main" sx={{ fontWeight: 600 }}>
                      -£{Math.min(currentBalance, Number(totalAmount || 0)).toFixed(2)}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

            {/* Terms */}
            <Box sx={{ width: '100%' }}>
              <FormControlLabel
                control={<Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} color="primary" sx={{ padding: 0, marginRight: 1 }} />}
                label={
                  <Typography variant="body2">
                    Please confirm if you accept our terms, including the <a href="/policy/cancellationPolicy" target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold", fontSize: "1rem", textDecoration: "underline", color: "#1976d2" }}>CANCELLATION Policy</a>.
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
              sx={{ minWidth: 240, py: 1.5, textTransform: "none", fontSize: "1rem", backgroundColor: (buttonDisabled || loading || !termsAccepted) ? '#fc7658' : 'primary.main', '&:disabled': { backgroundColor: '#fc7658', color: 'white' } }}
            >
              {loading ? "Processing..." : useBalance && amountToPayWithStripe <= 0 ? "Complete Booking with Balance" : `Pay £${amountToPayWithStripe.toFixed(2)} with Debit Card`}
            </Button>
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            {message && (
              <Typography color="success.main" variant="body2" sx={{ mt: 1 }}>
                {message}
              </Typography>
            )}
          </Box>
        </>
      ) : (
        <Elements options={{ clientSecret }} stripe={stripePromise} style={{ width: '100%' }}>
          {/* Intentionally left for future PaperCheckoutForm once stripePay for paper added */}
        </Elements>
      )}
    </>
  );
}


