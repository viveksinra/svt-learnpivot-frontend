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
  Card, 
  CardContent, 
  Chip,
  Tabs,
  Tab,
  IconButton,
  Button,
  Divider,
  Stack,
  Autocomplete,
  TextField
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReportIcon from '@mui/icons-material/Report';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { transactionService } from '@/app/services';
import UserTransactionReportMain from '@/app/dashboard/transaction/oneUserTransaction/Comp/UserTransactionReportMain';

const MyTransactionReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState('parent'); // 'parent' or 'child'
  const [selectedUser, setSelectedUser] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState('deposit'); // 'deposit' or 'withdraw'



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
      <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ReportIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">User Transaction Report</Typography>
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
          <UserTransactionReportMain reportData={reportData} />
        ) : selectedUser ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <AssessmentIcon color="action" sx={{ fontSize: 60, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Loading report data...
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <FamilyRestroomIcon color="action" sx={{ fontSize: 60, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Select a parent or child to view their report
            </Typography>
          </Box>
        )}
      </Paper>


    </Container>
  );
};

export default MyTransactionReport;
