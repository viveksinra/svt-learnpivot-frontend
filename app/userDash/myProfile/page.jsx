// app/profile/page.js
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { myProfileService } from '@/app/services';
import { useRouter } from 'next/navigation';
import MySnackbar from '@/app/Components/MySnackbar/MySnackbar';
import UserProfile from './Comp/MyProfile';
import ChildrenList from './Comp/MyChild';

const Profile = () => {
  const router = useRouter();
  const [allChildren, setAllChildren] = useState([]);
  const snackRef = useRef();

  useEffect(() => {
    handleGetAllChildren();
  }, []);

  const handleGetAllChildren = async () => {
    try {
      const response = await myProfileService.getMyAllChild();
      if (response.data) {
        setAllChildren(response.data);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      snackRef.current.handleSnack({ message: 'Failed to fetch children.', variant: 'error' });
    }
  };



  return (
    <Box sx={{ 
      bgcolor: '#F8FAFC',
      minHeight: '100vh',
      py: 6
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <UserProfile  />
          </Grid>
          <Grid item xs={12} md={6}>
            <ChildrenList children={allChildren} />
          </Grid>
        </Grid>
      </Container>
      <MySnackbar ref={snackRef} />
    </Box>
  );
};

export default Profile;