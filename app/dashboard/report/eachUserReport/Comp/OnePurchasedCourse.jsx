'use client';

import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Divider, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, 
  ListItemText, Checkbox, IconButton, TextField, InputAdornment, Alert, Snackbar } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import PersonIcon from '@mui/icons-material/Person';
import { styled } from '@mui/material/styles';
import { transactionService } from '@/app/services';
import { useRouter } from 'next/navigation';
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

const OnePurchasedCourse = ({course,  profileType}) => {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedDatesToCancel, setSelectedDatesToCancel] = useState([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [cancelMode, setCancelMode] = useState(''); // 'full' or 'selected'
  const [showDateSelection, setShowDateSelection] = useState(false);
  const [refundAmount, setRefundAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const router = useRouter();

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

  const calculateRefundAmount = () => {
let cancelDateLength = course.canceledDates?.length || 0;
const perSessionAmount = (course.amount || 0) / (course.selectedDates?.length + cancelDateLength || 1 );
    if (cancelMode === 'full') {
      // Full refund for all dates
      return perSessionAmount * course.selectedDates.length;
    } else if (selectedDatesToCancel.length > 0) {
      // Calculate refund amount based on selected dates
      return perSessionAmount * selectedDatesToCancel.length;
    }
    return 0;
  };

  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
    setShowDateSelection(false);
    setCancelMode('');
    setSelectedDatesToCancel([]);
    setRefundAmount(0);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    setShowDateSelection(false);
    setCancelMode('');
    setSelectedDatesToCancel([]);
    setRefundAmount(0);
  };

  const handleToggleDate = (date) => {
    setSelectedDatesToCancel(prev => {
      if (prev.includes(date)) {
        return prev.filter(d => d !== date);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleShowDateSelection = () => {
    setShowDateSelection(true);
    setCancelMode('selected');
  };

  const handleSelectFullCancel = () => {
    setCancelMode('full');
    const calculatedRefund = calculateRefundAmount();
    setRefundAmount(calculatedRefund);
    openConfirmationDialog();
  };

  const handleProceedWithSelected = () => {
    if (selectedDatesToCancel.length > 0) {
      const calculatedRefund = calculateRefundAmount();
      setRefundAmount(calculatedRefund);
      openConfirmationDialog();
    }
  };

  const openConfirmationDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleRefundAmountChange = (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0) {
      setRefundAmount(value);
    }
  };

  const handleFinalCancel = async () => {
    try {
      let response;
      
      if (cancelMode === 'full') {
        // Handle full booking cancellation
        const data = {
          buyCourseId: course._id,
          refundAmount,
        };
        response = await transactionService.cancelFullCourseAndRefund(data);
      } else {
        // Handle cancellation of selected dates
        const data = {
          buyCourseId: course._id,
          refundAmount,
          selectedDatesToCancel: selectedDatesToCancel,
        };
        response = await transactionService.cancelCourseDateAndRefund(data);
      }
      console.log(response)
      console.log("variant", response.variant)
      if (response && response.variant === "success") {
        // Replace router.refresh() with window.location.reload()
        window.location.reload();
        setErrorMessage("Cancellation and refund processed successfully");
        setShowError(false);
        
        // // Close dialogs and reset state
        setOpenConfirmDialog(false);
        setOpenCancelDialog(false);
        setShowDateSelection(false);
        setSelectedDatesToCancel([]);
        setRefundAmount(0);
        return;
      } else if (response && response.variant === "error") {
        // Display error message
        setErrorMessage(response.message || "Cancellation failed");
        setShowError(true);
        console.error("Cancellation failed", response);
        
        // Don't close dialogs on error so user can try again
        return;
      } else {
        // Handle undefined or unexpected response
        setErrorMessage("Unexpected response from server");
        setShowError(true);
        console.error("Cancellation failed", response);
        return;
      }
    } catch (error) {
      setErrorMessage(error.message || "Error during cancellation");
      setShowError(true);
      console.error("Error during cancellation:", error);
      return;
    }
  };

  const handleCloseErrorSnackbar = () => {
    setShowError(false);
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
        <PersonIcon sx={{ fontSize: 16, mr: 1, color: 'info.main' }} />
        <Typography variant="body2" color="text.secondary">
          {course.childId?.childName || 'Child Name'}
        </Typography>
      </Box>
      
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
          {course.canceledDates?.length > 0 && ` (for ${course.selectedDates?.length + course.canceledDates?.length} classes)`}
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
      
{profileType === "admin" && <Button 
        variant="outlined" 
        color="primary" 
        fullWidth 
        sx={{ mt: 2 }}
        endIcon={<ArrowForwardIosIcon />}
        onClick={handleOpenCancelDialog}
      >
        Cancel Booking
      </Button>}
    </CardContent>

    {/* Initial Cancellation Dialog */}
    <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog} maxWidth="sm" fullWidth>
      <DialogTitle>
        Cancel Booking
        <IconButton
          aria-label="close"
          onClick={handleCloseCancelDialog}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {!showDateSelection ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h6" gutterBottom>How would you like to cancel?</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                onClick={handleShowDateSelection}
              >
                Cancel Selected Dates
              </Button>
              <Button 
                variant="contained" 
                color="error"
                size="large"
                onClick={handleSelectFullCancel}
              >
                Cancel Full Booking
              </Button>
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="subtitle1" gutterBottom>
              Select dates to cancel:
            </Typography>
            <List sx={{ pt: 0 }}>
              {course.selectedDates?.map((date, idx) => (
                <ListItem key={idx} button onClick={() => handleToggleDate(date)}>
                  <Checkbox
                    edge="start"
                    checked={selectedDatesToCancel.includes(date)}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText 
                    primary={formatDate(date)}
                    secondary={`${formatTime(course.courseId?.startTime)} - ${formatTime(course.courseId?.endTime)}`}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary" 
                disabled={selectedDatesToCancel.length === 0}
                onClick={handleProceedWithSelected}
              >
                Proceed
              </Button>
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>

    {/* Confirmation Dialog */}
    <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <WarningAmberIcon color="warning" />
        Confirm Cancellation
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" gutterBottom color="error">
          This action cannot be reversed. Are you sure you want to proceed?
        </Typography>
        
        <Box sx={{ mt: 3, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            You are about to cancel:
          </Typography>
          
          {cancelMode === 'full' ? (
            <Typography variant="body1" fontWeight="bold">
              All dates for "{course.courseId?.courseTitle}"
            </Typography>
          ) : (
            <Box sx={{ mt: 1 }}>
              {selectedDatesToCancel.map((date, idx) => (
                <Typography key={idx} variant="body2">
                  • {formatDate(date)}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Refund Amount:
          </Typography>
          <TextField
            fullWidth
            type="number"
            variant="outlined"
            value={refundAmount.toFixed(2)}
            onChange={handleRefundAmountChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">£</InputAdornment>,
            }}
            helperText="You can adjust the refund amount if needed"
            sx={{ mt: 1 }}
          />
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {cancelMode === 'full' 
              ? `Suggested full refund: £${course.amount?.toFixed(2)}`
              : `Suggested partial refund: £${((course.amount / course.selectedDates.length) * selectedDatesToCancel.length).toFixed(2)}`
            }
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseConfirmDialog}>
          Go Back
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleFinalCancel}
        >
          Yes, Cancel and Refund
        </Button>
      </DialogActions>
    </Dialog>

    {/* Error Snackbar */}
    <Snackbar 
      open={showError} 
      autoHideDuration={6000} 
      onClose={handleCloseErrorSnackbar}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleCloseErrorSnackbar} severity="error" sx={{ width: '100%' }}>
        {errorMessage}
      </Alert>
    </Snackbar>
  </StyledCard>
</Grid>
  );
}

export default OnePurchasedCourse;