"use client";
import React, { Fragment, useEffect, useRef } from 'react';
import { useState, Suspense } from "react";
import Navbar from '../../../Components/ITStartup/Common/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Loading from '../../../Components/Loading/Loading';
import PaymentCom from '../../../Components/ITStartup/payment/PaymentCom';
import { paperService } from '@/app/services';

function PaperPaymentVerify({ params }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const snackRef = useRef(null);

  const getPaymentDetails = async () => {
    const isPolling = data && data.status && data.status.toLowerCase() !== "succeeded";
    if (!isPolling) setLoading(true);
    try {
      const res = await paperService.publicVerifyOnePaperPayment(`${params.buyPaperId}`);
      if (res.variant === "success") {
        setData(res.myData);
        if (snackRef.current && !isPolling) {
          snackRef.current.handleSnack(res);
        }
      } else {
        if (snackRef.current && !isPolling) {
          snackRef.current.handleSnack(res);
        }
      }
    } catch (e) {
      console.error("Error fetching paper payment data:", e);
    }
    if (!isPolling) setLoading(false);
  };

  useEffect(() => {
    getPaymentDetails();
  }, [params]);

  return (
    <Fragment>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <PaymentCom data={data} isLoading={loading} onRefresh={getPaymentDetails} />
        <Footer />
      </Suspense>
    </Fragment>
  );
}

export default PaperPaymentVerify;


