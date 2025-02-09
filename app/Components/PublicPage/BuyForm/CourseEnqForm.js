"use client";

import { useState, useRef, useContext, useEffect } from "react";
import MySnackbar from "../../MySnackbar/MySnackbar";
import ComLogSigForm from "../LoginSignUp/ComLogSigForm";
import MainContext from "../../Context/MainContext";
import Cookies from "js-cookie";
import DateSelector from "../Classes/DateSelector";
import ChildSelector from "../LoginSignUp/ChildSelector";
import { Typography } from "@mui/material"; // Assuming you are using Material-UI for Typography

function CourseEnqForm({ data, setSubmitted, setSubmittedId, setTotalAmount, totalAmount, selectedDates, setSelectedDates, selectedChild, setSelectedChild }) {
  const snackRef = useRef();
  
  // Context
  const { state } = useContext(MainContext);
  const currentUser = Cookies.get("currentUser");
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check for authentication and set step
    if (state?.isAuthenticated && currentUser) {
      setStep(2);
    } else {
      setStep(1);
    } 
  }, [state, currentUser]);

  return (
    <>
      {step === 1 && <ComLogSigForm isRedirectToDashboard={false} />}
      {step === 2 && (
        <>
          <ChildSelector title={data.courseTitle} selectedChild={selectedChild} setSelectedChild={setSelectedChild} setStep={setStep} />
        </>
      )}
      {step === 3 && (
        <>
          {totalAmount ? (
            <Typography variant="h4" gutterBottom>
              Proceed to pay amount: £ {totalAmount}
            </Typography>
          ) : (
            <DateSelector data={data} selectedDates={selectedDates} setSelectedDates={setSelectedDates}
             setSubmitted={setSubmitted} setSubmittedId={setSubmittedId} setTotalAmount={setTotalAmount} selectedChild={selectedChild}
             />
          )}
        </>
      )}
      <MySnackbar ref={snackRef} />
    </>
  );
}

export default CourseEnqForm;
