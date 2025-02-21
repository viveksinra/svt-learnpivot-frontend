"use client"
import React, { useState, useEffect, useRef } from 'react';
import BuyComponent from '../../../Components/PublicPage/BuyForm/BuyComponent';
import { CircularProgress, Container } from '@mui/material';
import NoResult from '@/app/Components/NoResult/NoResult';
import { myCourseService } from "../../../services";
import Navbar from "../../../Components/ITStartup/Common/Navbar/Navbar";
import MySnackbar from '@/app/Components/MySnackbar/MySnackbar';

export default function OneClassBuy({ params }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const snackRef = useRef();

  useEffect(() => {
    // Getting date from Voucher in URL
    console.log("got loaded")
    console.log({params})

    async function getVoucher() {
      setLoading(true)
      console.log("function got called")
    try{
      let res = await myCourseService.publicGetOne(`${params.oneCourseId}`);
      console.log({res,id:params.oneCourseId})
    
      if (res.variant === "success") {
        setData(res.data)
        console.log(res.data)
        snackRef.current.handleSnack(res);
      } else {
        snackRef.current.handleSnack(res);
        console.log(res);
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
  
    <Container style={{ marginTop:"50px", paddingBottom:"100px" }}>
       {loading ? (
                <div className="center">
                  <CircularProgress size={30} />{" "}
                </div>
              ) : loading === false && data? (
                <BuyComponent data ={data} />                
              ) : <NoResult label="No Result Available" />}
    
    </Container>
  
    <MySnackbar ref={snackRef} />

    </main>
  );
}