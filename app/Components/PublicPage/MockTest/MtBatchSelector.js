import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import MockPayButton from "./MockPayButton";
import { mockTestService } from "@/app/services";
import Cookies from "js-cookie";
import MainContext from "../../Context/MainContext";

const MtBatchSelector = ({ 
  isMobile,
  data, 
  setStep,
  setSubmitted, 
  setSubmittedId, 
  selectedChild, 
  setTotalAmount, 
  totalAmount, 
  selectedBatch, 
  setSelectedBatch 
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [loading, setLoading] = useState(true);

  const [alreadyBoughtBatch, setAlreadyBoughtBatch] = useState([]);
  const [userWaitingList, setUserWaitingList] = useState([]);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictBatch, setConflictBatch] = useState(null);
  const { state } = useContext(MainContext);
  const currentUser = Cookies.get("currentUser");

  // Add confirmation dialog states
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: '', // 'join' or 'leave'
    batch: null,
    loading: false
  });

  function countDecimalPlaces(num) {
    const numStr = num.toString();
    return numStr.includes('.') ? numStr.split('.')[1].length : 0;
  }

  useEffect(() => {
    if (!selectedBatch) {
      setSelectedBatch([]);
    }
    
    let newTotalAmount = (selectedBatch || []).reduce((sum, batch) => {
      return sum + Number(batch.oneBatchprice);
    }, 0);
    
    if (countDecimalPlaces(newTotalAmount) > 2) {
      newTotalAmount = parseFloat(newTotalAmount.toFixed(2));
    }
    setTotalAmount(newTotalAmount);
  }, [selectedBatch]);

  // Handle join waiting list click - show confirmation dialog
  const handleJoinWaitingListClick = (batch, event) => {
    event.stopPropagation();
    setConfirmDialog({
      open: true,
      type: 'join',
      batch: batch,
      loading: false
    });
  };

  // Handle leave waiting list click - show confirmation dialog  
  const handleLeaveWaitingListClick = (batch, event) => {
    event.stopPropagation();
    setConfirmDialog({
      open: true,
      type: 'leave', 
      batch: batch,
      loading: false
    });
  };

  // Handle confirmed joining waiting list
  const handleConfirmedJoinWaitingList = async () => {
    const batch = confirmDialog.batch;
    setConfirmDialog(prev => ({ ...prev, loading: true }));
    
    try {
      const res = await mockTestService.joinWaitingList({
        mockId: data._id,
        batchId: batch._id,
        childId: selectedChild._id
      });

      if (res.variant === "success") {
        // Update waiting list state
        setUserWaitingList(prev => [...prev, { batchId: batch._id, childId: selectedChild._id }]);
        setConfirmDialog({ open: false, type: '', batch: null, loading: false });
      } else {
        alert(res.message || "Failed to join waiting list");
        setConfirmDialog(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Error joining waiting list:", error);
      alert("Failed to join waiting list. Please try again.");
      setConfirmDialog(prev => ({ ...prev, loading: false }));
    }
  };

  // Handle confirmed leaving waiting list
  const handleConfirmedLeaveWaitingList = async () => {
    const batch = confirmDialog.batch;
    setConfirmDialog(prev => ({ ...prev, loading: true }));
    
    try {
      const res = await mockTestService.leaveWaitingList({
        mockId: data._id,
        batchId: batch._id,
        childId: selectedChild._id
      });

      if (res.variant === "success") {
        // Update waiting list state
        setUserWaitingList(prev => prev.filter(w => w.batchId !== batch._id));
        setConfirmDialog({ open: false, type: '', batch: null, loading: false });
      } else {
        alert(res.message || "Failed to leave waiting list");
        setConfirmDialog(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error("Error leaving waiting list:", error);
      alert("Failed to leave waiting list. Please try again.");
      setConfirmDialog(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCheckboxChange = (batch) => {
    const existingDateBatch = (selectedBatch || []).find(
      b => new Date(b.date).toDateString() === new Date(batch.date).toDateString()
    );

    const alreadyBookedDateBatch = alreadyBoughtBatch.find(
      b => new Date(b.date).toDateString() === new Date(batch.date).toDateString()
    );

    const isSelected = (selectedBatch || []).some(b => b._id === batch._id);
    let allowBuyOnBookingFull = false;

    if ( batch.byPassBookingFull == true &&  batch.selectedUsers.includes(state.id)) {
      allowBuyOnBookingFull = true;
    }
    if (isSelected) {
      setSelectedBatch((selectedBatch || []).filter(b => b._id !== batch._id));
    } else if ((!batch.filled || allowBuyOnBookingFull) && new Date(batch.date) >= today) {
      if (existingDateBatch || alreadyBookedDateBatch) {
        setConflictBatch(batch);
        setConflictDialogOpen(true);
        return;
      }
      setSelectedBatch([...(selectedBatch || []), batch]);
    }
  };

  const isBatchSelectable = (batch) => {
    const batchDate = new Date(batch.date);
    batchDate.setHours(0, 0, 0, 0);

    const alreadyBookedDateBatch = alreadyBoughtBatch.find(
      b => new Date(b.date).toDateString() === new Date(batch.date).toDateString()
    );

    if(alreadyBookedDateBatch){
      return false;
    }
    // check if batchDate is today or after today
    const isAfterToday = batchDate >= today;

    let allowBuyOnBookingFull = false;
    if ( batch.byPassBookingFull == true &&  batch.selectedUsers.includes(state.id)) {
      allowBuyOnBookingFull = true;
    }



    let allowBuy = allowBuyOnBookingFull && isAfterToday;
    return allowBuy || (!batch.filled && 
           new Date(batch.date) >= today );
  };
  const isShowWaitingList = (batch) => {
    const batchDate = new Date(batch.date);
    batchDate.setHours(0, 0, 0, 0);

    let alreadyBookedDateBatch = false;
    alreadyBookedDateBatch = alreadyBoughtBatch.find(
      b => new Date(b.date).toDateString() === new Date(batch.date).toDateString()
    ) ;

    if(alreadyBookedDateBatch == true){
      return false;
    }
    // check if batchDate is today or after today
    const isAfterToday = batchDate >= today;

    let allowBuyOnBookingFull = false;
    if ( batch.byPassBookingFull == true &&  batch.selectedUsers.includes(state.id)) {
      allowBuyOnBookingFull = true;
    }
    const  allowWaitingList = batch.allowWaitingList;

    if(!allowBuyOnBookingFull && allowWaitingList && isAfterToday ){
      return true;
    }
    return false;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  async function getBoughtBatch() {
    setLoading(true);
    try {
      let res = await mockTestService.alreadyBoughtMock({
        childId: selectedChild._id, 
        id: `${data._id}`
      });
    
      if (res.variant === "success") {
        setAlreadyBoughtBatch(res.data);
        setUserWaitingList(res.waitingData);
        if (!selectedBatch) {
          setSelectedBatch([]);
        }
      } else {
        alert(res);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }   
    setLoading(false);
  }

  useEffect(() => {
    getBoughtBatch();
  }, [selectedChild]);

  return (
    <Box sx={{ position: 'relative', pb: '80px', padding: isMobile ? "20px" : "0px" }}>
      <Dialog
        open={conflictDialogOpen}
        onClose={() => setConflictDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: '#F5F5F5',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            backgroundColor: '#FEF3C7', 
            color: '#78350F', 
            fontWeight: 600,
            padding: 2 
          }}
        >
          Date Conflict
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <DialogContentText sx={{ color: '#4B5563' }}>
            You have already selected or booked a mock test on {conflictBatch && formatDate(conflictBatch.date)}.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button 
            onClick={() => setConflictDialogOpen(false)} 
            variant="contained"
            sx={{ 
              backgroundColor: '#F97316', 
              color: 'white',
              '&:hover': { 
                backgroundColor: '#EA580C' 
              },
              textTransform: 'none',
              borderRadius: 2
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex',  alignItems: 'center', mb: 3, gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setStep(2)}
            sx={{ 
              width: isMobile?"30%":'20%',
              minWidth: 'auto',
              color: 'white', 
              backgroundColor: '#fc7658', 
              '&:hover': { backgroundColor: 'darkred' }
            }}
          >
            Back
          </Button>
          <Typography variant="h7" sx={{ width: isMobile?"70%":'80%', fontWeight: 400 }}>
       Book {data.testType?.label} Mock Test for <span style={{ fontWeight: 'bold' }}>{selectedChild.childName}</span>
          </Typography>
        </Box>

      <Grid container spacing={2}>
        {data.batch.map((batch) => {
          const isSelected = (selectedBatch || []).some(b => b._id === batch._id);
          const isSelectable = isBatchSelectable(batch);
          const isAlreadyBought = alreadyBoughtBatch?.some(b => b._id === batch._id);
          const showWaitingList = isShowWaitingList(batch);
          const alreadyInWaitingList = userWaitingList?.some(w => w.batchId === batch._id);

          let isJoinWaitingList = true;
          let isLeaveWaitingList = false;
          if(showWaitingList){
            if(alreadyInWaitingList){
              isJoinWaitingList = false;
              isLeaveWaitingList = true;
            }
          }


          return (
            <Grid item xs={12} key={batch._id}>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                alignItems: 'stretch',
                flexDirection: { xs: 'column', md: 'row' }
              }}>
                                <Paper
                  elevation={isSelected ? 3 : 1}
                  sx={{
                    p: 1,
                    flex: 1,
                    backgroundColor: isSelected ? '#F0F9FF' : '#ffffff',
                    border: '1px solid',
                    borderColor: isSelected ? '#BAE6FD' : isSelectable ? '#059669' : '#DC2626',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    cursor: isSelectable ? 'pointer' : 'default',
                    opacity: isSelectable ? 1 : 0.7,
                    '&:hover': isSelectable ? {
                      borderColor: '#7DD3FC',
                      backgroundColor: '#F0F9FF',
                      transform: 'translateY(-2px)',
                    } : {},
                  }}
                  onClick={() => isSelectable && handleCheckboxChange(batch)}
              >
                <Grid container spacing={2}>
                  <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton 
                      disabled={!isSelectable}
                      size="large"
                      sx={{ color: isSelected ? '#0EA5E9' : '#94A3B8' }}
                    >
                      {isSelected ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    </IconButton>
                  </Grid>

                  <Grid item xs={11}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EventIcon sx={{ color: '#64748B' }} />
                            <Typography 
                              variant="subtitle1" 
                              sx={{ 
                                color: '#1E293B',
                                fontWeight: 600
                              }}
                            >
                              {formatDate(batch.date)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography 
                              sx={{ 
                                color: '#1E293B',
                                fontWeight: 600,
                                fontSize: '0.975rem'
                              }}
                            >
                              £ {batch.oneBatchprice}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon sx={{ color: '#64748B' }} />
                            <Typography 
                              sx={{ 
                                color: '#1E293B',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                              }}
                            >
                              {batch.startTime} - {batch.endTime}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>  
              
                             
           
                             <Typography 
                              sx={{ 
                                color: isSelectable ? '#059669' : isAlreadyBought ? '#F97316' : '#DC2626',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                mt: 1,
                                backgroundColor: isSelectable ? '#F0FDF4' : isAlreadyBought ? '#FFF7ED' : '#FEF2F2',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: 1,
                                display: 'inline-block'
                              }}
                            >
                              {isSelectable ? "✓ Available" : isAlreadyBought ? `🎫 Already Booked for ${selectedChild.childName}` : '❌ Booking Full'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
              
              {/* Waiting List Button - Outside the batch box */}
              {!isSelectable && showWaitingList && (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: { xs: '100%', md: '180px' },
                  maxWidth: { xs: '100%', md: '180px' }
                }}>
                  {isJoinWaitingList && (
                    <Button
                      fullWidth
                      size="medium"
                      variant="contained"
                      startIcon={<HourglassEmptyIcon />}
                      onClick={(e) => handleJoinWaitingListClick(batch, e)}
                      sx={{
                        backgroundColor: '#059669',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#047857',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 10px rgba(5, 150, 105, 0.3)'
                        }
                      }}
                    >
                      Join Waiting List
                    </Button>
                  )}
                  
                  {isLeaveWaitingList && (
                    <Button
                      fullWidth
                      size="medium"
                      variant="contained"
                      startIcon={<HourglassDisabledIcon />}
                      onClick={(e) => handleLeaveWaitingListClick(batch, e)}
                      sx={{
                        backgroundColor: '#DC2626',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: '0 4px 6px rgba(220, 38, 38, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: '#B91C1C',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 10px rgba(220, 38, 38, 0.3)'
                        }
                      }}
                    >
                      Leave Waiting List
                    </Button>
                  )}
                </Box>
              )}
            </Box>
            </Grid>
          );
        })}
      </Grid>

      <Box 
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderTop: '1px solid #E5E7EB',
          padding: 2,
          zIndex: 1000,
        }}
      >
        <MockPayButton
          data={data}
          setSubmitted={setSubmitted}
          setSubmittedId={setSubmittedId}
          setTotalAmount={setTotalAmount}
          totalAmount={totalAmount}
          selectedBatch={selectedBatch || []}
          selectedChild={selectedChild}
        />
      </Box>

      {/* Confirmation Dialog for Waiting List */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => !confirmDialog.loading && setConfirmDialog({ open: false, type: '', batch: null, loading: false })}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 600, 
          fontSize: '1.25rem',
          borderBottom: '1px solid #E5E7EB',
          pb: 2
        }}>
          {confirmDialog.type === 'join' ? '🎯 Join Waiting List' : '🚪 Leave Waiting List'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <DialogContentText sx={{ fontSize: '1rem', color: '#374151' }}>
            {confirmDialog.type === 'join' ? (
              <>
                Are you sure you want to join the waiting list for <strong>{selectedChild.childName}</strong>?
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#F3F4F6', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    📅 Date: <strong>{confirmDialog.batch && new Date(confirmDialog.batch.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
                    ⏰ Time: <strong>{confirmDialog.batch && confirmDialog.batch.startTime} - {confirmDialog.batch && confirmDialog.batch.endTime}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#059669', mt: 2 }}>
                    ✨ You'll be notified when a spot becomes available!
                  </Typography>
                </Box>
              </>
            ) : (
              <>
                Are you sure you want to leave the waiting list for <strong>{selectedChild.childName}</strong>?
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#FEF2F2', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: '#6B7280' }}>
                    📅 Date: <strong>{confirmDialog.batch && new Date(confirmDialog.batch.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B7280', mt: 1 }}>
                    ⏰ Time: <strong>{confirmDialog.batch && confirmDialog.batch.startTime} - {confirmDialog.batch && confirmDialog.batch.endTime}</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#DC2626', mt: 2 }}>
                    ⚠️ You'll lose your position in the waiting list!
                  </Typography>
                </Box>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E5E7EB' }}>
          <Button 
            onClick={() => setConfirmDialog({ open: false, type: '', batch: null, loading: false })}
            disabled={confirmDialog.loading}
            sx={{ 
              color: '#6B7280',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#F3F4F6'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={confirmDialog.type === 'join' ? handleConfirmedJoinWaitingList : handleConfirmedLeaveWaitingList}
            variant="contained"
            disabled={confirmDialog.loading}
            startIcon={confirmDialog.loading && <CircularProgress size={20} color="inherit" />}
            sx={{ 
              backgroundColor: confirmDialog.type === 'join' ? '#059669' : '#DC2626',
              color: 'white',
              textTransform: 'none',
              minWidth: 120,
              '&:hover': {
                backgroundColor: confirmDialog.type === 'join' ? '#047857' : '#B91C1C'
              },
              '&:disabled': {
                backgroundColor: '#9CA3AF'
              }
            }}
          >
            {confirmDialog.loading ? 'Processing...' : confirmDialog.type === 'join' ? 'Join List' : 'Leave List'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MtBatchSelector;