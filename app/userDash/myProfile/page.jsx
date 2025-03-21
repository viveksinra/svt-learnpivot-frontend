// app/profile/page.js
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Grid, Typography } from '@mui/material';
import { myProfileService } from '@/app/services';
import { useRouter } from 'next/navigation';
import MySnackbar from '@/app/Components/MySnackbar/MySnackbar';
import UserProfile from './Comp/MyProfile';
import ChildrenList from './Comp/MyChild';
import { QuickLinks } from '@/app/Components/UserDash/QuickLinks';

const Profile = () => {
  
  const snackRef = useRef();

  return (
    <Box 
    // sx={{ 
    //   bgcolor: '#F8FAFC',
    //   minHeight: '100vh',
    //   py: 6
    // }}
    >
      <Container maxWidth="lg">
      <QuickLinks />
 
        <UserProfile  />
      </Container>
      <MySnackbar ref={snackRef} />
    </Box>
  );
};

export default Profile;