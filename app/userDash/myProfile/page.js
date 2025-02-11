'use client';
import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import UserProfile from './Comp/MyProfile';
import ChildrenList from './Comp/MyChild';
import { myProfileService } from '@/app/services';

export default function ProfilePage() {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await myProfileService.getMyChildren();
        if (response.variant === 'success') {
          setChildren(response.data || []);
        } else {
          setError(response.message || 'Failed to load children');
        }
      } catch (err) {
        setError('Error loading children data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={7}>
        <UserProfile />
      </Grid>
      <Grid item xs={12} md={5}>
        <ChildrenList 
          children={children} 
          isLoading={isLoading} 
          error={error} 
        />
      </Grid>
    </Grid>
  );
}
