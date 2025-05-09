import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import "./mockStripePayStyle.css";
import { FRONT_ENDPOINT } from "@/app/utils";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { mockTestService } from "@/app/services";

// Internal styles
const styles = {
  paymentSummary: {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    padding: '8px 12px',
    marginBottom: '1px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: '1.875rem',
    color: '#64748b',
  },
  amount: {
    fontSize: '2rem',
    fontWeight: 600,
    color: '#0f172a',
  },
  buttonText: {
    minHeight: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    border: '3px solid #ffffff',
    borderTopColor: 'transparent',
    animation: 'spin 1s linear infinite',
  },
  message: {
    color: '#dc2626',
    fontSize: '0.875rem',
    textAlign: 'center',
    marginTop: '8px',
  },
};

export default function MockCheckoutForm({data, setClientSecret, selectedChild, buyMockId, totalAmount, isMobile, amountToPayWithStripe}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

      async function checkIfAllBatchFree() {
        try {
          let res = await mockTestService.isFullByBuyMock({
            id: `${buyMockId}`
          });
          if (res.variant === "success") {

            return res?.isFree;
          } else {

            return false;
          }
        } catch (error) {
          console.error("Error fetching data:", error);

          return false;

        }   
      }

    const isAllFree = await checkIfAllBatchFree()

    if(!isAllFree) {
      setMessage("Some Batches got full. Refresh and try again later.");
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${FRONT_ENDPOINT}/payment/verifyMock/${buyMockId}`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <>
      {/* Payment Form */}
      <form 
        id="payment-form" 
        style={{ 
          width: isMobile ? '100%' : 'auto' 
        }} 
        onSubmit={handleSubmit}
      >
        <Box sx={{ display: 'flex',  alignItems: 'center', mb: 3, gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setClientSecret("")}
            sx={{ 
              width: isMobile?"30%":'20%',
              minWidth: 'auto',
              color: 'white', 
              backgroundColor: '#fc7658', 
              '&:hover': { backgroundColor: 'darkred' }
            }}
          >
            Back
          </Button>
          <Typography variant="h7" sx={{ width: isMobile?"70%":'80%', fontWeight: 400 }}>
       Book {data.testType?.label} Mock Test for <span style={{ fontWeight: 'bold' }}>{selectedChild.childName}</span>
          </Typography>
        </Box>
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <button 
          disabled={isLoading || !stripe || !elements} 
          id="submit"
        >
          <span style={styles.buttonText}>
            {isLoading ? (
              <div style={styles.spinner}></div>
            ) : (
              `Pay £${amountToPayWithStripe.toFixed(2)} `
            )}
          </span>
        </button>
        
        {/* Error/Success Message */}
        {message && <div style={styles.message}>{message}</div>}
      </form>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}