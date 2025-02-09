// MyApp.js
"use client";
import React, { Fragment, useEffect, useState, Suspense } from 'react';
import "./pageStyle.css";
import Enquiry from "./Components/Enquiry/Enquiry";
import Footer from "./Components/Footer/Footer";
import { Box } from '@mui/material';
import Loading from "./Components/Loading/Loading";
import Navbar from './Components/ITStartup/Common/Navbar/Navbar';
import Banner from './Components/ITStartup/BannerCom/Banner';
import ServiceCom from './Components/ITStartup/ServiceOverview/ServiceCom';
import FaqCom from './Components/ITStartup/Faq/FaqCom';
import TawkToChat from './Components/Common/TawkToChat';



function MyApp() {
  const [value, setValue] = useState(0);
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
  }, [value, allItems]);

  return (
    <Fragment>
      <Navbar />


      <Suspense fallback={<Loading />}>
        <Banner />
        <div className="service-component-wrapper">
          <ServiceCom />
        </div>
        <Box>
          <Suspense fallback={<Loading />}>
            <FaqCom dataType={"faqData"} />
            <Suspense fallback={<Loading />}>
              <Enquiry />
              <Suspense fallback={<Loading />}>
                <Footer />
                <TawkToChat />
              </Suspense>
            </Suspense>
          </Suspense>
        </Box>
      </Suspense>

      <style jsx global>{`
        /* Hide ServiceCom on mobile devices */
        @media (max-width: 768px) {
          .service-component-wrapper {
            display: none !important;
          }
        }

        /* Show ServiceCom on desktop */
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

export default MyApp;
