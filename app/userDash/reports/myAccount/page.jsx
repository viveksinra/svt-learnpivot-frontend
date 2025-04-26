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

  Grid, 
 
} from '@mui/material';

import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';

import AssessmentIcon from '@mui/icons-material/Assessment';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { transactionService } from '@/app/services';
import UserTransactionReportMain from '@/app/dashboard/transaction/oneUserTransaction/Comp/UserTransactionReportMain';
import { QuickLinks } from '@/app/Components/UserDash/QuickLinks';

const MyTransactionReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [reportData, setReportData] = useState(null);




  async function fetchReport() {

    
    setLoading(true);
    setError(null);
    
    try {

      
      let response = await transactionService.getMyTransactionAndBalance();
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
      <QuickLinks />
      <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AccountBalanceWalletIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">My Super Coin Report</Typography>
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
        ) : reportData && reportData.statement && reportData.statement.transactions && reportData.statement.transactions.length > 0 ? (
          <UserTransactionReportMain reportData={reportData} />
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <AccountBalanceWalletIcon color="action" sx={{ fontSize: 60, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              You don't have any Supercoin transactions yet.
            </Typography>
          </Box>
        ) }
      </Paper>


    </Container>
  );
};

export default MyTransactionReport;
