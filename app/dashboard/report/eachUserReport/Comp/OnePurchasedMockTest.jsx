import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box, Divider, Button, Chip, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, 
  Checkbox, IconButton, TextField, InputAdornment, Alert, Snackbar } from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { styled } from '@mui/material/styles';
import { transactionService } from '@/app/services';

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

const OnePurchasedMockTest = ({test,  profileType}) => {
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [selectedBatchesToCancel, setSelectedBatchesToCancel] = useState([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [cancelMode, setCancelMode] = useState(''); // 'full' or 'selected'
    const [showBatchSelection, setShowBatchSelection] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [refundAmount, setRefundAmount] = useState(0);
    
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
      let cancelBatchLength = test.canceledBatch?.length || 0;
      
      const perBatchAmount = (test.amount || 0) / (test.selectedBatch?.length + cancelBatchLength || 1 );
  
      if (cancelMode === 'full') {
        // Full refund for all batches
        return test.amount || 0;
      } else if (selectedBatchesToCancel?.length > 0) {
        // Calculate refund amount based on selected batches
       
        return perBatchAmount * selectedBatchesToCancel.length;
      }
      return 0;
    };

    const handleOpenCancelDialog = () => {
      setOpenCancelDialog(true);
      setShowBatchSelection(false);
      setCancelMode('');
      setSelectedBatchesToCancel([]);
      setRefundAmount(0);
    };

    const handleCloseCancelDialog = () => {
      setOpenCancelDialog(false);
      setShowBatchSelection(false);
      setCancelMode('');
      setSelectedBatchesToCancel([]);
    };

    const handleToggleBatch = (batch) => {
      setSelectedBatchesToCancel(prev => {
        if (prev.some(b => b._id === batch._id)) {
          return prev.filter(b => b._id !== batch._id);
        } else {
          return [...prev, batch];
        }
      });
    };

    const handleShowBatchSelection = () => {
      setShowBatchSelection(true);
      setCancelMode('selected');
    };

    const handleSelectFullCancel = () => {
      setCancelMode('full');
      const calculatedRefund = test.amount || 0;
      setRefundAmount(calculatedRefund);
      openConfirmationDialog();
    };

    const handleProceedWithSelected = () => {
      if (selectedBatchesToCancel.length > 0) {
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

    const handleCloseErrorSnackbar = () => {
      setShowError(false);
    };

    const handleFinalCancel = async () => {
      try {
        let response;
        
        if (cancelMode === 'full') {
          // Handle full booking cancellation
          const data = {
            buyMockTestId: test._id,
            refundAmount,
          };
          response = await transactionService.cancelFullMockTestAndRefund(data);
        } else {
          // Handle cancellation of selected dates
          const batchIdsToCancel = selectedBatchesToCancel.map(batch => batch._id.toString());
          const data = {
            buyMockTestId: test._id,
            refundAmount,
            selectedBatchesToCancel: batchIdsToCancel,
          };
          response = await transactionService.cancelMockTestDateAndRefund(data);
        }
        console.log(response)
        console.log("variant", response.variant)
        if (response && response.variant === "success") {
          // Replace router.refresh() with window.location.reload()
          window.location.reload();
          setErrorMessage("Cancellation and refund processed successfully");
          setShowError(false);
          
          // Close dialogs and reset state
          setOpenConfirmDialog(false);
          setOpenCancelDialog(false);
          setSelectedBatchesToCancel([]);
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
            {test.selectedBatch?.length || 0} batches purchased
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <ChildCareIcon sx={{ fontSize: 16, mr: 1, color: 'primary.main' }} />
          <Typography variant="body2" fontWeight="bold">
            For: {test.childId?.childName || 'Child'}
          </Typography>
        </Box>
        
        <Typography variant="subtitle2" gutterBottom>
          Selected Batches:
        </Typography>
        
        <Box sx={{ maxHeight: 200, overflow: 'auto', pr: 1 }}>
          {test.selectedBatch?.map((batch, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                mb: 2,
                p: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '8px',
                bgcolor: 'background.default'
              }}
            >
              <DateTimeItem>
                <CalendarMonthIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                <Typography variant="body2" fontWeight="bold">
                  {formatDate(batch.date)}
                </Typography>
              </DateTimeItem>
              <DateTimeItem>
                <AccessTimeIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
                <Typography variant="body2">
                  {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                </Typography>
              </DateTimeItem>
              
              <Chip 
                size="small"
                label={`Batch #${idx + 1}`}
                color="secondary"
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>
          ))}
        </Box>
        
 {profileType === "admin" && <Button 
          variant="outlined" 
          color="secondary" 
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
          Cancel Mock Test Booking
          <IconButton
            aria-label="close"
            onClick={handleCloseCancelDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {!showBatchSelection ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" gutterBottom>How would you like to cancel?</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  onClick={handleShowBatchSelection}
                >
                  Cancel Selected Batches
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
                Select batches to cancel:
              </Typography>
              <List sx={{ pt: 0 }}>
                {test.selectedBatch?.map((batch, idx) => (
                  <ListItem key={idx} button onClick={() => handleToggleBatch(batch)}>
                    <Checkbox
                      edge="start"
                      checked={selectedBatchesToCancel.some(b => b._id === batch._id)}
                      tabIndex={-1}
                      disableRipple
                    />
                    <ListItemText 
                      primary={`Batch #${idx + 1}`}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" display="block">
                            {formatDate(batch.date)}
                          </Typography>
                          <Typography component="span" variant="body2" color="text.secondary">
                            {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  disabled={selectedBatchesToCancel.length === 0}
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
          {showError && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
              <Typography color="error.dark" variant="body2">
                {errorMessage}
              </Typography>
            </Box>
          )}
          
          <Typography variant="body1" gutterBottom color="error">
            This action cannot be reversed. Are you sure you want to proceed?
          </Typography>
          
          <Box sx={{ mt: 3, bgcolor: 'background.default', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              You are about to cancel:
            </Typography>
            
            {cancelMode === 'full' ? (
              <Typography variant="body1" fontWeight="bold">
                All batches for "{test.mockTestId?.mockTestTitle}"
              </Typography>
            ) : (
              <Box sx={{ mt: 1 }}>
                {selectedBatchesToCancel.map((batch, idx) => (
                  <Typography key={idx} variant="body2">
                    • Batch #{test.selectedBatch.findIndex(b => b._id === batch._id) + 1} - {formatDate(batch.date)}
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
                ? `Suggested full refund: £${(test.amount || 0).toFixed(2)}`
                : `Suggested partial refund: £${(((test.amount || 0) / (test.selectedBatch?.length || 1)) * selectedBatchesToCancel.length).toFixed(2)}`
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

export default OnePurchasedMockTest;