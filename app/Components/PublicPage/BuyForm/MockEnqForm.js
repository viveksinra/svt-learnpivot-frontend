"use client";

import { useState, useRef, useContext, useEffect } from "react";
import MySnackbar from "../../MySnackbar/MySnackbar";
import ComLogSigForm from "../LoginSignUp/ComLogSigForm";
import MainContext from "../../Context/MainContext";
import Cookies from "js-cookie";
import ChildSelector from "../LoginSignUp/ChildSelector";
import MtBatchSelector from "../MockTest/MtBatchSelector";
import MockStripePay from "../../mockStripePay/MockStripePay";

function MockEnqForm({ isMobile,data,step, setStep, submitted,setSubmitted, submittedId,setSubmittedId, setTotalAmount, totalAmount, selectedBatch, setSelectedBatch, selectedChild, setSelectedChild }) {
  const snackRef = useRef();
  console.log(data)
  // Context
  const { state } = useContext(MainContext);
  const currentUser = Cookies.get("currentUser");

  useEffect(() => {
    // Check for authentication and set step
    if (state?.isAuthenticated && currentUser) {
      setStep(2);
    } else {
      setStep(1);
    } 
  }, [state, currentUser]);
  useEffect(() => {
    // Scroll to top when submitted state changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submitted,step]);

  return (
    <>
      {step === 1 && <ComLogSigForm isRedirectToDashboard={false} />}
      {step === 2 && (
        <>
          <ChildSelector 
          isMobile={isMobile} 
          title={data.mockTestTitle} 
          setTotalAmount={setTotalAmount} 
          setSelectedBatch={setSelectedBatch} 
          selectedChild={selectedChild} 
          setSelectedChild={setSelectedChild} 
          setStep={setStep} />
        </>
      )}
      {(step === 3 ) && (

    
           <>
                {!submitted ? <MtBatchSelector
                isMobile={isMobile}
           data={data} 
           setStep={setStep}
           selectedChild={selectedChild}
            selectedBatch={selectedBatch}
             setSelectedBatch={setSelectedBatch}
             setSubmitted={setSubmitted}
             setSubmittedId={setSubmittedId}
             setTotalAmount={setTotalAmount}
             totalAmount={totalAmount}             
             /> : (
           <MockStripePay 
           isMobile={isMobile}
           data={data} 

           setSubmitted={setSubmitted}
             setSubmittedId={setSubmittedId}
             setStep={setStep}
             selectedChild={selectedChild}
           selectedBatch={selectedBatch} submittedId={submittedId} totalAmount={totalAmount} />
      )}
          
   
           </>
                    
         
      )}

      <MySnackbar ref={snackRef} />
    </>
  );
}

export default MockEnqForm;
