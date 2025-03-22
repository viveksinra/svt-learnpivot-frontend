import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Divider, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';

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

const DateTimeItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}));

const OnePurchasedCourse = ({course}) => {
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
  return (
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
  );
}

export default OnePurchasedCourse;