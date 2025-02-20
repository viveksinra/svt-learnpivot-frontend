import React, { useEffect, useState } from 'react';
import { 
  Card, Box, Chip, Typography, Stack, Button, 
  Skeleton, Container, useTheme, useMediaQuery, Grid,
  Divider, Alert, LinearProgress, Avatar
} from '@mui/material';
import { 
  EventAvailable, EventBusy, CalendarMonth,
  CheckCircleOutline, ErrorOutline, School, ArrowForward,
  Person, AccessTime, Block
} from '@mui/icons-material';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { reportService } from '@/app/services';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const LoadingSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Grid container spacing={2}>
      {[1, 2].map((item) => (
        <Grid item key={item} xs={12}>
          <Card sx={{ p: 2, borderRadius: 2 }}>
            <Stack spacing={1.5}>
              <Skeleton variant="rounded" width={200} height={24} />
              <Skeleton variant="text" width="60%" sx={{ fontSize: '1rem' }} />
              <Divider />
              <Stack spacing={1}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rounded" height={40} />
                ))}
              </Stack>
              <Skeleton variant="rounded" width={120} height={36} sx={{ alignSelf: 'flex-end' }} />
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const EmptyState = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card sx={{ 
      p: 3,
      textAlign: 'center',
      borderRadius: 2,
      bgcolor: 'background.paper',
      boxShadow: theme.shadows[1]
    }}>
      <Box sx={{ p: 2 }}>
        <CalendarMonth sx={{ 
          fontSize: isMobile ? 40 : 48, 
          color: 'primary.main', 
          mb: 1.5 
        }} />
        <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
          No Payment Alerts Found
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You're all set! There are no pending payments for upcoming classes.
        </Typography>
      </Box>
    </Card>
  );
};

