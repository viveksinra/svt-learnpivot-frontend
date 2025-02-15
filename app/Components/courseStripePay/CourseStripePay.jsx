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
  Container
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
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
export default function CourseStripePay({ submittedId }) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [buyCourseId, setBuyCourseId] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [error, setError] = useState("");

  const handlePaymentInitialization = async () => {
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
              <Typography variant="h6" component="h2" gutterBottom>
                Secure Payment
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CreditCardIcon />}
                onClick={handlePaymentInitialization}
                disabled={buttonDisabled || loading}
                sx={{
                  minWidth: 240,
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {loading ? "Processing..." : "Pay with Debit Card"}
              </Button>
              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}
            </>
          ) : (
            <Elements options={options} stripe={stripePromise}>
              <CheckoutForm buyCourseId={buyCourseId} />
            </Elements>
          )}
        </Box>
      </StyledPaper>
    </Container>
  );
}