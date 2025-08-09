"use client";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery, Container, useTheme, Grid } from '@mui/material/';
import MySnackbar from "../../MySnackbar/MySnackbar";
import SmallOnePaperSet from "../../PublicPage/Paper/SmallOnePaperSet";
import PaperEnqForm from "./PaperEnqForm";
import PaperStripePay from "./PaperStripePay";

// Mirrors the Course BuyComponent layout for Papers
export default function PaperBuyComponent({ data }) {
  const snackRef = useRef();
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState("");
  const [selectedChild, setSelectedChild] = useState(null);
  const [step, setStep] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [preserveSelections, setPreserveSelections] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submitted, step]);

  return (
    <section style={{ marginBottom: "10px", paddingTop: isMobile ? "0px" : "20px" , paddingBottom:150 }} id="enquiry">
      <Container maxWidth="xl" style={{ marginTop: "40px" }}>
        <Grid container>
          <Grid style={{ paddingRight: isMobile ? "0px" : "20px" }} item xs={12} lg={6}>
            {!isMobile && (
              <SmallOnePaperSet data={data} totalAmount={totalAmount} />
            )}
          </Grid>
          {!isMobile && (
            <Grid item xs={12} lg={6}>
              {submitted ? (
                <PaperStripePay 
                  isMobile={isMobile}
                  data={data} 
                  setSubmitted={setSubmitted}
                  setSubmittedId={setSubmittedId}
                  setStep={setStep}
                  selectedChild={selectedChild}
                  submittedId={submittedId} 
                  totalAmount={totalAmount}
                  preserveSelections={preserveSelections}
                  setPreserveSelections={setPreserveSelections}
                />
              ) : (
                <PaperEnqForm 
                  isMobile={false}
                  data={data} 
                  setStep={setStep}
                  step={step}
                  submitted={submitted}
                  setSubmitted={setSubmitted}
                  setSubmittedId={setSubmittedId}
                  selectedChild={selectedChild} 
                  setSelectedChild={setSelectedChild}
                  setTotalAmount={setTotalAmount}
                  totalAmount={totalAmount}
                  preserveSelections={preserveSelections}
                  setPreserveSelections={setPreserveSelections}
                />
              )}
            </Grid>
          )}
        </Grid>
      </Container>
      {isMobile && (
        <>
          {submitted ? (
            <PaperStripePay 
              isMobile={isMobile}
              data={data} 
              setSubmitted={setSubmitted}
              setSubmittedId={setSubmittedId}
              setStep={setStep}
              selectedChild={selectedChild}
              submittedId={submittedId} 
              totalAmount={totalAmount}
              preserveSelections={preserveSelections}
              setPreserveSelections={setPreserveSelections}
            />
          ) : (
            <PaperEnqForm 
              isMobile={true}
              data={data} 
              setStep={setStep}
              step={step}
              submitted={submitted}
              setSubmitted={setSubmitted}
              setSubmittedId={setSubmittedId}
              selectedChild={selectedChild} 
              setSelectedChild={setSelectedChild}
              setTotalAmount={setTotalAmount}
              totalAmount={totalAmount}
              preserveSelections={preserveSelections}
              setPreserveSelections={setPreserveSelections}
            />
          )}
        </>
      )}
      <MySnackbar ref={snackRef} />
    </section>
  );
}

