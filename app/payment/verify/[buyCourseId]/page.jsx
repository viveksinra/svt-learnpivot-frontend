"use client";
import React, { Fragment, useEffect, useRef } from 'react'
import { useState, Suspense } from "react";
import Navbar from '../../../Components/ITStartup/Common/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Loading from '../../../Components/Loading/Loading';
import PaymentCom from '../../../Components/ITStartup/payment/PaymentCom';
import { myCourseService } from '@/app/services';

function MyPayment({params}) {  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const snackRef = useRef(null);

  // Getting date from Voucher in URL
  async function getPaymentDetails() {
    // Don't set loading to true if we're just polling for updates
    // This prevents the UI from flashing loading state during polling
    const isPolling = data && data.status && data.status.toLowerCase() !== "succeeded";
    if (!isPolling) {
      setLoading(true);
    }
    
    try {
      let res = await myCourseService.publicVerifyOnePayment(`${params.buyCourseId}`);
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
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
    
    if (!isPolling) {
      setLoading(false);
    }
  }

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

export default MyPayment