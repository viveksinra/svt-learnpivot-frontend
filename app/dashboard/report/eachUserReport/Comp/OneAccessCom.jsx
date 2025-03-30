"use client";
import React, { useState } from 'react';
import {
  Avatar, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  Chip,
  Badge,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ChildCareIcon from '@mui/icons-material/ChildCare';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}));

const OneAccessCom = ({ reportData, selectedChild, selectedChildName }) => {
  const [accessTab, setAccessTab] = useState(0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Convert 24-hour format to 12-hour format with AM/PM
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  // New function to compare course access vs purchased
  const getCourseAccessComparison = () => {
    if (!reportData || !reportData.courseAccess || !reportData.courseAccessBought) {
      return { available: [], purchased: [], notPurchased: [] };
    }

    // All courses available to the user
    const allCourseAccess = reportData.courseAccess.map(course => ({
      ...course,
      isPurchased: false
    }));
    
    // Courses purchased for the selected child
    const purchasedCourses = [];
    
    // Find purchased courses for the selected child
    reportData.courseAccessBought.forEach(course => {
      const childData = course.children?.find(child => child.childId === selectedChild);
      if (childData) {
        purchasedCourses.push({
          ...course,
          isPurchased: true,
          purchaseInfo: childData
        });
      }
    });
    
    // Find courses that are available but not purchased
    const notPurchasedCourses = allCourseAccess.filter(course => 
      !purchasedCourses.some(purchased => purchased._id === course._id)
    );
    
    return {
      available: allCourseAccess,
      purchased: purchasedCourses,
      notPurchased: notPurchasedCourses
    };
  };
  
  // New function to compare mocktest access vs purchased
  const getMockTestAccessComparison = () => {
    if (!reportData || !reportData.mocktestAccess) {
      return { available: [], purchased: [], notPurchased: [] };
    }

    // Create a map of all available mock tests with their batches
    const allMockTestsMap = reportData.mocktestAccess.reduce((acc, test) => {
      acc[test._id] = {
        ...test,
        isPurchased: false,
        purchasedBatches: []
      };
      return acc;
    }, {});
    
    // Find purchased mock test batches for the selected child
    const purchasedTests = [];
    
    if (reportData.mocktestAccessBought) {
      reportData.mocktestAccessBought.forEach(test => {
        const testWithPurchasedBatches = {
          ...test,
          isPurchased: false,
          purchasedBatches: []
        };

        // Check each batch if it's purchased for the selected child
        test.batch?.forEach(batch => {
          const childPurchase = batch.children?.find(child => child.childId === selectedChild);
          if (childPurchase) {
            testWithPurchasedBatches.isPurchased = true;
            testWithPurchasedBatches.purchasedBatches.push({
              ...batch,
              purchaseInfo: childPurchase
            });
          }
        });

        if (testWithPurchasedBatches.isPurchased) {
          purchasedTests.push(testWithPurchasedBatches);
          
          // Update the all tests map to mark this test as purchased
          if (allMockTestsMap[test._id]) {
            allMockTestsMap[test._id].isPurchased = true;
            allMockTestsMap[test._id].purchasedBatches = testWithPurchasedBatches.purchasedBatches;
            
            // Make sure we also copy the batch data with children information
            if (allMockTestsMap[test._id].batch) {
              // Replace the batch array with the one from the access bought data
              // which includes the children information
              allMockTestsMap[test._id].batch = test.batch;
            }
          }
        }
      });
    }
    
    // Convert the map back to an array
    const allMockTestAccess = Object.values(allMockTestsMap);
    
    // Find mock tests that are available but not purchased for this child
    const notPurchasedTests = allMockTestAccess.filter(test => !test.isPurchased);
    
    return {
      available: allMockTestAccess,
      purchased: purchasedTests,
      notPurchased: notPurchasedTests
    };
  };

  const courseComparison = getCourseAccessComparison();
  const mockTestComparison = getMockTestAccessComparison();

  return (
    <ContentSection sx={{ mb: 4 }}>
      <SectionTitle variant="h6">
        <CompareArrowsIcon color="primary" />
        Access Comparison
      </SectionTitle>
      
      <Tabs
        value={accessTab}
        onChange={(e, newValue) => setAccessTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Courses" icon={<SchoolIcon />} iconPosition="start" />
        <Tab label="Mock Tests" icon={<FactCheckIcon />} iconPosition="start" />
      </Tabs>
      
      {accessTab === 0 ? (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            {courseComparison.available.length} available courses • {courseComparison.purchased.length} purchased
          </Typography>
          
          {courseComparison.available.length > 0 ? (
            <Grid container spacing={2}>
              {courseComparison.available.map((course) => {
                const isPurchased = courseComparison.purchased.some(p => p._id === course._id);
                
                return (
                  <Grid item xs={12} sm={6} md={4} key={course._id}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderColor: isPurchased ? 'success.main' : 'divider',
                        position: 'relative',
                        borderRadius: '10px'
                      }}
                    >
                      {isPurchased && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            right: 10, 
                            top: 10, 
                            bgcolor: 'success.main',
                            color: 'white',
                            borderRadius: '50%',
                            p: 0.5,
                            zIndex: 1
                          }}
                        >
                          <CheckCircleIcon />
                        </Box>
                      )}
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            variant="rounded" 
                            src={course.imageUrls?.[0]} 
                            sx={{ mr: 2, width: 40, height: 40 }}
                          >
                            <SchoolIcon />
                          </Avatar>
                          <Typography variant="h6" title={course.courseTitle}>
                            {course.courseTitle}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(course.startTime)} - {formatTime(course.endTime)}
                          </Typography>
                        </Box>
                        
                        {isPurchased && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                              Purchased for {selectedChildName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {courseComparison.purchased.find(p => p._id === course._id)?.purchaseInfo?.selectedDates?.length || 0} sessions
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography color="text.secondary">No course access available</Typography>
            </Paper>
          )}
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            {mockTestComparison.available.length} available mock tests • {mockTestComparison.purchased.length} purchased with {
              mockTestComparison.purchased.reduce((total, test) => total + (test.purchasedBatches?.length || 0), 0)
            } batches
          </Typography>
          
          {mockTestComparison.available.length > 0 ? (
            <Grid container spacing={2}>
              {mockTestComparison.available.map((test) => {
                const isPurchased = test.isPurchased;
                const purchasedBatches = test.purchasedBatches || [];
                const availableBatches = test.batch || [];
                
                return (
                  <Grid item xs={12} sm={6} key={test._id}>
                    <Card 
                      variant="outlined" 
                      sx={{ 
                        borderColor: isPurchased ? 'success.main' : 'divider',
                        position: 'relative',
                        borderRadius: '10px'
                      }}
                    >
                      {isPurchased && (
                        <Box 
                          sx={{ 
                            position: 'absolute', 
                            right: 10, 
                            top: 10, 
                            bgcolor: 'success.main',
                            color: 'white',
                            borderRadius: '50%',
                            p: 0.5,
                            zIndex: 1
                          }}
                        >
                          <CheckCircleIcon />
                        </Box>
                      )}
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            variant="rounded" 
                            src={test.imageUrls?.[0]} 
                            sx={{ mr: 2, width: 40, height: 40 }}
                          >
                            <FactCheckIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h6" title={test.mockTestTitle}>
                              {test.mockTestTitle}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {availableBatches.length || 0} available batches
                            </Typography>
                          </Box>
                        </Box>
                        
                        {isPurchased && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="success.main" fontWeight="bold">
                              {purchasedBatches.length} batch{purchasedBatches.length !== 1 ? 'es' : ''} purchased
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              Batch-specific purchases for this child are highlighted below
                            </Typography>
                          </Box>
                        )}
                        
                        {/* Show available batches for this mock test */}
                        {availableBatches.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                              Batches:
                            </Typography>
                            <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {availableBatches.map((batch, idx) => {
                                const isPurchasedBatch = isPurchased && 
                                  purchasedBatches.some(pb => pb._id === batch._id);
                                
                                return (
                                  <Box 
                                    key={idx} 
                                    sx={{ 
                                      p: 1.5, 
                                      mb: 1, 
                                      borderRadius: '8px',
                                      border: '1px solid',
                                      borderColor: isPurchasedBatch ? 'success.main' : 'divider',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'flex-start'
                                    }}
                                  >
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="body2" fontWeight="bold">
                                        {formatDate(batch.date)}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                                      </Typography>
                                      
                                      {batch.filled && (
                                        <Chip 
                                          size="small" 
                                          label="Full" 
                                          color="error" 
                                          variant="outlined"
                                          sx={{ mt: 1, mr: 1 }}
                                        />
                                      )}
                                      
                                      {batch.fillingFast && !batch.filled && (
                                        <Chip 
                                          size="small" 
                                          label="Filling Fast" 
                                          color="warning" 
                                          variant="outlined"
                                          sx={{ mt: 1, mr: 1 }}
                                        />
                                      )}
                                      
                                      {/* Display the children who purchased this batch */}
                                      {batch.children && batch.children.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                          {batch.children.map((child, childIdx) => (
                                            <Chip
                                              key={childIdx}
                                              size="small"
                                              label={child.childName}
                                              color="primary"
                                              variant="outlined"
                                              sx={{ mr: 0.5, mt: 0.5 }}
                                              icon={<ChildCareIcon fontSize="small" />}
                                            />
                                          ))}
                                        </Box>
                                      )}
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      {batch.oneBatchprice && (
                                        <Chip 
                                          size="small"
                                          label={`£${batch.oneBatchprice}`}
                                          color={isPurchasedBatch ? "success" : "default"}
                                          variant={isPurchasedBatch ? "filled" : "outlined"}
                                          sx={{ mr: 1 }}
                                        />
                                      )}
                                      
                                      {isPurchasedBatch ? (
                                        <Tooltip title="Purchased for this child">
                                          <CheckCircleIcon 
                                            color="success" 
                                            fontSize="small"
                                          />
                                        </Tooltip>
                                      ) : batch.children && batch.children.length > 0 ? (
                                        <Tooltip title={`${batch.children.length} child${batch.children.length > 1 ? 'ren' : ''} enrolled`}>
                                          <Badge 
                                            badgeContent={batch.children.length} 
                                            color="primary"
                                            max={99}
                                            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: '16px', minWidth: '16px' } }}
                                          >
                                            <ChildCareIcon color="action" fontSize="small" />
                                          </Badge>
                                        </Tooltip>
                                      ) : null}
                                    </Box>
                                  </Box>
                                );
                              })}
                            </Box>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
              <Typography color="text.secondary">No mock test access available</Typography>
            </Paper>
          )}
        </Box>
      )}
    </ContentSection>
  );
};

export default OneAccessCom;