const CoursePaymentCard = ({ courseData }) => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Calculate total dates and payment progress
  const allDates = courseData.courseDateSets.flatMap(set => set.dates);
  const totalDates = allDates.length;
  const purchasedDates = courseData.totalPurchasedDates;
  const progressPercentage = (purchasedDates / totalDates) * 100;
  
  // Group dates by payment status
  const unpaidDates = allDates.filter(date => !date.purchased);
  const upcomingUnpaidDates = unpaidDates
    .filter(date => new Date(date.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Find next upcoming unpaid date
  const nextUnpaidDate = upcomingUnpaidDates[0];
  
  const handleNavigateToPayment = () => {
    router.push(`/course/${courseData.courseLink}/payment`);
  };

  const child = courseData.childInfo;
  
  // Process sets - mark dates as skipped if any date in the set is paid
  const processedDateSets = courseData.courseDateSets.map((set, setIndex) => {
    const hasPaidDate = set.dates.some(date => date.purchased);
    
    return {
      ...set,
      setNumber: setIndex + 1,
      dates: set.dates.map(date => ({
        ...date,
        skipped: hasPaidDate && !date.purchased
      }))
    };
  });
  
  return (
    <Card sx={{ 
      p: 2,
      borderRadius: 2,
      position: 'relative',
      overflow: 'visible',
      boxShadow: theme.shadows[2],
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        boxShadow: theme.shadows[4],
        transform: 'translateY(-2px)'
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        bgcolor: nextUnpaidDate ? 'error.main' : 'success.main',
        borderRadius: '8px 8px 0 0'
      }
    }}>
      <Stack spacing={2}>
        {/* Child Info Section */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            sx={{ 
              bgcolor: child.childGender === 'Boy' ? 'primary.light' : 'secondary.light',
              width: 40,
              height: 40
            }}
          >
            <Person />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {child.childName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {child.childYear} • {child.childGender}
            </Typography>
          </Box>
        </Stack>
        
        <Divider />
        
        <Box>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 700, 
                lineHeight: 1.3,
              }}
            >
              {courseData.courseTitle}
            </Typography>
            <Chip 
              label={`${purchasedDates}/${totalDates} Paid`}
              size="small"
              color={purchasedDates === totalDates ? "success" : "warning"}
              sx={{ 
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
            <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {courseData.batchTime}
            </Typography>
            
          </Stack>
        </Box>
        
   
        
        {nextUnpaidDate && (
          <Alert 
            severity="error"
            icon={<EventBusy />}
            sx={{ 
              borderRadius: 1.5,
              '& .MuiAlert-message': { width: '100%' }
            }}
          >
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" fontWeight={600}>
                Payment Due
              </Typography>
              <Typography variant="body2">
                Next class on {moment(nextUnpaidDate.date).format('dddd, MMMM D, YYYY')} requires payment
              </Typography>
            </Stack>
            
          </Alert>
        )}
        
      <Accordion>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography component="span">Detail</Typography>
        </AccordionSummary>
        <AccordionDetails>
<Box sx={{ width: '100%' }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
            <Typography variant="caption" color="text.secondary">Payment Progress</Typography>
            <Typography variant="caption" fontWeight={500}>
              {progressPercentage.toFixed(0)}%
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 8,
              borderRadius: 1,
              bgcolor: 'grey.100',
              '& .MuiLinearProgress-bar': {
                bgcolor: progressPercentage === 100 ? 'success.main' : 
                         progressPercentage > 50 ? 'warning.main' : 'error.main',
              }
            }}
          />
        </Box>
        {/* Display all date sets */}
        {processedDateSets.map((set, setIndex) => (
          <Box key={setIndex} sx={{ mt: setIndex > 0 ? 2 : 0 }}>
            <Typography variant="subtitle2" gutterBottom>
              Set {set.setNumber} Classes:
            </Typography>
            
            <Grid container spacing={1}>
              {set.dates.map((dateObj, dateIndex) => (
                <Grid item xs={6} sm={4} md={3} key={dateIndex}>
                  <Box 
                    sx={{
                      p: 1,
                      border: '1px solid',
                      borderColor: dateObj.purchased ? 'success.light' : 
                                dateObj.skipped ? 'grey.300' :
                                new Date(dateObj.date) < new Date() ? 'grey.300' : 'warning.light',
                      borderRadius: 1.5,
                      bgcolor: dateObj.purchased ? 'success.lighter' : 
                               dateObj.skipped ? 'grey.50' :
                               new Date(dateObj.date) < new Date() ? 'grey.50' : 'warning.lighter',
                      textAlign: 'center',
                      position: 'relative'
                    }}
                  >
                    {dateObj.purchased && (
                      <CheckCircleOutline 
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          fontSize: 14,
                          color: 'success.main'
                        }}
                      />
                    )}
                    {dateObj.skipped && (
                      <Block
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          fontSize: 14,
                          color: 'text.disabled'
                        }}
                      />
                    )}
                    <Typography variant="caption" display="block" fontWeight={600}>
                      {moment(dateObj.date).format('MMM D')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {moment(dateObj.date).format('ddd')}
                    </Typography>
                    <Chip
                      label={dateObj.purchased ? "Paid" : 
                             dateObj.skipped ? "Skipped" :
                             new Date(dateObj.date) < new Date() ? "Missed" : "Unpaid"}
                      size="small"
                      color={dateObj.purchased ? "success" : 
                             dateObj.skipped ? "default" :
                             new Date(dateObj.date) < new Date() ? "default" : "warning"}
                      sx={{ 
                        height: 20, 
                        '& .MuiChip-label': { px: 0.5, fontSize: '0.625rem', fontWeight: 600 }
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
        
        
        </AccordionDetails>
        </Accordion>
      </Stack>
    </Card>
  );
};

export const PaymentAlert = ({ selectedChild }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [courseData, setCourseData] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await reportService.getUpcomingPayment({ childId: selectedChild });
        if (response.variant === "success") {
          setCourseData(response.data);
        } else {
          setError("Failed to fetch payment data");
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load payment alerts. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedChild]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 3, px: isMobile ? 1 : 2 }}>
        <Typography variant="h6" sx={{ 
          mb: 3, 
          fontWeight: 700,
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}>
          Payment Alerts
        </Typography>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        p: isMobile ? 2 : 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        mx: 2,
        my: 3
      }}>
        <Typography 
          color="error" 
          variant="body2"
          gutterBottom
          sx={{ mb: 2 }}
        >
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => setError(null)}
          sx={{ borderRadius: 1.5 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: isMobile ? 2 : 3,
        px: isMobile ? 1 : 2
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}
        >
          Payment Alerts
        </Typography>
        {courseData.length > 0 && (
          <Chip 
            label={courseData.length}
            size="small"
            color="error"
            sx={{ height: 20, minWidth: 20 }}
          />
        )}
      </Stack>

      {courseData.length > 0 ? (
        <Grid container spacing={3}>
          {courseData.map((course, index) => (
            <Grid item key={index} xs={12} md={6}>
              <CoursePaymentCard courseData={course} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState />
      )}
    </Container>
  );
};

export default PaymentAlert;