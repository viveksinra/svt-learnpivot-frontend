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
import { myCourseService } from "@/app/services";

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
  setFrontEndTotal,
  preserveSelections,
  setPreserveSelections
}) {
  const snackRef = useRef();
  const { state } = useContext(MainContext);
  const currentUser = Cookies.get("currentUser");
  const [canBuy, setCanBuy] = useState(!data.onlySelectedParent);
  const [isAvailable, setIsAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allowWaitingList, setAllowWaitingList] = useState(false);
  const [isWaitListed, setIsWaitListed] = useState(false);

  const [alreadyBoughtDate, setAlreadyBoughtDate] = useState([]);
  const [hideStartDateSelector, setHideStartDateSelector] = useState(false);
  const [lastPurchasedSetIndex, setLastPurchasedSetIndex] = useState(-1);
  const [bookingRuleModalOpen, setBookingRuleModalOpen] = useState(false);
  const [bookingRule, setBookingRule] = useState({
    restrictStartDateChange: false,
    forcefullBuyCourse: false,
    stopSkipSet: false,
    backDayCount: 0,
    allowBackDateBuy: false,
  });

  


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
    const checkAvailability = async () => {
      setIsLoading(true);
      
      if (state?.isAuthenticated && currentUser && state.id) {
        // Check if user can buy course
        if (data.onlySelectedParent !== true || data.selectedUsers.includes(state.id)) {
          setCanBuy(true);
        } else {
          setCanBuy(false);
        }
        
        // Check for available seat
        try {
          let res = await myCourseService.checkIfSeatAvailable(`${data._id}`);
          setIsAvailable(res?.isAvailable !== false);
          setAllowWaitingList(res?.allowWaitingList === true);
          setIsWaitListed(res?.isWaitListed === true);
        } catch (error) {
          console.error("Error checking seat availability:", error);
          setIsAvailable(false);
        }
      }
      
      setIsLoading(false);
    };
    
    checkAvailability();
  }, [state, currentUser, data]);

  const checkForAvailableSeat = async() => {
    let res = await myCourseService.checkIfSeatAvailable(`${data._id}`);
    if (res?.isAvailable === false) {
      setIsAvailable(false);
    } else {
      setIsAvailable(true);
    }
    setAllowWaitingList(res?.allowWaitingList === true);
    setIsWaitListed(res?.isWaitListed === true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submitted, step]);

  // Update the handler for child selection to reset preserveSelections
  const handleChildSelect = (child) => {
    setSelectedChild(child);
    setSelectedDates([]);  // Clear dates when child changes
    setPreserveSelections(false); // Reset selections when child changes
  };

  // Add a handler for setting submitted with preserveSelections
  const handleSetSubmitted = (value) => {
    setSubmitted(value);
    // If going to payment form, preserve selections for when we come back
    if (value) {
      setPreserveSelections(true);
    }
    // If coming back from payment, preserveSelections stays true (already set)
  };

  const joinWaiting = async () => {
    try {
      const res = await myCourseService.joinWaitingList({ courseId: data._id, childId: selectedChild?._id });
      // snackRef.current.handleSnack(res);
      if (res.variant === 'success' || res.variant === 'info') {
        setIsWaitListed(true);
      }
    } catch (error) {
      snackRef.current.handleSnack({ variant: 'error', message: 'Failed to join waiting list' });
    }
  };

  const leaveWaiting = async () => {
    try {
      const res = await myCourseService.leaveWaitingList({ courseId: data._id, childId: selectedChild?._id });
      // snackRef.current.handleSnack(res);
      if (res.variant === 'success') {
        setIsWaitListed(false);
      }
    } catch (error) {
      snackRef.current.handleSnack({ variant: 'error', message: 'Failed to remove from waiting list' });
    }
  };

  return (
    <>
      {step === 1 && <ComLogSigForm isRedirectToDashboard={false} />}
      
      {step !== 1 && isLoading && (
        <div className="text-center py-4">Loading...</div>
      )}
      
      {step !== 1 && !isLoading && (!canBuy || !isAvailable) && (
        <CourseBookingFullMessage 
          userInfo={state} 
          data={data}
          allowWaitingList={allowWaitingList}
          isWaitListed={isWaitListed}
          onJoinWaitingList={joinWaiting}
          onLeaveWaitingList={leaveWaiting}
        /> 
      )}
      
      {step === 2 && !isLoading && canBuy && isAvailable && (
        <CourseChildSelector 
          isMobile={isMobile}
          title={data.courseTitle} 
          setTotalAmount={setTotalAmount}
          setSelectedDates={setSelectedDates}
          selectedChild={selectedChild} 
          setSelectedChild={handleChildSelect}  // Use the updated handler
          setStep={setStep}
          setSelectedBatches={setSelectedBatches}
          setStartDate={setStartDate}
        />
      )}
      
      {step === 3 && canBuy && isAvailable && (
        <>
          {!submitted ? (
            <CourseDateSelector
              isMobile={isMobile}
              data={data}
              setStep={setStep}
              selectedChild={selectedChild}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              setSubmitted={handleSetSubmitted} // Use the new handler
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
              // Add the preserveSelections prop
              preserveSelections={preserveSelections}
              setPreserveSelections={setPreserveSelections}

              alreadyBoughtDate={alreadyBoughtDate}
              setAlreadyBoughtDate={setAlreadyBoughtDate}
              hideStartDateSelector={hideStartDateSelector}
              setHideStartDateSelector={setHideStartDateSelector}
              lastPurchasedSetIndex={lastPurchasedSetIndex}
              setLastPurchasedSetIndex={setLastPurchasedSetIndex}
              bookingRuleModalOpen={bookingRuleModalOpen}
              setBookingRuleModalOpen={setBookingRuleModalOpen}
              bookingRule={bookingRule}
              setBookingRule={setBookingRule}
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
              submittedId={submittedId} 
              totalAmount={totalAmount} 
              preserveSelections={preserveSelections}
              setPreserveSelections={setPreserveSelections}
            />
          )}
        </>
      )}
      
      <MySnackbar ref={snackRef} />
    </>
  );
}

export default CourseEnqForm;
