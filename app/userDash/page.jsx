"use client";
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, useTheme, Grid } from '@mui/material';
import ChildSelectorDropDown from '../Components/Common/ChildSelectorDropDown';
import { PaymentAlert } from '../Components/UserDash/PaymentAlert';
import { UpcomingEvents } from '../Components/UserDash/UpcomingEvents';
import { QuickLinks } from '../Components/UserDash/QuickLinks';
import { dashboardService } from '../services';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';


const Dashboard = () => {
  const [selectedChild, setSelectedChild] = useState('all');
  const [userData, setUserData] = useState(null);
  const [heading, setHeading] = useState({msg: "Welcome",firstName: "Guest",lastName: "",designation:"Role"});
  const router = useRouter();

  useEffect(() => {
    try {
      const cookieData = Cookies.get("currentUser");
      if (cookieData) {
        const parsedData = JSON.parse(cookieData);
        setUserData(parsedData);
        // Update the heading state with the user data
        setHeading({
          msg: "Welcome",
          firstName: parsedData.firstName || "Guest",
          lastName: parsedData.lastName || "",
          designation: parsedData.jobRoleLabel || "Role"
        });
      } else {
      }
    } catch (error) {
    }
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
              Track your childs educational journey
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