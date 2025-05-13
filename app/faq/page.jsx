"use client";
import React, { Fragment, useState } from 'react';
import { Suspense } from "react";
import { 
  Typography, 
  Box, 
  Container, 
  Tabs, 
  Tab, 
  Paper, 
  useTheme, 
  useMediaQuery, 
  Fade,
  Chip,
  Divider,
  Stack,
  alpha
} from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Navbar from '../Components/ITStartup/Common/Navbar/Navbar';
import FaqCom from '../Components/ITStartup/Faq/FaqCom';
import Enquiry from '../Components/Enquiry/Enquiry';
import Footer from '../Components/Footer/Footer';
import Loading from '../Components/Loading/Loading';

function MyFaq() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [currentTab, setCurrentTab] = useState(0);
  const [currentFaqType, setCurrentFaqType] = useState("faqData");
  
  const faqTypes = [
    { value: "faqData", label: "General FAQs", icon: <QuestionAnswerIcon /> },
    { value: "courseFaqData", label: "Course FAQs", icon: <SchoolIcon /> },
    { value: "csseMockFaqData", label: "CSSE Mock Test", icon: <AssignmentIcon /> },
    { value: "fsceMockFaqData", label: "FSCE Mock Test", icon: <AssessmentIcon /> }
  ];

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setCurrentFaqType(faqTypes[newValue].value);
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
            },
            bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
            minHeight: 'calc(100vh - 64px)'
          }}
        >
          <Suspense fallback={<Loading />}>
          

            {/* FAQ Section */}
            <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
              <Paper 
                elevation={isTablet ? 2 : 4} 
                sx={{ 
                  borderRadius: 3, 
                  overflow: 'hidden',
                  backgroundColor: theme.palette.background.paper,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: isTablet ? theme.shadows[4] : theme.shadows[6],
                  }
                }}
              >
                <Box 
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50',
                  }}
                >
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
                        py: 2.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        }
                      }
                    }}
                  >
                    {faqTypes.map((type, index) => (
                      <Tab 
                        key={type.value} 
                        label={
                          <Stack direction="row" spacing={1} alignItems="center">
                            {type.icon}
                            {!isMobile && <span>{type.label}</span>}
                          </Stack>
                        } 
                        id={`faq-tab-${index}`}
                        aria-controls={`faq-tabpanel-${index}`}
                        sx={{
                          minHeight: { xs: '48px', md: '56px' }
                        }}
                      />
                    ))}
                  </Tabs>
                </Box>
                
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                  <Typography 
                    variant="h6" 
                    fontWeight="medium" 
                    gutterBottom
                    sx={{ 
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    {faqTypes[currentTab].icon}
                    {faqTypes[currentTab].label}
                    <Chip
                      size="small"
                      label={`${currentTab === 0 ? '10+' : currentTab === 1 ? '8+' : '5+'} questions`}
                      sx={{ 
                        ml: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        fontWeight: 500
                      }}
                    />
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
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