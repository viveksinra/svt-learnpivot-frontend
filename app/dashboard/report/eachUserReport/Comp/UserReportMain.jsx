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
import OnePurchasedMockTest from './OnePurchasedMockTest';
import OnePurchasedCourse from './OnePurchasedCourse';
import OneUserData from './OneUserData';
import OneAccessCom from './OneAccessCom';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));



const StyledChip = styled(Chip)(({ theme, color }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  fontWeight: 500,
  borderRadius: '6px',
}));



const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}));

const UserReportMain = ({ reportData, profileType }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedChild, setSelectedChild] = useState(reportData?.children[0]?._id || '');

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
    if (reportData.courseBought) {
      reportData.courseBought.forEach(course => {
        // Check if this course is for the selected child
        if (course.childId && course.childId._id === selectedChild) {
          const upcomingDates = course.selectedDates
            .filter(date => new Date(date) > today)
            .map(date => ({
              date,
              title: course.courseId?.courseTitle || 'Course',
              startTime: course.courseId?.startTime,
              endTime: course.courseId?.endTime,
              image: course.courseId?.imageUrls?.[0] || '',
              type: 'course'
            }));
          
          upcomingCourses.push(...upcomingDates);
        }
      });
    }
    
    // Get upcoming mock test sessions from mock test access bought data
    if (reportData.mocktestBought) {
      console.log(reportData.mocktestBought)
      reportData.mocktestBought.forEach(test => {
        // Check if this test is for the selected child
        if (test.childId && test.childId._id === selectedChild) {
          if (test.selectedBatch) {
            test.selectedBatch.forEach(batch => {
              // Check if this batch date is in the future
              if (new Date(batch.date) > today) {
                upcomingMockTests.push({
                  date: batch.date,
                  title: test.mockTestId?.mockTestTitle || 'Mock Test',
                  startTime: batch.startTime,
                  endTime: batch.endTime,
                  image: test.mockTestId?.imageUrls?.[0] || '',
                  type: 'mockTest'
                });
              }
            });
          }
        }
      });
    }
    
    // Alternative check in mocktestBought data if access data isn't available
    if (reportData.mocktestBought && upcomingMockTests.length === 0) {
      reportData.mocktestBought.forEach(mockTest => {
        if (mockTest.childId?._id === selectedChild && mockTest.selectedBatch) {
          const upcomingBatches = mockTest.selectedBatch
            .filter(batch => new Date(batch.date) > today)
            .map(batch => ({
              date: batch.date,
              title: mockTest.mockTestId?.mockTestTitle || 'Mock Test',
              startTime: batch.startTime,
              endTime: batch.endTime,
              image: mockTest.mockTestId?.imageUrls?.[0] || '',
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

  // Get selected child's name
  const selectedChildName = getSelectedChild()?.childName || '';

  if (!reportData) return null;

  return (
    <Box sx={{ pt: 1 }}>
      {/* User Info Header */}
      <OneUserData reportData={reportData} profileType={profileType} />

      {/* Access Comparison Section - MOVED TO BEFORE CHILD SELECTION */}
      <OneAccessCom 
        reportData={reportData} 
        selectedChild={selectedChild} 
        selectedChildName={selectedChildName} 
        profileType={profileType}
      />

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
                  course.selectedDates?.length > 0 ? (
                    <OnePurchasedCourse course={course} profileType={profileType} />
                  ) : (
                    < >
                    </>
                  )
                
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
                  test.selectedBatch?.length > 0 ? (
                    <OnePurchasedMockTest test ={test} profileType={profileType} />
                  ) : (
                    < >
                    </>
                  )
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