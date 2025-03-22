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
import UserReportMain from './Comp/UserReportMain';
import PersonIcon from '@mui/icons-material/Person';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SearchIcon from '@mui/icons-material/Search';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ReportIcon from '@mui/icons-material/Report';

const EachUserReport = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMode, setSearchMode] = useState('parent'); // 'parent' or 'child'
  const [selectedUser, setSelectedUser] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [inputValue, setInputValue] = useState('');

  async function fetchAllUsers() {
    setLoading(true);
    setError(null);
    try {
      let response = await registrationService.getAllChildForDropDown();
      if (response.variant === "success") {
        // Extract unique parents from children data
        const uniqueParents = [];
        const parentIds = new Set();
        
        response.data.forEach(child => {
          if (child.parent && !parentIds.has(child.parent._id)) {
            parentIds.add(child.parent._id);
            uniqueParents.push({
              _id: child.parent._id,
              name: `${child.parent.firstName} ${child.parent.lastName}`,
              type: 'parent',
              children: []
            });
          }
        });
        
        // Add children to their respective parents
        response.data.forEach(child => {
          const parent = uniqueParents.find(p => p._id === child.parent?._id);
          if (parent) {
            parent.children.push({
              _id: child._id,
              name: child.childName,
              year: child.childYear,
              parent: child.parent,
              type: 'child'
            });
          }
        });
        
        // Create a flat list for searching
        const allUsers = [
          ...uniqueParents,
          ...response.data.map(child => ({
            _id: child._id,
            name: child.childName,
            year: child.childYear,
            parent: child.parent,
            type: 'child'
          }))
        ];
        
        setAllUsers(allUsers);
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchReport(user) {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      let data;
      if (user.type === 'parent') {
        data = { userId: user._id };
      } else {
        data = { childId: user._id, userId: user.parent?._id };
      }
      
      let response = await registrationService.getOneUserOrChildReport(data);
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
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchReport(selectedUser);
    }
  }, [selectedUser]);

  const handleSearchModeChange = (event, newValue) => {
    setSearchMode(newValue);
    setSelectedUser(null);
    setReportData(null);
    setInputValue('');
  };

  const filteredOptions = allUsers.filter(user => 
    searchMode === 'all' || user.type === searchMode
  );

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 3, mt: 2, borderRadius: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <ReportIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">User Activity Report</Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{error}</Alert>
        )}
        
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)',
            borderRadius: '8px' 
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Tabs 
                value={searchMode} 
                onChange={handleSearchModeChange}
                variant="fullWidth"
                sx={{ mb: 2 }}
              >
                <Tab 
                  icon={<PersonIcon />} 
                  label="Parent" 
                  value="parent" 
                  sx={{ borderRadius: '8px 0 0 8px' }}
                />
                <Tab 
                  icon={<ChildCareIcon />} 
                  label="Child" 
                  value="child" 
                  sx={{ borderRadius: '0 8px 8px 0' }}
                />
              </Tabs>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Autocomplete
                id="user-search"
                options={filteredOptions}
                value={selectedUser}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                getOptionLabel={(option) => {
                  if (option.type === 'child') {
                    return `${option.name} (${option.year}) - ${option.parent?.firstName || ''} ${option.parent?.lastName || ''}`;
                  }
                  return option.name;
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ flexWrap: 'wrap' }}>
                    <Avatar 
                      sx={{ mr: 2, bgcolor: option.type === 'parent' ? 'primary.main' : 'secondary.main' }}
                    >
                      {option.type === 'parent' ? <PersonIcon /> : <ChildCareIcon />}
                    </Avatar>
                    {option.type === 'child' ? (
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body1" noWrap>{option.name}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {option.year} - {option.parent?.firstName} {option.parent?.lastName}
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body1" noWrap>{option.name}</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {option.children?.length || 0} children
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
                onChange={(event, newValue) => {
                  setSelectedUser(newValue);
                }}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`Search ${searchMode === 'parent' ? 'Parents' : 'Children'}`}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <>
                          <SearchIcon color="action" sx={{ ml: 1, mr: 1 }} />
                          {params.InputProps.startAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                ListboxProps={{
                  sx: { maxWidth: '100%' }
                }}
                sx={{
                  '& .MuiAutocomplete-option': {
                    wordBreak: 'break-word',
                    whiteSpace: 'normal'
                  },
                  '& .MuiAutocomplete-listbox': {
                    '& li': {
                      display: 'flex',
                      flexWrap: 'wrap'
                    }
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

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
          <UserReportMain reportData={reportData} />
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

export default EachUserReport;
