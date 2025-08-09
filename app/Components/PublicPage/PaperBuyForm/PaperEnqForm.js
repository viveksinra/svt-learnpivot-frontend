"use client";

import { useState, useRef, useContext, useEffect } from "react";
import MySnackbar from "../../MySnackbar/MySnackbar";
import ComLogSigForm from "../LoginSignUp/ComLogSigForm";
import MainContext from "../../Context/MainContext";
import Cookies from "js-cookie";
import CourseChildSelector from "../LoginSignUp/CourseChildSelector";
import { paperService } from "@/app/services";

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
        <div style={{ padding: isMobile ? 20 : 0 }}>
          {/* Selection grid mimicking simple card list like earlier version */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 600, fontSize: 18 }}>{data.setTitle}</div>
            {!!data.shortDescription && (
              <div style={{ marginTop: 6, color: '#475569' }}>{data.shortDescription}</div>
            )}
          </div>
          <div className="grid" style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' }}>
            {data.papers?.map((p, idx) => {
              const selected = selectedPapers.find((sp) => sp.index === idx);
              const disabled = disabledIndexes.includes(idx);
              return (
                <div key={idx} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, opacity: disabled ? 0.6 : 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input type="checkbox" disabled={disabled} checked={!!selected} onChange={() => togglePaper(idx)} />
                      <span>Select</span>
                    </label>
                  </div>
                  {selected && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {p.allowCheckingService && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input type="checkbox" checked={!!selected.extras?.checking} onChange={() => toggleExtra(idx, 'checking')} />
                          <span>Add Checking (+£{p.checkingServicePrice})</span>
                        </label>
                      )}
                      {p.allowOneOnOneService && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input type="checkbox" checked={!!selected.extras?.oneOnOne} onChange={() => toggleExtra(idx, 'oneOnOne')} />
                          <span>Add 1:1 Explanation (+£{p.oneOnOnePrice})</span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <div style={{ fontWeight: 600 }}>Total: £{Number(totalAmount || 0).toFixed(2)}</div>
            <button
              onClick={handleProceedToPay}
              disabled={!selectedChild || (selectedPapers?.length || 0) === 0}
              style={{ background: '#1976d2', color: '#fff', border: 0, borderRadius: 6, padding: '8px 16px', cursor: 'pointer' }}
            >
              Proceed to Pay
            </button>
          </div>
      </div>
      )}

      <MySnackbar ref={snackRef} />
    </>
  );
}


