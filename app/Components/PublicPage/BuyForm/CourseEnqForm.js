"use client";

import { useState, useRef, useContext, useEffect } from "react";
import MySnackbar from "../../MySnackbar/MySnackbar";
import ComLogSigForm from "../LoginSignUp/ComLogSigForm";
import MainContext from "../../Context/MainContext";
import Cookies from "js-cookie";
import CourseDateSelector from "../Classes/CourseDateSelector";
import CourseStripePay from "../../courseStripePay/CourseStripePay";
import CourseChildSelector from "../LoginSignUp/CourseChildSelector";
import CourseBookingFullMessage from "./CourseBookingFullMessage";

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
  setSelectedChild,
  // Add new props
  selectedBatches,
  setSelectedBatches,
  startDate,
  setStartDate,
  availableDates,
  setAvailableDates,
  frontEndTotal,
  setFrontEndTotal
}) {
  const snackRef = useRef();
  const { state } = useContext(MainContext);
  const currentUser = Cookies.get("currentUser");
  const [canBuy, setCanBuy] = useState(!data.onlySelectedParent);

  useEffect(() => {
    if(step !== 3) {
    if (state?.isAuthenticated && currentUser) {
      setStep(2);
    } else {
      setStep(1);
    } 
  } 
  }, [state, currentUser]);

  useEffect(() => {
    if (state?.isAuthenticated && currentUser && state.id) {
      // check if user can buy course by checking data.selectedUsers contain state.id
      if ( data.onlySelectedParent != true ||  data.selectedUsers.includes(state.id)) {
      setCanBuy(true);
      }else {
        setCanBuy(false);
      }

      console.log("canBuy", canBuy);
      console.log("data.onlySelectedParent", data.onlySelectedParent);
      console.log("data.selectedUsers", data.selectedUsers);
      console.log("state.id", state.id);
    } 
  }, [state, currentUser,data]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submitted, step]);

  // Add a handler for child selection
  const handleChildSelect = (child) => {
    setSelectedChild(child);
    setSelectedDates([]);  // Clear dates when child changes
  };
  return (
    <>
      {step === 1 && <ComLogSigForm isRedirectToDashboard={false} />}
{canBuy ? <>      {step === 2 && (
        <CourseChildSelector 
          isMobile={isMobile}
          title={data.courseTitle} 
          setTotalAmount={setTotalAmount}
          setSelectedDates={setSelectedDates}
          selectedChild={selectedChild} 
          setSelectedChild={handleChildSelect}  // Use the new handler
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
              // Add new props
              selectedBatches={selectedBatches}
              setSelectedBatches={setSelectedBatches}
              startDate={startDate}
              setStartDate={setStartDate}
              availableDates={availableDates}
              setAvailableDates={setAvailableDates}
              frontEndTotal={frontEndTotal}
              setFrontEndTotal={setFrontEndTotal}
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
      </> :  <>  {  (step == 2 || step == 3 || submitted)   && <CourseBookingFullMessage />} </>
      }
      <MySnackbar ref={snackRef} />
    </>
  );
}

export default CourseEnqForm;
