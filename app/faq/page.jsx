"use client";
import React, { Fragment, useState, useEffect } from 'react';
import { Suspense } from "react";
import { Typography, Box, Container, Tabs, Tab, Paper, useTheme, useMediaQuery, Fade } from '@mui/material';
import Navbar from '../Components/ITStartup/Common/Navbar/Navbar';
import FaqCom from '../Components/ITStartup/Faq/FaqCom';
import Enquiry from '../Components/Enquiry/Enquiry';
import Footer from '../Components/Footer/Footer';
import Loading from '../Components/Loading/Loading';

function MyFaq() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [currentTab, setCurrentTab] = useState(0);
  const [currentFaqType, setCurrentFaqType] = useState("faqData");
  

  const faqTypes = [
    { value: "faqData", label: "General FAQs" },
    { value: "courseFaqData", label: "Course FAQs" },
    { value: "csseMockFaqData", label: "CSSE Mock Test FAQs" },
    { value: "fsseMockFaqData", label: "FSSE Mock Test FAQs" }
  ];



  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setCurrentFaqType(faqTypes[newValue].value);
  };

  const getFaqTitle = () => {
    switch(currentFaqType) {
      case "courseFaqData": 
        return "Course-Related Questions";
      case "csseMockFaqData":
        return "CSSE Mock Test Questions";
      case "fsseMockFaqData":
        return "FSSE Mock Test Questions";
      default:
        return "Frequently Asked Questions";
    }
  };

  return (
    <Fragment>
      <Navbar />
      <Suspense fallback={<Loading />}>
        <Box 
          sx={{
            marginTop: {
              xs: '64px',
              sm: '70px',
              md: '76px'
            }
          }}
        >
          <Suspense fallback={<Loading />}>
       

            {/* FAQ Section */}
            <Container maxWidth="lg" sx={{ py: 6 }}>
              <Paper elevation={3} sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                backgroundColor: theme.palette.background.paper
              }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={currentTab} 
                    onChange={handleTabChange}
                    variant={isMobile ? "scrollable" : "fullWidth"}
                    scrollButtons="auto"
                    indicatorColor="primary"
                    textColor="primary"
                    sx={{ 
                      '& .MuiTab-root': {
                        fontWeight: 600,
                        py: 2
                      }
                    }}
                  >
                    {faqTypes.map((type, index) => (
                      <Tab key={type.value} label={type.label} id={`faq-tab-${index}`} />
                    ))}
                  </Tabs>
                </Box>
                
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  {faqTypes.map((type, index) => (
                    <Box
                      key={type.value}
                      role="tabpanel"
                      hidden={currentTab !== index}
                      id={`faq-tabpanel-${index}`}
                      aria-labelledby={`faq-tab-${index}`}
                    >
                      {currentTab === index && (
                        <Fade in={true} timeout={500}>
                          <Box>
                            <FaqCom dataType={type.value} />
                          </Box>
                        </Fade>
                      )}
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Container>

            {/* Enquiry Section */}
            <Suspense fallback={<Loading />}>
              <Enquiry />
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
    <div id="topAbstract" />
  );
}

export default MyFaq;