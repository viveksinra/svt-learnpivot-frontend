"use client";
import React, { Fragment, useEffect, useRef } from 'react';
import { useState, Suspense } from "react";
import Navbar from '../../../Components/ITStartup/Common/Navbar/Navbar';
import Footer from '../../../Components/Footer/Footer';
import Loading from '../../../Components/Loading/Loading';
import PaymentCom from '../../../Components/ITStartup/payment/PaymentCom';
import { mockTestService } from '@/app/services';

function MyPayment({ params }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const snackRef = useRef(null);

  const getPaymentDetails = async () => {
    setLoading(true);
    try {
      let res = await mockTestService.publicVerifyOneMockPayment(`${params.buyMockId}`);
      if (res.variant === "success") {
        setData(res.myData);
        if (snackRef.current) {
          snackRef.current.handleSnack(res);
        }
      } else {
        if (snackRef.current) {
          snackRef.current.handleSnack(res);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
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

export default MyPayment;