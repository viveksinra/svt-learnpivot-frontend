"use client";
import React, { useState } from 'react';
import {
  Avatar, 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Tabs, 
  Tab, 
  Card, 
  CardContent, 
  CardMedia, 
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import SchoolIcon from '@mui/icons-material/School';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PaymentIcon from '@mui/icons-material/Payment';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AlarmIcon from '@mui/icons-material/Alarm';
import InfoIcon from '@mui/icons-material/Info';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  },
  overflow: 'hidden',
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  fontWeight: 500,
  borderRadius: '6px',
}));

const DateTimeItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}));

const UserReportMain = ({ reportData }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedChild, setSelectedChild] = useState(reportData?.children[0]?._id || '');
  const [accessTab, setAccessTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChildChange = (childId) => {
    setSelectedChild(childId);
  };

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

  // Get selected child data
  const getSelectedChild = () => {
    return reportData.children.find(child => child._id === selectedChild) || reportData.children[0];
  };

  // Get courses for the selected child
  const getChildCourses = () => {
    if (!reportData?.courseBought) return [];
    
    return reportData.courseBought.filter(
      course => course.childId?._id === selectedChild
    );
  };

  // Get mock tests for the selected child
  const getChildMockTests = () => {
    if (!reportData?.mocktestBought) return [];
    
    return reportData.mocktestBought.filter(
      test => test.childId?._id === selectedChild
    );
  };

  // Calculate total spent
  const calculateTotalSpent = () => {
    if (!reportData) return { courseTotal: 0, mockTestTotal: 0, total: 0 };
    
    const courseTotal = (reportData.courseBought || [])
      .filter(course => course.childId?._id === selectedChild)
      .reduce((sum, course) => sum + (course.amount || 0), 0);
      
    const mockTestTotal = (reportData.mocktestBought || [])
      .filter(test => test.childId?._id === selectedChild)
      .reduce((sum, test) => sum + (test.amount || 0), 0);
      
    return { courseTotal, mockTestTotal, total: courseTotal + mockTestTotal };
  };

  // Count upcoming sessions
  const getUpcomingSessions = () => {
    if (!reportData) return { courses: [], mockTests: [] };
    
    const today = new Date();
    const upcomingCourses = [];
    const upcomingMockTests = [];
    
    // Get upcoming course sessions
    if (reportData.courseAccessBought) {
      reportData.courseAccessBought.forEach(course => {
        const childData = course.children?.find(child => child.childId === selectedChild);
        if (childData) {
          const upcomingDates = childData.selectedDates
            .filter(date => new Date(date) > today)
            .map(date => ({
              date,
              title: course.courseTitle,
              startTime: course.startTime,
              endTime: course.endTime,
              image: course.imageUrls?.[0] || '',
              type: 'course'
            }));
          
          upcomingCourses.push(...upcomingDates);
        }
      });
    }
    
    // Get upcoming mock test sessions
    if (reportData.mocktestAccessBought) {
      reportData.mocktestAccessBought.forEach(test => {
        const childData = test.children?.find(child => child.childId === selectedChild);
        if (childData) {
          const upcomingBatches = childData.selectedBatch
            .filter(batch => new Date(batch.date) > today)
            .map(batch => ({
              date: batch.date,
              title: test.mockTestTitle,
              startTime: batch.startTime,
              endTime: batch.endTime,
              image: test.imageUrls?.[0] || '',
              type: 'mockTest'
            }));
          
          upcomingMockTests.push(...upcomingBatches);
        }
      });
    }
    
    // Sort by date
    upcomingCourses.sort((a, b) => new Date(a.date) - new Date(b.date));
    upcomingMockTests.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return { courses: upcomingCourses, mockTests: upcomingMockTests };
  };

  const { courses: upcomingCourses, mockTests: upcomingMockTests } = getUpcomingSessions();
  const totals = calculateTotalSpent();
  
  // Merge and sort all upcoming sessions
  const allUpcomingSessions = [...upcomingCourses, ...upcomingMockTests]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Show only next 5 sessions

  // Count upcoming sessions by month
  const getSessionsByMonth = () => {
    const months = {};
    const allSessions = [...upcomingCourses, ...upcomingMockTests];
    
    allSessions.forEach(session => {
      const date = new Date(session.date);
      const monthYear = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
      
      if (!months[monthYear]) {
        months[monthYear] = { count: 0, courses: 0, mockTests: 0 };
      }
      
      months[monthYear].count++;
      if (session.type === 'course') {
        months[monthYear].courses++;
      } else {
        months[monthYear].mockTests++;
      }
    });
    
    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data
    }));
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
    if (!reportData || !reportData.mocktestAccess || !reportData.mocktestAccessBought) {
      return { available: [], purchased: [], notPurchased: [] };
    }

    // All mock tests available to the user
    const allMockTestAccess = reportData.mocktestAccess.map(test => ({
      ...test,
      isPurchased: false
    }));
    
    // Mock tests purchased for the selected child
    const purchasedMockTests = [];
    
    // Find purchased mock tests for the selected child
    reportData.mocktestAccessBought.forEach(test => {
      const childData = test.children?.find(child => child.childId === selectedChild);
      if (childData) {
        purchasedMockTests.push({
          ...test,
          isPurchased: true,
          purchaseInfo: childData
        });
      }
    });
    
    // Find mock tests that are available but not purchased
    const notPurchasedMockTests = allMockTestAccess.filter(test => 
      !purchasedMockTests.some(purchased => purchased._id === test._id)
    );
    
    return {
      available: allMockTestAccess,
      purchased: purchasedMockTests,
      notPurchased: notPurchasedMockTests
    };
  };

  const courseComparison = getCourseAccessComparison();
  const mockTestComparison = getMockTestAccessComparison();
  
  // Get selected child's name
  const selectedChildName = getSelectedChild()?.childName || '';

  if (!reportData) return null;

  return (
    <Box sx={{ pt: 1 }}>
      {/* User Info Header */}
      <ContentSection sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: 'primary.main',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
              }}
            >
              {reportData.user.userImage ? (
                <img src={reportData.user.userImage} alt="User" width="100%" />
              ) : (
                reportData.user.firstName.charAt(0)
              )}
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {reportData.user.firstName} {reportData.user.lastName}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">{reportData.user.email}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">{reportData.user.mobile}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ChildCareIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
                <Typography variant="body2">{reportData.children.length} Children</Typography>
              </Box>
            </Stack>
          </Grid>
        
        </Grid>
      </ContentSection>

      {/* Access Comparison Section - MOVED TO BEFORE CHILD SELECTION */}
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
                            <Typography variant="h6"  title={course.courseTitle}>
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
              {mockTestComparison.available.length} available mock tests • {mockTestComparison.purchased.length} purchased
            </Typography>
            
            {mockTestComparison.available.length > 0 ? (
              <Grid container spacing={2}>
                {mockTestComparison.available.map((test) => {
                  const isPurchased = mockTestComparison.purchased.some(p => p._id === test._id);
                  
                  return (
                    <Grid item xs={12} sm={6} md={4} key={test._id}>
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
                            <Typography variant="h6"  title={test.mockTestTitle}>
                              {test.mockTestTitle}
                            </Typography>
                          </Box>
                          
                          {isPurchased && (
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" color="success.main" fontWeight="bold">
                                Purchased for {selectedChildName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {mockTestComparison.purchased.find(p => p._id === test._id)?.purchaseInfo?.selectedBatch?.length || 0} batches
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
                <Typography color="text.secondary">No mock test access available</Typography>
              </Paper>
            )}
          </Box>
        )}
      </ContentSection>

      {/* User Info and Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Child Selection Cards */}
        <Grid item xs={12} md={4}>
          <ContentSection>
            <SectionTitle variant="h6">
              <ChildCareIcon color="primary" />
              Child Profile
            </SectionTitle>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                {reportData.children.map((child) => (
                  <Grid item xs={12} key={child._id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: child._id === selectedChild ? '2px solid #4568dc' : 'none',
                        bgcolor: child._id === selectedChild ? 'rgba(69, 104, 220, 0.1)' : 'white',
                        borderRadius: '10px',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => handleChildChange(child._id)}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar 
                            sx={{ 
                              width: 60, 
                              height: 60,
                              bgcolor: child._id === selectedChild ? '#4568dc' : 'grey.300' 
                            }}
                          >
                            {child.childImage ? (
                              <img src={child.childImage} alt={child.childName} width="100%" />
                            ) : (
                              child.childName.charAt(0)
                            )}
                          </Avatar>
                          <Box>
                            <Typography variant="h6">{child.childName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {child.childYear} • {child.childGender}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              DOB: {formatDate(child.childDob)}
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </ContentSection>
        </Grid>

        {/* Upcoming Sessions */}
        <Grid item xs={12} md={4}>
          <ContentSection>
            <SectionTitle variant="h6">
              <CalendarMonthIcon color="primary" />
              Upcoming Sessions
            </SectionTitle>
            
            {allUpcomingSessions.length > 0 ? (
              <List sx={{ p: 0 }}>
                {allUpcomingSessions.map((session, idx) => (
                  <ListItem 
                    key={idx} 
                    sx={{ 
                      p: 2, 
                      mb: 1, 
                      bgcolor: 'background.default',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: session.type === 'course' ? 'primary.light' : 'secondary.light',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Avatar
                        src={session.image}
                        variant="rounded"
                        sx={{ 
                          mr: 2, 
                          bgcolor: session.type === 'course' ? 'primary.light' : 'secondary.light',
                          width: 50,
                          height: 50
                        }}
                      >
                        {session.type === 'course' ? <SchoolIcon /> : <FactCheckIcon />}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {formatDate(session.date)}
                        </Typography>
                        <Typography variant="body2"  title={session.title}>
                          {session.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </Typography>
                        </Box>
                      </Box>
                      <StyledChip 
                        label={session.type === 'course' ? 'Course' : 'Mock Test'} 
                        size="small"
                        color={session.type === 'course' ? 'primary' : 'secondary'}
                        variant="outlined"
                      />
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography color="text.secondary">No upcoming sessions</Typography>
              </Paper>
            )}
          </ContentSection>
        </Grid>

        {/* Summary Stats */}
        <Grid item xs={12} md={4}>
          <ContentSection>
            <SectionTitle variant="h6">
              <InfoIcon color="primary" />
              Summary
            </SectionTitle>
            
            <Grid container spacing={2}>
              {/* Total Spent */}
              <Grid item xs={12}>
                <Card sx={{ bgcolor: 'primary.light', color: 'white', borderRadius: '10px' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle1">Total Spent</Typography>
                      <CurrencyPoundIcon />
                    </Box>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
                      £{totals.total.toFixed(2)}
                    </Typography>
                    <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.2)' }} />
                    <Grid container>
                      <Grid item xs={6}>
                        <Typography variant="caption">Courses</Typography>
                        <Typography sx={{color:"white"}} variant="body1" fontWeight="bold">£{totals.courseTotal.toFixed(2)}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption">Mock Tests</Typography>
                        <Typography sx={{color:"white"}} variant="body2" fontWeight="bold">£{totals.mockTestTotal.toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Sessions by Month */}
              <Grid item xs={12}>
                <Card sx={{ borderRadius: '10px' }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                      <EventNoteIcon sx={{ mr: 1, fontSize: 20 }} color="primary" />
                      Upcoming Sessions
                    </Typography>
                    
                    {getSessionsByMonth().length > 0 ? (
                      getSessionsByMonth().map((month, idx) => (
                        <Box key={idx} sx={{ mb: 1.5 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {month.month}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                              <SchoolIcon sx={{ fontSize: 14, mr: 0.5, color: 'primary.main' }} />
                              <Typography variant="caption" color="text.secondary">
                                {month.courses} Course{month.courses !== 1 ? 's' : ''}
                              </Typography>
                            </Box>
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                              <FactCheckIcon sx={{ fontSize: 14, mr: 0.5, color: 'secondary.main' }} />
                              <Typography variant="caption" color="text.secondary">
                                {month.mockTests} Mock Test{month.mockTests !== 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography color="text.secondary" variant="body2">
                        No upcoming sessions
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </ContentSection>
        </Grid>
      </Grid>
      
      {/* Courses and Mock Tests */}
      <Box sx={{ mb: 2 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            mb: 3,
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 1.5
            }
          }}
        >
          <Tab 
            icon={<SchoolIcon />} 
            label="Courses" 
            iconPosition="start"
          />
          <Tab 
            icon={<FactCheckIcon />} 
            label="Mock Tests" 
            iconPosition="start"
          />
        </Tabs>
        
        {selectedTab === 0 ? (
          <ContentSection>
            <SectionTitle variant="h6">
              <SchoolIcon color="primary" />
              Courses Purchased
            </SectionTitle>
            
            {getChildCourses().length > 0 ? (
              <Grid container spacing={3}>
                {getChildCourses().map((course) => (
                  <Grid item xs={12} sm={6} md={4} key={course._id}>
                    <StyledCard>
                      <CardMedia
                        component="img"
                        height="140"
                        image={course.courseId?.imageUrls?.[0] || 'https://via.placeholder.com/300x140?text=Course+Image'}
                        alt={course.courseId?.courseTitle}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {course.courseId?.courseTitle || 'Course Title'}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(course.courseId?.startTime)} - {formatTime(course.courseId?.endTime)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PaymentIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            £{course.amount?.toFixed(2)}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Selected Dates:
                        </Typography>
                        
                        <Box sx={{ maxHeight: 150, overflow: 'auto', pr: 1 }}>
                          {course.selectedDates?.map((date, idx) => (
                            <DateTimeItem key={idx}>
                              <CalendarMonthIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                              <Typography variant="body2">
                                {formatDate(date)}
                              </Typography>
                            </DateTimeItem>
                          ))}
                        </Box>
                        
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          fullWidth 
                          sx={{ mt: 2 }}
                          endIcon={<ArrowForwardIosIcon />}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography color="text.secondary">No courses purchased for {selectedChildName}</Typography>
              </Paper>
            )}
          </ContentSection>
        ) : (
          <ContentSection>
            <SectionTitle variant="h6">
              <FactCheckIcon color="primary" />
              Mock Tests Purchased
            </SectionTitle>
            
            {getChildMockTests().length > 0 ? (
              <Grid container spacing={3}>
                {getChildMockTests().map((test) => (
                  <Grid item xs={12} sm={6} md={4} key={test._id}>
                    <StyledCard>
                      <CardMedia
                        component="img"
                        height="140"
                        image={test.mockTestId?.imageUrls?.[0] || 'https://via.placeholder.com/300x140?text=Mock+Test+Image'}
                        alt={test.mockTestId?.mockTestTitle}
                      />
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {test.mockTestId?.mockTestTitle || 'Mock Test Title'}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <PaymentIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            £{test.amount?.toFixed(2)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CalendarMonthIcon sx={{ fontSize: 16, mr: 1, color: 'secondary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {test.selectedBatch?.length || 0} batches selected
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Typography variant="subtitle2" gutterBottom>
                          Selected Batches:
                        </Typography>
                        
                        <Box sx={{ maxHeight: 150, overflow: 'auto', pr: 1 }}>
                          {test.selectedBatch?.map((batch, idx) => (
                            <Box key={idx} sx={{ mb: 1.5 }}>
                              <DateTimeItem>
                                <CalendarMonthIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                                <Typography variant="body2">
                                  {formatDate(batch.date)}
                                </Typography>
                              </DateTimeItem>
                              <DateTimeItem>
                                <AccessTimeIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                                <Typography variant="body2">
                                  {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                                </Typography>
                              </DateTimeItem>
                            </Box>
                          ))}
                        </Box>
                        
                        <Button 
                          variant="outlined" 
                          color="secondary" 
                          fullWidth 
                          sx={{ mt: 2 }}
                          endIcon={<ArrowForwardIosIcon />}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </StyledCard>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                <Typography color="text.secondary">No mock tests purchased for {selectedChildName}</Typography>
              </Paper>
            )}
          </ContentSection>
        )}
      </Box>
    </Box>
  );
};

export default UserReportMain;