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


    async function getVoucher() {
      setLoading(true)
    try{
      let res = await myCourseService.publicGetOne(`${params.oneCourseId}`);
    
      if (res.variant === "success") {
        setData(res.data)
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