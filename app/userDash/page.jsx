"use client";
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, useTheme, Grid } from '@mui/material';
import ChildSelectorDropDown from '../Components/Common/ChildSelectorDropDown';
import { PaymentAlert } from '../Components/UserDash/PaymentAlert';
import { UpcomingEvents } from '../Components/UserDash/UpcomingEvents';
import { MoreContent } from '../Components/UserDash/MoreContent';
import { QuickLinks } from '../Components/UserDash/QuickLinks';
import { dashboardService } from '../services';


const Dashboard = () => {
  const [selectedChild, setSelectedChild] = useState('all');
  const theme = useTheme();

    const [heading, setHeading] = useState({msg: "Welcome",firstName: "Guest",lastName: "",designation:"Role"});
  
    useEffect(() => {
       // Getting Heading Data
       async function getHeading(){
        let res = await dashboardService.getData(`api/v1/dashboard/getDashboard/welcomeMsg`);
        console.log(res)
        if(res.variant === "success"){
          setHeading(res.data)
        }else {
          router.reload();
        };    
       }
       getHeading()
     }, []);

     const getGreeting = () => {
      const currentHour = new Date().getHours();
      if (currentHour < 12) return "Good Morning";
      if (currentHour < 18) return "Good Afternoon";
      return "Good Evening";
    };

  const children = [
    { id: 1, name: 'John Smith', grade: '8th' },
    { id: 2, name: 'Sarah Smith', grade: '6th' },
  ];

  const paymentDues = [
    {
      id: 1,
      title: 'Next Batch Payment Due',
      description: 'Secure your spot for the upcoming semester starting January 2025',
      amount: '$999',
      dueDate: '2024-12-31'
    }
  ];



  const moreClasses = [
    {
      id: 1,
      title: 'Biology Fundamentals',
      subject: 'Science',
      duration: '1.5 hours',
      price: '$49'
    },
    {
      id: 2,
      title: 'Algebra Mastery',
      subject: 'Mathematics',
      duration: '2 hours',
      price: '$59'
    }
  ];

  const moreMockTests = [
    {
      id: 1,
      title: 'Chemistry Mock Test',
      subject: 'Science',
      questions: 60,
      price: '$29'
    },
    {
      id: 2,
      title: 'Physics Comprehensive',
      subject: 'Physics',
      questions: 75,
      price: '$39'
    }
  ];

  const getSubjectColor = (subject) => {
    const colors = {
      Mathematics: theme.palette.primary.main,
      Physics: theme.palette.success.main,
      Science: theme.palette.error.main
    };
    return colors[subject] || theme.palette.grey[600];
  };



  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(90deg, #FF8E53 0%, #FE6B8B 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {getGreeting()}, {heading?.firstName}!
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Track your children's educational journey
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ 
            display: 'flex', 
            justifyContent: { xs: 'flex-start', md: 'flex-end' },
            paddingRight: { xs: 0, md: 2 }
          }}>
            <Box sx={{ width: 220 }}>
              <ChildSelectorDropDown 
                selectedChild={selectedChild} 
                setSelectedChild={setSelectedChild} 
              />
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <QuickLinks />
          </Grid>
          <Grid item xs={12} md={12}>
          <PaymentAlert selectedChild={selectedChild} />

          </Grid>
          <Grid item xs={12} md={12}>
            <UpcomingEvents selectedChild={selectedChild} />
          </Grid>
        </Grid>

        {/* Conditional Rendering for Optional Sections */}
   
         {/* {showMoreContent &&
         <MoreContent 
          classes={moreClasses} 
          tests={moreMockTests} 
          getSubjectColor={getSubjectColor} 
        />
         }   */}
      </Container>
    </Box>
  );
};

export default Dashboard;