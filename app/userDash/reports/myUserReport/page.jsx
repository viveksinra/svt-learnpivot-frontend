"use client";
import { registrationService } from '@/app/services';
import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  Box, 
  Container, 
  Skeleton, 
  Paper, 
  Typography, 
  Avatar, 
  Grid, 
 
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import UserReportMain from '@/app/dashboard/report/eachUserReport/Comp/UserReportMain';

const EachUserReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState('parent'); // 'parent' or 'child'
  const [selectedUser, setSelectedUser] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [inputValue, setInputValue] = useState('');



  async function fetchReport() {
    
    setLoading(true);
    setError(null);
    
    try {
      let data = {};
 
      
      let response = await registrationService.getMyUserReport(data);
      if (response.variant === "success") {
        setReportData(response.data);
      } else {
        setError("Failed to fetch report");
      }
    } catch (error) {
      setError("An error occurred while fetching report");
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  }



  useEffect(() => {
      fetchReport();
  }, []);



  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <AssessmentIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">My Account Report</Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>
        )}
        
      

        {loading ? (
          <Box sx={{ width: '100%' }}>
            <Skeleton variant="rectangular" height={200} sx={{ mb: 2, borderRadius: '8px' }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={150} sx={{ borderRadius: '8px' }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={150} sx={{ borderRadius: '8px' }} />
              </Grid>
              <Grid item xs={12} md={4}>
                <Skeleton variant="rectangular" height={150} sx={{ borderRadius: '8px' }} />
              </Grid>
            </Grid>
          </Box>
        ) : reportData ? (
          <UserReportMain reportData={reportData} profileType="user"/>
        ) :  (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <AssessmentIcon color="action" sx={{ fontSize: 60, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Loading report data...
            </Typography>
          </Box>
        ) }
      </Paper>
    </Container>
  );
};

export default EachUserReport;
