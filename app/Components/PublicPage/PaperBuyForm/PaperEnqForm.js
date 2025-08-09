"use client";

import { useState, useRef, useContext, useEffect } from "react";
import MySnackbar from "../../MySnackbar/MySnackbar";
import ComLogSigForm from "../LoginSignUp/ComLogSigForm";
import MainContext from "../../Context/MainContext";
import Cookies from "js-cookie";
import CourseChildSelector from "../LoginSignUp/CourseChildSelector";
import { paperService } from "@/app/services";
import PaperSelectionGrid from "./PaperSelectionGrid.jsx";

// Paper selection + child selection + stepper, mirroring CourseEnqForm UX
export default function PaperEnqForm({
  isMobile,
  data,
  step,
  setStep,
  submitted,
  setSubmitted,
  setSubmittedId,
  selectedChild,
  setSelectedChild,
  totalAmount,
  setTotalAmount,
  preserveSelections,
  setPreserveSelections,
}) {
  const snackRef = useRef();
  const { state } = useContext(MainContext);
  const currentUser = Cookies.get("currentUser");

  const [isLoading, setIsLoading] = useState(true);
  const [canBuy, setCanBuy] = useState(true);
  const [selectedPapers, setSelectedPapers] = useState([]);
  const [disabledIndexes, setDisabledIndexes] = useState([]);

  // Compute total
  useEffect(() => {
    if (!data) return;
    let total = 0;
    (selectedPapers || []).forEach((sel) => {
      const paper = data.papers?.[sel.index];
      const base = (paper && paper.priceOverride != null) ? Number(paper.priceOverride) : Number(data.onePaperPrice || 0);
      const c = sel.extras?.checking ? Number(paper?.checkingServicePrice || 0) : 0;
      const o = sel.extras?.oneOnOne ? Number(paper?.oneOnOnePrice || 0) : 0;
      total += base + c + o;
    });
    if ((selectedPapers || []).length === (data.papers?.length || 0) && (data.papers?.length || 0) > 0) {
      total = Number((total - Number(data.discountOnFullSet || 0)).toFixed(2));
    }
    setTotalAmount(Number(total.toFixed(2)));
  }, [data, selectedPapers, setTotalAmount]);

  // Step resolution like course
  useEffect(() => {
    if (step !== 3) {
      if (state?.isAuthenticated && currentUser) {
        setStep(2);
      } else {
        setStep(1);
      }
    }
  }, [state, currentUser]);

  // Load already bought for the selected child to disable checkboxes
  useEffect(() => {
    async function loadAlreadyBought() {
      if (!selectedChild?._id || !data?._id) return;
      try {
        const res = await paperService.alreadyBought({ childId: selectedChild._id, id: data._id });
        if (res?.variant === 'success') {
          setDisabledIndexes(res.boughtPapers || []);
        }
      } catch {}
    }
    loadAlreadyBought();
  }, [selectedChild?._id, data?._id]);

  // Selection handlers
  const togglePaper = (index) => {
    if (disabledIndexes.includes(index)) return;
    const exists = selectedPapers.find((p) => p.index === index);
    if (exists) setSelectedPapers(selectedPapers.filter((p) => p.index !== index));
    else setSelectedPapers([...selectedPapers, { index, extras: {} }]);
  };
  const toggleExtra = (index, key) => {
    setSelectedPapers((prev) => prev.map((p) => p.index === index ? { ...p, extras: { ...p.extras, [key]: !p.extras?.[key] } } : p));
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // submit step one and go to stripe pay screen
  const handleProceedToPay = async () => {
    try {
      const payload = { paperSetId: data._id, selectedPapers, selectedChild };
      const resp = await paperService.buyPaperStepOne(payload);
      if (resp?.variant === 'success' && resp?._id) {
        setSubmittedId(resp._id);
        setSubmitted(true);
        setPreserveSelections(true);
        setTotalAmount(resp.totalAmount);
      } else {
        snackRef.current?.handleSnack(resp || { variant: 'error', message: 'Failed to start order' });
      }
    } catch (err) {
      snackRef.current?.handleSnack({ variant: 'error', message: 'Unexpected error' });
    }
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    if (!preserveSelections) setSelectedPapers([]);
  };

  return (
    <>
      {step === 1 && <ComLogSigForm isRedirectToDashboard={false} />}

      {step === 2 && (
        <CourseChildSelector
          isMobile={isMobile}
          title={data.setTitle}
          setTotalAmount={setTotalAmount}
          setSelectedDates={() => {}}
          selectedChild={selectedChild}
          setSelectedChild={handleChildSelect}
          setStep={setStep}
          setSelectedBatches={() => {}}
          setStartDate={() => {}}
        />
      )}

      {step === 3 && (
        <PaperSelectionGrid
          data={data}
          isMobile={isMobile}
          selectedPapers={selectedPapers}
          onTogglePaper={togglePaper}
          onToggleExtra={toggleExtra}
          disabledIndexes={disabledIndexes}
          totalAmount={totalAmount}
          onProceed={handleProceedToPay}
          proceedDisabled={!selectedChild || (selectedPapers?.length || 0) === 0}
        />
      )}

      <MySnackbar ref={snackRef} />
    </>
  );
}


