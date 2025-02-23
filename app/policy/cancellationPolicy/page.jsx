"use client";
import React, { Fragment, useEffect } from 'react'
import { useState, Suspense } from "react";
import { Grid, TextField, Typography, Box, Button, IconButton, InputAdornment, Container, Tabs, Tab } from '@mui/material';
import Footer from '@/app/Components/Footer/Footer';
import Loading from '@/app/Components/Loading/Loading';
import PageHeadCom from '@/app/Components/ITStartup/Common/PageHeader/PageHeadCom';
import Navbar from '@/app/Components/ITStartup/Common/Navbar/Navbar';
import CancellationPolicyCom from '@/app/Components/Policy/CancellationPolicyCom';

function CancellationPolicy() {
  const [value, setValue] = React.useState(0);

  return (
    <Fragment>
      <Navbar />
      <Suspense fallback={<Loading />}>
      <div style={{marginTop:"80px"}} />


        <CancellationPolicyCom />
      

      

        <Box>
          <Suspense fallback={<Loading />}>
            

            <Suspense fallback={<Loading />}>
           
              <Suspense fallback={<Loading />}>
                <Footer />
              </Suspense>
            </Suspense>
          </Suspense>
        </Box>
      </Suspense>

      <style jsx global>{`
        @media (max-width: 768px) {
          .service-component-wrapper {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .service-component-wrapper {
            display: block;
          }
        }
      `}</style>
    </Fragment>
  );
}

export function TopAbstract() {
  return (
    <div id="topAbstract" />
  );
}

export default CancellationPolicy;