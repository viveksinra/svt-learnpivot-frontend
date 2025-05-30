import React, { useState, useEffect, useContext } from "react";
import {
  Grid,
  Typography,
  Checkbox,
  Paper,
  Box,
  Button,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Modal,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import CoursePayButton from "./CoursePayButton";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";
import DateLegend from "./DateLegend";
import StartDateShowCase from "./StartDateShowCase";
import { myCourseService } from "@/app/services";
import CourseBookingFullMessage from "../BuyForm/CourseBookingFullMessage";
import MainContext from "../../Context/MainContext";

const CourseDateSelector = ({
  isMobile,
  data,
  setStep,
  setSubmitted,
  setSubmittedId,
  selectedChild,
  setTotalAmount,
  totalAmount,
  selectedDates = [],
  setSelectedDates,
  selectedBatches,
  setSelectedBatches,
  startDate,
  setStartDate,
  availableDates,
  setAvailableDates,
  frontEndTotal,
  setFrontEndTotal,
  preserveSelections,
  setPreserveSelections,

  alreadyBoughtDate,
  setAlreadyBoughtDate,
  hideStartDateSelector,
  setHideStartDateSelector,
  lastPurchasedSetIndex,
  setLastPurchasedSetIndex,
  bookingRuleModalOpen,
  setBookingRuleModalOpen,
  bookingRule,
  setBookingRule

}) => {
  const { state } = useContext(MainContext);

  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [isAvailableForChild, setIsAvailableForChild] = useState(preserveSelections);
  


  const today = new Date();
  const effectiveDate = bookingRule?.allowBackDateBuy && bookingRule?.backDayCount
    ? new Date(today.getTime() - (bookingRule.backDayCount * 24 * 60 * 60 * 1000))
    : today;
  
  const singleBatchWithOneDate = data?.allBatch?.length === 1 && 
    data.allBatch[0].oneBatch?.length === 1 && 
    !data.allBatch[0].hide && 
    !data.allBatch[0].bookingFull;

  useEffect(() => {
    if (singleBatchWithOneDate) {
      const batch = data.allBatch[0];
      const date = batch.oneBatch[0];
      setSelectedBatches([batch._id]);
      setSelectedDates([date]);
      setStartDate(date);
      setAvailableDates([date]);
    }
  }, [data?.allBatch]);

  useEffect(() => {
    const selectedDatesCount = selectedDates?.length || 0;
    let total = 0;
    let oneDatePrice = data?.oneClassPrice;
    if (oneDatePrice) {
      total = selectedDatesCount * oneDatePrice;
      total = total.toFixed(2);
    }
    if (total > 0) {
      setFrontEndTotal(total);
    } else {
      setFrontEndTotal(null);
    }
  }, [selectedDates, data?.oneClassPrice, setFrontEndTotal]);

  useEffect(() => {
    if (bookingRule.forcefullBuyCourse && data?.allBatch) {
      const availableBatchIds = data.allBatch
        .filter(b => !b.hide && !b.bookingFull)
        .map(b => b._id);
      setSelectedBatches(availableBatchIds);
    }
  }, [bookingRule.forcefullBuyCourse, data?.allBatch]);

  const findSetIndexForDate = (date) => {
    return data?.allBatch?.findIndex(batch => 
      batch.oneBatch.includes(date)
    );
  };

  const checkForAvailableSeatForChild = async() => {

    let res = await myCourseService.checkIfSeatAvailableForChild({id:data._id,childId:selectedChild._id});
    if (res?.isAvailable === false) {
      setIsAvailableForChild(false);
    } else {
      setIsAvailableForChild(true);
    }
  };
  useEffect(() => {


    if(preserveSelections) return;

    checkForAvailableSeatForChild();
  }, [selectedChild]);

  const isValidBatchSelection = (batchId, allBatches) => {
    // If stopSkipSet is false, allow any batch to be selected
    if (!bookingRule.stopSkipSet) {
      return true;
    }

    // Get the current batch index
    const validBatches = allBatches.filter(batch => !batch.hide && !batch.bookingFull);
    const batchIndex = validBatches.findIndex(batch => batch._id === batchId);
    const currentBatch = validBatches[batchIndex];
    const currentBatchIndex = data.allBatch.findIndex(b => b._id === currentBatch._id);
    
    // Check if the previous set has any purchased dates
    const previousSetIndex = currentBatchIndex - 1;
    
    const hasPurchasedDatesInPreviousSet = previousSetIndex >= 0 && 
      data.allBatch[previousSetIndex]?.oneBatch?.some(date => alreadyBoughtDate.includes(date));
    
    // If the previous set has purchased dates, allow this set to be selected regardless of other rules
    if (hasPurchasedDatesInPreviousSet) {
        return true;
    }
    
    // New stopSkipSet logic: 
    // Allow selection if it's adjacent to a selected set, even if the first available set is not selected
    if (bookingRule.stopSkipSet) {
        // Get the first available set
        const firstAvailableSetIndex = data.allBatch.findIndex(b => !b.hide && !b.bookingFull && hasAvailableDatesInBatch(b));

        if (firstAvailableSetIndex !== -1) {
            const firstAvailableBatchId = data.allBatch[firstAvailableSetIndex]._id;
            
            // Check if this selection is adjacent to a currently selected batch
            const isAdjacentToSelectedBatch = selectedBatches.some(selectedId => {
                const selectedIndex = data.allBatch.findIndex(b => b._id === selectedId);
                return Math.abs(selectedIndex - currentBatchIndex) === 1;
            });
            
            // Allow if:
            // 1. The first available set is selected, or
            // 2. This is the first available set, or
            // 3. This selection is adjacent to an already selected batch
            // 4. This selection is after a batch with purchased dates
            if (!selectedBatches.includes(firstAvailableBatchId) && 
                batchId !== firstAvailableBatchId && 
                !isAdjacentToSelectedBatch) {
                return false;
            }
        }
    }

    if (lastPurchasedSetIndex >= 0) {
        if (currentBatchIndex <= lastPurchasedSetIndex) {
            return true;
        } else if (currentBatchIndex === lastPurchasedSetIndex + 1) {
            return true;
        } else if (currentBatchIndex === lastPurchasedSetIndex + 2) {
            const hasMiddleSelected = selectedBatches.some(id => {
                const batch = validBatches.find(b => b._id === id);
                const index = data.allBatch.findIndex(b => b._id === batch?._id);
                return index === currentBatchIndex - 1;
            });
            return hasMiddleSelected;
        }
        return false;
    }

    if (selectedBatches?.length === 0) {
        return true;
    }

    const selectedIndices = selectedBatches.map(id =>
        validBatches.findIndex(batch => batch._id === id)
    );
    const minSelected = Math.min(...selectedIndices);
    const maxSelected = Math.max(...selectedIndices);

    const isAdjacent = batchIndex === minSelected - 1 || batchIndex === maxSelected + 1;
    return isAdjacent;
  };

  const handleBatchSelect = (batchId) => {
    if (bookingRule.forcefullBuyCourse) return;

    let updatedBatches;
    if (selectedBatches.includes(batchId)) {
      // When deselecting, only apply restrictions if stopSkipSet is true
      if (bookingRule.stopSkipSet) {
        // When deselecting, only allow if it's at the end of the sequence
        const validBatches = data.allBatch.filter(batch => !batch.hide && !batch.bookingFull);
        const selectedIndices = selectedBatches.map(id => 
          validBatches.findIndex(batch => batch._id === id)
        );
        const batchIndex = validBatches.findIndex(batch => batch._id === batchId);
        
        if (batchIndex === Math.max(...selectedIndices) || batchIndex === Math.min(...selectedIndices)) {
          updatedBatches = selectedBatches.filter((id) => id !== batchId);
        } else {
          return; // Cannot deselect from middle of sequence
        }
      } else {
        // If stopSkipSet is false, allow deselection of any batch
        updatedBatches = selectedBatches.filter((id) => id !== batchId);
      }
    } else {
      // When selecting, only apply restrictions if stopSkipSet is true
      if (bookingRule.stopSkipSet) {
        // When selecting, only allow if it's adjacent to current selection
        const isValid = isValidBatchSelection(batchId, data.allBatch);
        if (!isValid) {
          return;
        }
      }
      updatedBatches = [...selectedBatches, batchId].sort();
    }

    setSelectedBatches(updatedBatches);

    if (updatedBatches?.length === 0) {
      setSelectedDates([]);
      setAvailableDates([]);
      setStartDate("");
    }
  };

  useEffect(() => {
    if (selectedBatches?.length > 0 && data?.allBatch) {
      const firstSelectedBatchId = selectedBatches[0];
      const firstSelectedBatch = data.allBatch.find(b => b._id === firstSelectedBatchId);
  
      const availableFutureDates = firstSelectedBatch && !firstSelectedBatch.hide && !firstSelectedBatch.bookingFull
        ? firstSelectedBatch.oneBatch.filter(date => new Date(date) > effectiveDate)
        : [];
  
      const sortedAvailableDates = [...new Set(availableFutureDates)].sort((a, b) => new Date(a) - new Date(b));
  
      // Only update if changed
      if (JSON.stringify(availableDates) !== JSON.stringify(sortedAvailableDates)) {
        setAvailableDates(sortedAvailableDates);
      }
  
      const allSelectedDates = selectedBatches
        .map(batchId => data.allBatch.find(b => b._id === batchId))
        .filter(batch => batch && !batch.hide && !batch.bookingFull)
        .flatMap(batch => batch.oneBatch.filter(date =>
          new Date(date) > effectiveDate && !alreadyBoughtDate.includes(date)
        ));
  
      const sortedSelectedDates = [...new Set(allSelectedDates)].sort((a, b) => new Date(a) - new Date(b));
  
      if (JSON.stringify(selectedDates) !== JSON.stringify(sortedSelectedDates)) {
        setSelectedDates(sortedSelectedDates);
      }
  
      // Only update startDate if needed
      if (sortedAvailableDates?.length > 0) {
        if (!sortedAvailableDates.includes(startDate)) {
          setStartDate(sortedAvailableDates[0]);
          handleStartDateChange({ target: { value: sortedAvailableDates[0] } });
        }
      } else if (startDate !== "") {
        setStartDate("");
      }
    } else {
      if (availableDates?.length !== 0) setAvailableDates([]);
      if (selectedDates?.length !== 0) setSelectedDates([]);
      if (startDate !== "") setStartDate("");
    }
    // eslint-disable-next-line
  }, [selectedBatches, data, alreadyBoughtDate]);

  // useEffect(() => {
  //   // here check if any already bought date is in the selected dates if there remove it from selected dates
  //   if(selectedDates?.length > 0) {
  //   const newSelectedDates = selectedDates.filter(date => !alreadyBoughtDate.includes(date));
  //   setSelectedDates(newSelectedDates);
  //   }
  //   }, [selectedDates, alreadyBoughtDate])

  const handleStartDateChange = (event) => {
    const newDate = event.target.value;
    setStartDate(newDate);
    const selectedStartDate = new Date(newDate);
    
    const allSelectedDates = selectedBatches
      .map(batchId => data?.allBatch?.find(b => b._id === batchId))
      .filter(batch => batch && !batch.hide && !batch.bookingFull)
      .flatMap(batch => batch.oneBatch.filter(date => 
        new Date(date) >= selectedStartDate && !alreadyBoughtDate.includes(date)
      ));

    if (allSelectedDates?.length > 0) {
      setSelectedDates([...new Set(allSelectedDates)].sort((a, b) => new Date(a) - new Date(b)));
    } else {
      setSelectedDates([]);
    }
  };

  const isDateSelected = (date) => {
    return selectedDates?.includes(date) || false;
  };

  const isDateAlreadyPurchased = (date) => {
    return alreadyBoughtDate?.includes(date) || false;
  };

  async function getBoughtBatch() {
    setLoading(true);
    try {
      let res = await myCourseService.alreadyBoughtDate({
        childId: selectedChild._id, 
        id: `${data._id}`
      });
      await checkForAvailableSeatForChild();
      if (res.variant === "success") {
        setAlreadyBoughtDate(res.boughtDates);
        if(res.userCourseAccess){
          const userAccess = res?.userCourseAccess;
          setBookingRule({
            restrictStartDateChange: userAccess?.restrictStartDateChange,
            forcefullBuyCourse: userAccess?.forcefullBuyCourse,
            stopSkipSet: userAccess?.stopSkipSet,
            backDayCount: userAccess?.backDayCount,
            allowBackDateBuy: userAccess?.allowBackDateBuy,   
          });
          setHideStartDateSelector(res.enableSeperateUserAccessForCourse);
          setLastPurchasedSetIndex(res.filledSeat);
          if(preserveSelections ){
            handleStartDateChange({target: {value: startDate}});
          } else {
          setStartDate(res.date);
          handleStartDateChange({target: {value: res.date}});}
        } else {
          setBookingRule({
            restrictStartDateChange: data?.restrictStartDateChange,
            forcefullBuyCourse: data?.forcefullBuyCourse,
            stopSkipSet: data?.stopSkipSet,
            backDayCount: data?.backDayCount,
            allowBackDateBuy: data?.allowBackDateBuy,   
          });
        }
        if(res.boughtDates?.length > 0){
          setHideStartDateSelector(true);
          const maxDate = new Date(Math.max(...res.boughtDates.map(d => new Date(d))));
          const maxDateStr = maxDate.toISOString().split('T')[0];
          const setIndex = findSetIndexForDate(maxDateStr);
          setLastPurchasedSetIndex(setIndex);
        }
      } else {
        setAlreadyBoughtDate([]);
        setLastPurchasedSetIndex(-1);
        setBookingRule({
          restrictStartDateChange: data?.restrictStartDateChange,
          forcefullBuyCourse: data?.forcefullBuyCourse,
          stopSkipSet: data?.stopSkipSet,
          backDayCount: data?.backDayCount,
          allowBackDateBuy: data?.allowBackDateBuy,   
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Set default booking rules on error
      setBookingRule({
        restrictStartDateChange: data?.restrictStartDateChange,
        forcefullBuyCourse: data?.forcefullBuyCourse,
        stopSkipSet: data?.stopSkipSet,
        backDayCount: data?.backDayCount,
        allowBackDateBuy: data?.allowBackDateBuy,   
      });
    } finally {   
      setLoading(false);
      setDataReady(true);
    }
  }
  
  useEffect(() => {
    if (preserveSelections == "a") {
      setLoading(false);
      setDataReady(true);
      return;
    } else
    if (selectedChild && data) {
      setDataReady(false); // Reset data ready state
      getBoughtBatch();
    }
  }, [selectedChild, data, preserveSelections]);

  const hasAvailableDatesInBatch = (batch) => {
    return batch.oneBatch.some(date => {
      const isDateAvailable = new Date(date) > effectiveDate;
      const isNotPurchased = !alreadyBoughtDate.includes(date);
      return isDateAvailable && isNotPurchased;
    });
  };

  const isCheckboxDisabled = (batch, batchIndex) => {
    
    // First check if the batch has any available dates
    if (!hasAvailableDatesInBatch(batch)) {
      return true;
    }

    if (batch.bookingFull || bookingRule.forcefullBuyCourse) {
      return true;
    }

    const actualBatchIndex = data.allBatch.findIndex(b => b._id === batch._id);
    
    // For selected batches with stopSkipSet: prevent deselection if there are later selected batches
    if (bookingRule.stopSkipSet && selectedBatches.includes(batch._id)) {
      // Check if there are any selected batches with a higher index
      const hasLaterSelectedBatches = selectedBatches.some(id => {
        const otherBatchIndex = data.allBatch.findIndex(b => b._id === id);
        return otherBatchIndex > actualBatchIndex;
      });
      
      if (hasLaterSelectedBatches) {
        return true; // Disable checkbox if there are later selected batches
      }
    }
    
    // Find the index of the last batch that has a purchased date
    let lastPurchasedBatchIndex = -1;
    for (let i = 0; i < data.allBatch?.length; i++) {
      if (data.allBatch[i].oneBatch.some(date => alreadyBoughtDate.includes(date))) {
        lastPurchasedBatchIndex = i;
      }
    }
    
    // If this batch immediately follows a batch with purchased dates, enable it
    if (lastPurchasedBatchIndex !== -1 && actualBatchIndex === lastPurchasedBatchIndex + 1) {
      return false;
    }
    
    // Check if the previous set has any purchased dates
    const previousSetIndex = actualBatchIndex - 1;
    const hasPurchasedDatesInPreviousSet = previousSetIndex >= 0 && 
      data.allBatch[previousSetIndex]?.oneBatch?.some(date => alreadyBoughtDate.includes(date));
    
    // If the previous set has purchased dates, allow this set to be selected
    if (hasPurchasedDatesInPreviousSet) {
      return false;
    }

    // If stopSkipSet is false, allow any selection pattern
    if (!bookingRule.stopSkipSet) {
      return false;
    }

    const validBatches = data.allBatch.filter(b => !b.hide && !b.bookingFull);
    const currentBatchIndex = validBatches.findIndex(b => b._id === batch._id);
    const selectedIndices = selectedBatches.map(id => 
      validBatches.findIndex(batch => batch._id === id)
    );

    if (selectedIndices?.length === 0) {
      const result = !isValidBatchSelection(batch._id, data.allBatch);
      return result;
    }

    const maxSelectedIndex = Math.max(...selectedIndices);
    
    // If this batch is selected
    if (selectedBatches.includes(batch._id)) {
      // If there's a selected batch after this one, prevent unchecking
      const result = maxSelectedIndex > currentBatchIndex;
      return result;
    }

    // If not selected, use original validation logic
    const result = !isValidBatchSelection(batch._id, data.allBatch);
    return result;
  };

  const getTooltipTitle = (batch, batchIndex, isDisabled) => {
    if (!hasAvailableDatesInBatch(batch)) {
      return "No available dates in this set";
    }
    
    if (batch.bookingFull) {
      return "Fully Booked";
    }

    // If stopSkipSet is false and the batch is not fully booked, just return empty string
    if (!bookingRule.stopSkipSet && !batch.bookingFull) {
      return "";
    }

    // If this is a selected batch and stopSkipSet is true, check if there are later selected batches
    if (bookingRule.stopSkipSet && selectedBatches.includes(batch._id)) {
      const actualBatchIndex = data.allBatch.findIndex(b => b._id === batch._id);
      const hasLaterSelectedBatches = selectedBatches.some(id => {
        const otherBatchIndex = data.allBatch.findIndex(b => b._id === id);
        return otherBatchIndex > actualBatchIndex;
      });
      
      if (hasLaterSelectedBatches) {
        return "You must unselect later sets first";
      }
    }

    // Check if the previous set has any purchased dates
    const actualBatchIndex = data.allBatch.findIndex(b => b._id === batch._id);
    const previousSetIndex = actualBatchIndex - 1;
    const hasPurchasedDatesInPreviousSet = previousSetIndex >= 0 && 
      data.allBatch[previousSetIndex]?.oneBatch?.some(date => alreadyBoughtDate.includes(date));
    
    if (hasPurchasedDatesInPreviousSet) {
      return "Available for selection";
    }

    const validBatches = data.allBatch.filter(b => !b.hide && !b.bookingFull);
    const selectedIndices = selectedBatches.map(id =>
      validBatches.findIndex(batch => batch._id === id)
    );
    const maxSelectedIndex = Math.max(...selectedIndices);
    const currentBatchIndex = validBatches.findIndex(b => b._id === batch._id);
    
    if (bookingRule.stopSkipSet && selectedBatches.includes(batch._id) && maxSelectedIndex > currentBatchIndex) {
      return "Cannot uncheck when later sets are selected";
    }
    
    return isDisabled ? "Must purchase sets in order" : "";
  };

  const handleOpenBookingRuleModal = () => {
    setBookingRuleModalOpen(true);
  };

  const handleCloseBookingRuleModal = () => {
    setBookingRuleModalOpen(false);
  };



  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '90%' : '60%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
    maxHeight: '80vh',
    overflow: 'auto'
  };

  return (
    <Grid container spacing={2}>
      {loading && (
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading class information...
          </Typography>
        </Grid>
      )}

      {!loading && dataReady && (
        <>{
               !isAvailableForChild ? (
                <CourseBookingFullMessage userInfo={state} data={data}/> 
              ) :
       ( <>
  
          {/* Header */}
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => setStep(2)}
              sx={{ 
                width: isMobile ? "30%" : '20%',
                minWidth: 'auto',
                color: 'white', 
                marginRight: '10px',
                backgroundColor: '#fc7658', 
                '&:hover': { backgroundColor: 'darkred' }
              }}
            >
              Back
            </Button>
            <Typography variant="h7" sx={{ width: isMobile ? "70%" : '80%', fontWeight: 400 }}>
              Book {data.courseTitle} for <span style={{ fontWeight: 'bold' }}>{selectedChild.childName}</span>
            </Typography>
          </Grid>

          {/* Booking Rules Button and Modal */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<InfoIcon />}
                onClick={handleOpenBookingRuleModal}
                sx={{
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Booking Rules
              </Button>
            </Box>

            <Modal
              open={bookingRuleModalOpen}
              onClose={handleCloseBookingRuleModal}
              aria-labelledby="booking-rule-modal-title"
            >
              <Box sx={modalStyle}>
                <Typography id="booking-rule-modal-title" variant="h6" component="h2" gutterBottom>
                  Booking Rules
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  <ul>
                    {bookingRule.forcefullBuyCourse && (
                      <li>This is a single-class course that must be booked in its entirety.</li>
                    )}
                    {data.restrictOnTotalSeat && (
                      <li>Limited availability: Only {data.totalSeat} total seats available for this class.</li>
                    )}
                    {bookingRule.restrictStartDateChange && (
                      <li>The class date cannot be changed once selected.</li>
                    )}
                    <li>Classes in the past cannot be booked.</li>
                    {!singleBatchWithOneDate && (
                      <>
                        <li>Already purchased classes are marked in yellow.</li>
                        <li>Selected classes are marked in green.</li>
                        <li>Available but unselected classes are marked in red.</li>
                      </>
                    )}
                    {data.allBatch?.length === 1 && data.allBatch[0].oneBatch?.length === 1 && (
                      <li>This is a one-time class scheduled for {formatDateToShortMonth(data.allBatch[0].oneBatch[0])}.</li>
                    )}
                  </ul>
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button 
                    sx={{ 
                      width: isMobile ? "30%" : '20%',
                      minWidth: 'auto',
                      color: 'white', 
                      marginRight: '10px',
                      backgroundColor: '#fc7658', 
                      '&:hover': { backgroundColor: 'darkred' }
                    }}
                    onClick={handleCloseBookingRuleModal} variant="contained">
                    Close
                  </Button>
                </Box>
              </Box>
            </Modal>
          </Grid>

          {/* Start Date Selector */}
          { availableDates?.length > 0 && !singleBatchWithOneDate && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                <StartDateShowCase startDate={startDate} frontEndTotal={frontEndTotal} />
                {(!bookingRule.restrictStartDateChange && !bookingRule.forcefullBuyCourse && !hideStartDateSelector) && 
                  <FormControl fullWidth variant="outlined" size="small">
                    <Select
                      value={startDate}
                      onChange={handleStartDateChange}
                      displayEmpty
                      renderValue={(selected) => {
                        return "Update start date";
                      }}
                      sx={{ backgroundColor: 'white' }}
                    >
                      {availableDates.map((date) => (
                        <MenuItem key={date} value={date}>
                          {formatDateToShortMonth(date)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                }
              </Paper>
            </Grid>
          )}

          {/* Batch Selection */}
          {singleBatchWithOneDate ? (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600 }}>
                    Class Date
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    bgcolor: '#e3f2fd',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    border: '1px solid #90caf9',
                  }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: '#1976d2',
                        fontWeight: 500,
                        marginRight: '8px'
                      }}
                    >
                      {formatDateToShortMonth(data.allBatch[0].oneBatch[0])}
                    </Typography>
                    <CheckCircleIcon 
                      sx={{ 
                        color: '#2e7d32',
                        fontSize: '20px'
                      }} 
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ) : (
            data?.allBatch
              .filter(batch => !batch.hide)
              .map((batch, batchIndex) => {
                const isDisabled = isCheckboxDisabled(batch, batchIndex);
                const tooltipTitle = getTooltipTitle(batch, batchIndex, isDisabled);

                return (
                  <Grid item xs={12} key={batch._id}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Tooltip title={tooltipTitle} placement="top">
                          <span> {/* Wrapper needed for disabled elements */}
                            <Checkbox
                              checked={selectedBatches.includes(batch._id)}
                              onChange={() => handleBatchSelect(batch._id)}
                              disabled={isDisabled}
                            />
                          </span>
                        </Tooltip>
                        <Typography variant="h6" sx={{ mr: 2 }}>
                          Set {batchIndex + 1}
                        </Typography>
                        {batch.bookingFull && (
                          <Chip
                            label="Fully Booked"
                            size="small"
                            sx={{
                              backgroundColor: '#FEE2E2',
                              color: '#DC2626',
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                      </Box>
                      <Grid container spacing={1.5}>
                        {batch.oneBatch.map((date) => {
                          const isPastDate = new Date(date) <= effectiveDate;
                          const isSelected = isDateSelected(date);
                          const isPurchased = isDateAlreadyPurchased(date);
                          let bgColor = '#F3F4F6'; // default color
                          let textColor = '#9CA3AF'; // default text color
                          
                          // First check if the date is purchased, regardless of whether it's past or not
                          if (isPurchased) {
                            bgColor = '#FFF3CD'; // light yellow for purchased
                            textColor = '#f0ad4e'; // darker yellow text
                          } else if (!isPastDate) {
                            // If not purchased and not past date, then check if selected
                            if (isSelected) {
                              bgColor = '#E8F5E9'; // light green for selected
                              textColor = '#2E7D32'; // dark green text
                            } else {
                              bgColor = '#FEE2E2'; // light red for not selected
                              textColor = '#DC2626'; // dark red text
                            }
                          }
                          // If none of above conditions met, it will keep the default past date styling

                          return (
                            <Grid item xs={6} sm={4} key={date}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  backgroundColor: bgColor,
                                  color: textColor,
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  border: '1px solid',
                                  borderColor: isPurchased ? '#ffeeba' :
                                              (isPastDate ? '#E5E7EB' :
                                              (isSelected ? '#A5D6A7' : '#FECACA')),
                                  transition: 'all 0.2s ease',
                                  '&:hover': !isPastDate && !isPurchased && {
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                  }
                                }}
                              >
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    fontWeight: 500,
                                    flex: 1
                                  }}
                                >
                                  {formatDateToShortMonth(date)}
                                </Typography>
                                {isPurchased ? 
                                  <CheckCircleIcon sx={{ fontSize: 18, ml: 1 }} /> :
                                  (!isPastDate && (
                                    isSelected ? 
                                      <CheckCircleIcon sx={{ fontSize: 18, ml: 1 }} /> :
                                      <CancelIcon sx={{ fontSize: 18, ml: 1 }} />
                                  ))
                                }
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Paper>
                  </Grid>
                );
              })
          )}

          {/* Legend - Shown once at the bottom */}
          {!singleBatchWithOneDate && <DateLegend />}

          {/* Payment Button */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: 'white',
              borderTop: '1px solid #E5E7EB',
              padding: 2,
              zIndex: 1000,
            }}
          >
            <CoursePayButton
              data={data}
              setSubmitted={setSubmitted}
              setSubmittedId={setSubmittedId}
              setTotalAmount={setTotalAmount}
              totalAmount={totalAmount}
              frontEndTotal={frontEndTotal}
              selectedDates={selectedDates}
              selectedChild={selectedChild}
              preserveSelections={preserveSelections}
              setPreserveSelections={setPreserveSelections}
            />
          </Box>
        </>)}</>
      )}
    </Grid>
  );
};

export default CourseDateSelector;