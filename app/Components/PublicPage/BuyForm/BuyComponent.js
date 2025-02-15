"use client";
import { useEffect, useState, useRef } from "react";
import { useMediaQuery, Container, useTheme, Grid } from '@mui/material/';
import SmallOneClass from "../Classes/SmallOneClass";
import MySnackbar from "../../MySnackbar/MySnackbar";
import CourseEnqForm from "./CourseEnqForm";
import CourseStripePay from "../../courseStripePay/CourseStripePay";

const BuyComponent = ({ data }) => {
  const snackRef = useRef();  
  const [submitted, setSubmitted] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [totalAmount, setTotalAmount] = useState("");
  const [submittedId, setSubmittedId] = useState("");
  const [selectedChild, setSelectedChild] = useState(null);
  const [step, setStep] = useState(1);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <section style={{ marginBottom: "10px", paddingTop: isMobile ? "0px" : "20px" }} id="enquiry">
      <Container maxWidth="xl" style={{ marginTop: "40px" }}>
        <Grid container>
          <Grid style={{ paddingRight: isMobile ? "0px" : "20px" }} item xs={12} lg={6}>
            {!isMobile && (
              <SmallOneClass 
                data={data} 
                selectedChild={selectedChild}
                totalAmount={totalAmount} 
                selectedDates={selectedDates} 
              />
            )}
          </Grid>
          {!isMobile && (
            <Grid item xs={12} lg={6}>
              {submitted ? (
                <CourseStripePay 
                isMobile={isMobile}
                data={data} 
     
                setSubmitted={setSubmitted}
                  setSubmittedId={setSubmittedId}
                  setStep={setStep}
                  selectedChild={selectedChild}
                  selectedDates={selectedDates}
                  submittedId={submittedId} totalAmount={totalAmount}
                />
              ) : (
                <CourseEnqForm 
                  isMobile={false}
                  data={data} 
                  setStep={setStep}
                  step={step}
                  submitted={submitted}
                  setSubmitted={setSubmitted}
                  setSubmittedId={setSubmittedId}
                  setTotalAmount={setTotalAmount}                
                  totalAmount={totalAmount} 
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                  selectedChild={selectedChild} 
                  setSelectedChild={setSelectedChild} 
                />
              )}
            </Grid>
          )}
        </Grid>
      </Container>
      {isMobile && (
        <>
          {submitted ? (
            <StripePay submittedId={submittedId} />
          ) : (
            <CourseEnqForm 
              isMobile={true}
              data={data} 
              setStep={setStep}
              step={step}
              submitted={submitted}
              setSubmitted={setSubmitted}
              setSubmittedId={setSubmittedId}
              setTotalAmount={setTotalAmount}                
              totalAmount={totalAmount} 
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              selectedChild={selectedChild} 
              setSelectedChild={setSelectedChild} 
            />
          )}
        </>
      )}
      <MySnackbar ref={snackRef} />
    </section>
  );
}

export default BuyComponent;
