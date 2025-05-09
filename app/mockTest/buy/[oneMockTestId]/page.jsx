"use client"
import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, Container } from '@mui/material';
import NoResult from '@/app/Components/NoResult/NoResult';
import { mockTestService } from "../../../services";
import Footer from '@/app/Components/Footer/Footer';
import Navbar from "../../../Components/ITStartup/Common/Navbar/Navbar";
import MtBuyComponent from '@/app/Components/PublicPage/MtBuyForm/MtBuyComponent';
import MySnackbar from '@/app/Components/MySnackbar/MySnackbar';

export default function OneClassBuy({ params }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const snackRef = useRef();
  useEffect(() => {
    // Getting date from Voucher in URL

    async function getVoucher() {
      setLoading(true)
    try{
      let res = await mockTestService.publicGetOne(`${params.oneMockTestId}`);
    
      if (res.variant === "success") {
        setData(res.data)
        // snackRef.current.handleSnack(res);
      } else {
        snackRef.current.handleSnack(res);
      }
    }catch (error) {
      console.error("Error fetching data:", error);
    }   
      setLoading(false)

    }
      getVoucher();
  }, [params]);


  return (
    <main style={{ backgroundColor: "#fff" }}>
      <Navbar />

    <br />
  
    <Container style={{ marginTop:"50px", paddingBottom:"200px" }}>
       {loading ? (
                <div className="center">
                  <CircularProgress size={30} />{" "}
                </div>
              ) : loading === false && data? (
                <MtBuyComponent data ={data} />                
              ) : <NoResult label="No Result Available" />}
    
    </Container>
    <MySnackbar ref={snackRef} />
  

    </main>
  );
}