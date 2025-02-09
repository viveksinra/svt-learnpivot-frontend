"use client";
import React, { Fragment, useEffect } from 'react'
import { useState, Suspense } from "react";
import { Grid, TextField, Typography, Box, Button, IconButton, InputAdornment, Container, Tabs, Tab } from '@mui/material';
import Footer from '@/app/Components/Footer/Footer';
import Loading from '@/app/Components/Loading/Loading';
import PageHeadCom from '@/app/Components/ITStartup/Common/PageHeader/PageHeadCom';
import TermAndConditionCom from '@/app/Components/Policy/TermAndConditionCom';
import Navbar from '@/app/Components/ITStartup/Common/Navbar/Navbar';

function MyAbout() {
  const [value, setValue] = React.useState(0);
  const [hero, setHero] = useState({
    btn: "Show Gallery",
    link: "/about/gallery",
    text: "Bring out the best in you.",
    bgImg: "https://res.cloudinary.com/oasismanors/image/upload/v1706128914/Oasis2_clq4l3.webp"
  });
  const [allItems] = useState([
    { btn: "Amenities", link: "/amenities", text: "Live life on your terms.", bgImg: "https://res.cloudinary.com/oasismanors/image/upload/v1706128914/Oasis1_rwtkv6.webp" },
    { btn: "Show Gallery", link: "/about/gallery", text: "Bring out the best in you.", bgImg: "https://res.cloudinary.com/oasismanors/image/upload/v1706128914/Oasis2_clq4l3.webp" },
    { btn: "Our Meal", link: "/amenities/menu", text: "Feel right at home.", bgImg: "https://res.cloudinary.com/oasismanors/image/upload/v1706128914/Oasis3_biy68f.webp" },
    { btn: "Supportive Services", link: "/lifestyle", text: "Support you can count on.", bgImg: "https://res.cloudinary.com/oasismanors/image/upload/v1706128915/Oasis4_anftz6.webp" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (value < allItems.length - 1) {
        setHero(allItems[value + 1]);
        setValue(value + 1);
      } else {
        setHero(allItems[0]);
        setValue(0);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <Fragment>
      <Navbar />
      <Suspense fallback={<Loading />}>
 <div style={{marginTop:"80px"}} />

        <TermAndConditionCom />
      

      

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

export default MyAbout;