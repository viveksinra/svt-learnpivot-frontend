"use client";

import { useState, useRef, useContext, useEffect } from "react";
import MySnackbar from "../../MySnackbar/MySnackbar";
import ComLogSigForm from "../LoginSignUp/ComLogSigForm";
import MainContext from "../../Context/MainContext";
import Cookies from "js-cookie";
import ChildSelector from "../LoginSignUp/ChildSelector";
import CourseDateSelector from "../Classes/CourseDateSelector";
import CourseStripePay from "../../courseStripePay/CourseStripePay";

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
          setSelectedBatch={setSelectedDates}
          selectedChild={selectedChild} 
          setSelectedChild={setSelectedChild} 
          setStep={setStep}
        />
      )}
      {step === 3 && (
        <>
          {!submitted ? (
            <CourseDateSelector
              isMobile={isMobile}
              data={data}
              setStep={setStep}
              selectedChild={selectedChild}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              setSubmitted={setSubmitted}
              setSubmittedId={setSubmittedId}
              setTotalAmount={setTotalAmount}
             totalAmount={totalAmount}             

            />
          ) : (
              <CourseStripePay 
                       isMobile={isMobile}
                       data={data} 
            
                       setSubmitted={setSubmitted}
                         setSubmittedId={setSubmittedId}
                         setStep={setStep}
                         selectedChild={selectedChild}
                         selectedDates={selectedDates}
                         submittedId={submittedId} totalAmount={totalAmount} />
         
          )}
        </>
      )}
      <MySnackbar ref={snackRef} />
    </>
  );
}

export default CourseEnqForm;
