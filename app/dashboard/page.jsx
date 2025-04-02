"use client";
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack, useTheme } from '@mui/material';
import { AdminQuickLinks } from '../Components/Dashboard/AdminQuickLinks';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import { MdDashboard } from "react-icons/md";

const Dashboard = () => {
  const [selectedChild, setSelectedChild] = useState('all');
  const theme = useTheme();
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    courses: 0,
    mockTests: 0,
    purchases: 0,
    users: 0
  });

  // Get user data from cookies
  useEffect(() => {
    try {
      const cookieData = Cookies.get("currentUser");
      if (cookieData) {
        const parsedData = JSON.parse(cookieData);
        setUserData(parsedData);
        console.log('User data from cookies:', parsedData);
      } else {
        console.log('No user data found in cookies');
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
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
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 5,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}>
          <Box>
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              mb: 1,
            }}>
              {getGreeting()}, {userData?.firstName || 'Guest'}!
            </Typography>
            <Typography sx={{ 
              fontSize: '1.1rem', 
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.95)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Your role: {userData?.jobRoleLabel || 'Role'}
            </Typography>
          </Box>
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center'
          }}>
            <MdDashboard size={40} />
          </Box>
        </Box>

        {/* Dashboard Overview (now moved to AdminQuickLinks component) */}
        <AdminQuickLinks />

      </Container>
    </Box>
  );
};

export default Dashboard;