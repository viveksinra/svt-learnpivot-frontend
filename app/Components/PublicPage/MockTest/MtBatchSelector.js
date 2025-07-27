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
  const [waitingListLoading, setWaitingListLoading] = useState({});
  const [alreadyBoughtBatch, setAlreadyBoughtBatch] = useState([]);
  const [userWaitingList, setUserWaitingList] = useState([]);
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false);
  const [conflictBatch, setConflictBatch] = useState(null);
  const { state } = useContext(MainContext);
  const currentUser = Cookies.get("currentUser");

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

  // Handle joining waiting list
  const handleJoinWaitingList = async (batch, event) => {
    event.stopPropagation(); // Prevent batch selection
    
    setWaitingListLoading(prev => ({ ...prev, [batch._id]: true }));
    
    try {
      const res = await mockTestService.joinWaitingList({
        mockId: data._id,
        batchId: batch._id,
        childId: selectedChild._id
      });

      if (res.variant === "success") {
        // Update waiting list state
        setUserWaitingList(prev => [...prev, { batchId: batch._id, childId: selectedChild._id }]);
      } else {
        alert(res.message || "Failed to join waiting list");
      }
    } catch (error) {
      console.error("Error joining waiting list:", error);
      alert("Failed to join waiting list. Please try again.");
    } finally {
      setWaitingListLoading(prev => ({ ...prev, [batch._id]: false }));
    }
  };

  // Handle leaving waiting list
  const handleLeaveWaitingList = async (batch, event) => {
    event.stopPropagation(); // Prevent batch selection
    
    setWaitingListLoading(prev => ({ ...prev, [batch._id]: true }));
    
    try {
      const res = await mockTestService.leaveWaitingList({
        mockId: data._id,
        batchId: batch._id,
        childId: selectedChild._id
      });

      if (res.variant === "success") {
        // Update waiting list state
        setUserWaitingList(prev => prev.filter(w => w.batchId !== batch._id));
      } else {
        alert(res.message || "Failed to leave waiting list");
      }
    } catch (error) {
      console.error("Error leaving waiting list:", error);
      alert("Failed to leave waiting list. Please try again.");
    } finally {
      setWaitingListLoading(prev => ({ ...prev, [batch._id]: false }));
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
              <Paper
                elevation={isSelected ? 3 : 1}
                sx={{
                  p: 1,
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
                                color: isSelectable ? '#059669' : '#DC2626',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                mt: showWaitingList ? 0 : 1
                              }}
                            >
                              {isSelectable ? "Available" : isAlreadyBought ? `Already Booked for ${selectedChild.childName}` : 'Booking Full'}
                            </Typography>
                            {showWaitingList && (
                              <>
                                {isJoinWaitingList && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={waitingListLoading[batch._id] ? 
                                      <CircularProgress size={16} /> : 
                                      <HourglassEmptyIcon />
                                    }
                                    onClick={(e) => handleJoinWaitingList(batch, e)}
                                    disabled={waitingListLoading[batch._id]}
                                    sx={{
                                      color: '#059669',
                                      borderColor: '#059669',
                                      fontSize: '0.7rem',
                                      textTransform: 'none',
                                      minWidth: 'auto',
                                      px: 1,
                                      py: 0.5,
                                      '&:hover': {
                                        backgroundColor: '#F0FDF4',
                                        borderColor: '#047857'
                                      }
                                    }}
                                  >
                                    Join Waiting List
                                  </Button>
                                )}
                                
                                {isLeaveWaitingList && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={waitingListLoading[batch._id] ? 
                                      <CircularProgress size={16} /> : 
                                      <HourglassDisabledIcon />
                                    }
                                    onClick={(e) => handleLeaveWaitingList(batch, e)}
                                    disabled={waitingListLoading[batch._id]}
                                    sx={{
                                      color: '#DC2626',
                                      borderColor: '#DC2626',
                                      fontSize: '0.7rem',
                                      textTransform: 'none',
                                      minWidth: 'auto',
                                      px: 1,
                                      py: 0.5,
                                      '&:hover': {
                                        backgroundColor: '#FEF2F2',
                                        borderColor: '#B91C1C'
                                      }
                                    }}
                                  >
                                    Leave Waiting List
                                  </Button>
                                )}
                              </>
                                                         )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>
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
    </Box>
  );
};

export default MtBatchSelector;