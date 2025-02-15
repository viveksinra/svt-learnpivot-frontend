"use client";

import { useState, useRef, useContext, useEffect } from "react";
import MySnackbar from "../../MySnackbar/MySnackbar";
import ComLogSigForm from "../LoginSignUp/ComLogSigForm";
import MainContext from "../../Context/MainContext";
import Cookies from "js-cookie";
import DateSelector from "../Classes/DateSelector";
import ChildSelector from "../LoginSignUp/ChildSelector";
import StripePay from "../../courseStripePay/StripePay";

function CourseEnqForm({ 
  isMobile, 
  data, 
  step, 
  setStep, 
  submitted, 
  setSubmitted, 
  submittedId, 
  setSubmittedId, 
  setTotalAmount, 
  totalAmount, 
  selectedDates, 
  setSelectedDates, 
  selectedChild, 
  setSelectedChild 
}) {
  const snackRef = useRef();
  const { state } = useContext(MainContext);
  const currentUser = Cookies.get("currentUser");

  useEffect(() => {
    if (state?.isAuthenticated && currentUser) {
      setStep(2);
    } else {
      setStep(1);
    } 
  }, [state, currentUser]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submitted, step]);

  return (
    <>
      {step === 1 && <ComLogSigForm isRedirectToDashboard={false} />}
      {step === 2 && (
        <ChildSelector 
          isMobile={isMobile}
          title={data.courseTitle} 
          setTotalAmount={setTotalAmount}
          setSelectedDates={setSelectedDates}
          selectedChild={selectedChild} 
          setSelectedChild={setSelectedChild} 
          setStep={setStep}
        />
      )}
      {step === 3 && (
        <>
          {!submitted ? (
            <DateSelector
              isMobile={isMobile}
              data={data}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              setSubmitted={setSubmitted}
              setSubmittedId={setSubmittedId}
              setTotalAmount={setTotalAmount}
              selectedChild={selectedChild}
            />
          ) : (
            <StripePay 
              submittedId={submittedId}
              totalAmount={totalAmount}
            />
          )}
        </>
      )}
      <MySnackbar ref={snackRef} />
    </>
  );
}

export default CourseEnqForm;
