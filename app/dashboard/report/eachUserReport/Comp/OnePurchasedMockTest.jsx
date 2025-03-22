import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Divider, Button } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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

const OnePurchasedMockTest = ({test}) => {
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
    );
}

export default OnePurchasedMockTest;