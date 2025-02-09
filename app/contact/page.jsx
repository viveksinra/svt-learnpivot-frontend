"use client";
import React, { Fragment, useEffect } from 'react'
import { useState,Suspense  } from "react";
// import {DARKMODE} from "./Components/Context/types"
import {Grid, TextField, Typography,Box,Button,IconButton,InputAdornment, Container,Tabs,Tab} from '@mui/material';
import Navbar from '../Components/ITStartup/Common/Navbar/Navbar';
import FaqCom from '../Components/ITStartup/Faq/FaqCom';
import FeedBackCom from '../Components/ITStartup/Feedback/FeedBackCom';
import Enquiry from '../Components/Enquiry/Enquiry';
import Footer from '../Components/Footer/Footer';
import Loading from '../Components/Loading/Loading';
import ServiceCom from '../Components/ITStartup/ServiceOverview/ServiceCom';

function MyContact() {  
  // const {state, dispatch} = useContext(MainContext)
  const [value, setValue] = React.useState(0);
  const [hero,setHero] = useState({btn:"Show Gallery",link:"/about/gallery",text:"Bring out the best in you.",bgImg:"https://res.cloudinary.com/oasismanors/image/upload/v1706128914/Oasis2_clq4l3.webp"})
  const [allItems] = useState([{btn:"Amenities",link:"/amenities",text:"Live life on your terms.",bgImg:"https://res.cloudinary.com/oasismanors/image/upload/v1706128914/Oasis1_rwtkv6.webp"},{btn:"Show Gallery",link:"/about/gallery",text:"Bring out the best in you.",bgImg:"https://res.cloudinary.com/oasismanors/image/upload/v1706128914/Oasis2_clq4l3.webp"},{btn:"Our Meal",link:"/amenities/menu",text:"Feel right at home.",bgImg:"https://res.cloudinary.com/oasismanors/image/upload/v1706128914/Oasis3_biy68f.webp"},{btn:"Supportive Services",link:"/lifestyle",text:"Support you can count on.",bgImg:"https://res.cloudinary.com/oasismanors/image/upload/v1706128915/Oasis4_anftz6.webp"}])

  useEffect(() => {
    const interval = setInterval(() => {  //assign interval to a variable to clear it.
      if(value < allItems.length-1 ){
        setHero(allItems[value+1]) ;
          setValue(value+1)
      }else {
        setHero(allItems[0]) ;
        setValue(0);
      }
    }, 3000)
    return () => clearInterval(interval); //This is important
   
  }, [value])


  return (
    <Fragment>
      <Navbar />
      <Suspense fallback={<Loading />}>
<br/>
<br/>
<br/>
        <Box >
          <Suspense fallback={<Loading />}>
          <Enquiry />
          
          <Suspense fallback={<Loading />}>
          <FaqCom dataType={"faqData"} />

            {/* <FeedBackCom /> */}
            <Suspense fallback={<Loading />}>
              <Footer />
            </Suspense>
          </Suspense>
          </Suspense>
        </Box>
      </Suspense>
    </Fragment>
  );
  }


  
export function TopAbstract() {
    return (
      <div id="topAbstract"/>
    )
  }



 
export default MyContact