"use client";
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, useTheme } from '@mui/material';
import { UpcomingEvents } from '../Components/UserDash/UpcomingEvents';
import { dashboardService } from '../services';
import { AdminQuickLinks } from '../Components/Dashboard/AdminQuickLinks';
import { useRouter } from "next/navigation";


const Dashboard = () => {
  const [selectedChild, setSelectedChild] = useState('all');
  const theme = useTheme();
  const router = useRouter();

  const [heading, setHeading] = useState({msg: "Welcome",firstName: "Guest",lastName: "",designation:"Role"});

  useEffect(() => {
     // Getting Heading Data
     async function getHeading(){
      let res = await dashboardService.getData(`api/v1/dashboard/getDashboard/welcomeMsg`);
      if(res.variant === "success"){
        setHeading(res.data)
      }else {
        router.refresh();
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



  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Box>
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
              Your role is {heading.designation}
            </Typography>
          </Box>
 
        </Box>



        {/* Quick Links */}
        <AdminQuickLinks />
        {/* Upcoming Events */}
        {/* <UpcomingEvents 
selectedChild={selectedChild}
        /> */}

      </Container>
    </Box>
  );
};

export default Dashboard;