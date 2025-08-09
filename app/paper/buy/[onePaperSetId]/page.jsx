"use client";
import React, { useEffect, useState, useRef } from 'react';
import { CircularProgress, Container } from '@mui/material';
import NoResult from '@/app/Components/NoResult/NoResult';
import Navbar from "../../../Components/ITStartup/Common/Navbar/Navbar";
import MySnackbar from '@/app/Components/MySnackbar/MySnackbar';
import { paperService } from "../../../services";
import PaperBuyComponent from '../../../Components/PublicPage/PaperBuyForm/PaperBuyComponent';
import { useParams } from 'next/navigation';

export default function PaperBuyPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const snackRef = useRef();
  const { onePaperSetId } = useParams();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await paperService.publicGetOne(onePaperSetId);
        if (res?.variant === 'success') {
          setData(res.data);
        } else {
          snackRef.current?.handleSnack(res);
        }
      } catch (e) {}
      setLoading(false);
    }
    if (onePaperSetId) load();
  }, [onePaperSetId]);

  return (
    <main style={{ backgroundColor: "#fff" }}>
      <Navbar />
      <br />
      <Container style={{ marginTop: "50px", paddingBottom: "100px" }}>
        {loading ? (
          <div className="center"><CircularProgress size={30} /></div>
        ) : data ? (
          <PaperBuyComponent data={data} />
        ) : (
          <NoResult label="No Result Available" />
        )}
      </Container>
      <MySnackbar ref={snackRef} />
    </main>
  );
}





