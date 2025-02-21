import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import CoursePayButton from "./CoursePayButton";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";
import DateLegend from "./DateLegend";
import StartDateShowCase from "./StartDateShowCase";

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
  setFrontEndTotal
}) => {
  const today = new Date();
  const effectiveDate = data?.allowBackDateBuy && data?.backDayCount
    ? new Date(today.getTime() - (data.backDayCount * 24 * 60 * 60 * 1000))
    : today;
console.log("CourseDateSelector",data);
  
  const singleBatchWithOneDate = data?.allBatch?.length === 1 && 
    data.allBatch[0].oneBatch.length === 1 && 
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
    if (data.forcefullBuyCourse && data?.allBatch) {
      const availableBatchIds = data.allBatch
        .filter(b => !b.hide && !b.bookingFull)
        .map(b => b._id);
      setSelectedBatches(availableBatchIds);
    }
  }, [data.forcefullBuyCourse, data?.allBatch]);

  const isValidBatchSelection = (batchId, allBatches) => {
    const validBatches = allBatches.filter(batch => !batch.hide && !batch.bookingFull);
    const batchIndex = validBatches.findIndex(batch => batch._id === batchId);
    
    if (selectedBatches.length === 0) {
      // Can select any batch when none are selected
      return true;
    }

    const selectedIndices = selectedBatches.map(id => 
      validBatches.findIndex(batch => batch._id === id)
    );
    const minSelected = Math.min(...selectedIndices);
    const maxSelected = Math.max(...selectedIndices);

    // Allow selecting adjacent batch only
    return batchIndex === minSelected - 1 || batchIndex === maxSelected + 1;
  };

  const handleBatchSelect = (batchId) => {
    if (data.forcefullBuyCourse) return;

    let updatedBatches;
    if (selectedBatches.includes(batchId)) {
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
      // When selecting, only allow if it's adjacent to current selection
      if (!isValidBatchSelection(batchId, data.allBatch)) {
        return;
      }
      updatedBatches = [...selectedBatches, batchId].sort();
    }

    setSelectedBatches(updatedBatches);

    if (updatedBatches.length === 0) {
      setSelectedDates([]);
      setAvailableDates([]);
      setStartDate("");
    }
  };

  useEffect(() => {
    if (selectedBatches.length > 0 && data?.allBatch) {
      // For availableDates, only show dates from the first selected batch
      const firstSelectedBatchId = selectedBatches[0];
      const firstSelectedBatch = data.allBatch.find(b => b._id === firstSelectedBatchId);
      
      const availableFutureDates = firstSelectedBatch && !firstSelectedBatch.hide && !firstSelectedBatch.bookingFull
        ? firstSelectedBatch.oneBatch.filter(date => new Date(date) > effectiveDate)
        : [];

      // Sort available dates chronologically
      const sortedAvailableDates = [...new Set(availableFutureDates)].sort((a, b) => new Date(a) - new Date(b));
      setAvailableDates(sortedAvailableDates);

      // For selectedDates, include dates from all selected batches
      const allSelectedDates = selectedBatches
        .map(batchId => data.allBatch.find(b => b._id === batchId))
        .filter(batch => batch && !batch.hide && !batch.bookingFull)
        .flatMap(batch => batch.oneBatch.filter(date => new Date(date) > effectiveDate));

      // Sort selected dates chronologically
      const sortedSelectedDates = [...new Set(allSelectedDates)].sort((a, b) => new Date(a) - new Date(b));
      setSelectedDates(sortedSelectedDates);

      // Set start date from available dates (first batch only)
      if (sortedAvailableDates.length > 0) {
        if(!sortedAvailableDates.includes(startDate)){
          setStartDate(sortedAvailableDates[0]);
          handleStartDateChange({target: {value: sortedAvailableDates[0]}});
        } else {
          setStartDate(startDate);
          handleStartDateChange({target: {value: startDate}});
        }
      } else {
        setStartDate("");
      }
    } else {
      setAvailableDates([]);
      setSelectedDates([]);
      setStartDate("");
    }
  }, [selectedBatches, data]);

  const handleStartDateChange = (event) => {
    const newDate = event.target.value;
    setStartDate(newDate);
    const selectedStartDate = new Date(newDate);
    
    const allSelectedDates = selectedBatches
      .map(batchId => data?.allBatch?.find(b => b._id === batchId))
      .filter(batch => batch && !batch.hide && !batch.bookingFull)
      .flatMap(batch => batch.oneBatch.filter(date => new Date(date) >= selectedStartDate));

    if (allSelectedDates?.length > 0) {
      setSelectedDates(allSelectedDates);
    } else {
      setSelectedDates([]);
    }
  };

  const isDateSelected = (date) => {
    return selectedDates?.includes(date) || false;
  };

  return (
    <Grid container spacing={2}>
      {/* Header */}
      <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' , marginTop: '10px'}}>
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

      {/* Start Date Selector */}
      { availableDates?.length > 0 && !singleBatchWithOneDate && (
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
         <StartDateShowCase   startDate={startDate} frontEndTotal={frontEndTotal}
   />
       {  (!data.restrictStartDateChange && !data.forcefullBuyCourse) &&   <FormControl fullWidth variant="outlined" size="small">
              <Select
                value={startDate}
                onChange={handleStartDateChange}
                displayEmpty
                renderValue={(selected) => {
                  // if (!selected) {
                    return "Update start date";
                  // }
                  // return formatDateToShortMonth(selected);
                }}
                sx={{ backgroundColor: 'white' }}
              >
                {availableDates.map((date) => (
                  <MenuItem key={date} value={date}>
                    {formatDateToShortMonth(date)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>}
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
          .map((batch, batchIndex) => (
        <Grid item xs={12} key={batch._id}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Checkbox
                checked={selectedBatches.includes(batch._id)}
                onChange={() => handleBatchSelect(batch._id)}
                disabled={
                  batch.bookingFull || 
                  data.forcefullBuyCourse || 
                  (!selectedBatches.includes(batch._id) && !isValidBatchSelection(batch._id, data.allBatch))
                }
              />
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
                let bgColor = '#F3F4F6'; // default/past date color
                let textColor = '#9CA3AF'; // past date text color
                
                if (!isPastDate) {
                  if (isSelected) {
                    bgColor = '#E8F5E9'; // light green for selected
                    textColor = '#2E7D32'; // dark green text
                  } else {
                    bgColor = '#FEE2E2'; // light red for not selected
                    textColor = '#DC2626'; // dark red text
                  }
                }

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
                        borderColor: isPastDate ? '#E5E7EB' : (isSelected ? '#A5D6A7' : '#FECACA'),
                        transition: 'all 0.2s ease',
                        '&:hover': !isPastDate && {
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
                      {!isPastDate && (
                        isSelected ? 
                          <CheckCircleIcon sx={{ fontSize: 18, ml: 1 }} /> :
                          <CancelIcon sx={{ fontSize: 18, ml: 1 }} />
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Grid>
      )))}

      {/* Legend - Shown once at the bottom */}
  {/* Legend */}
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
        />
      </Box>
    </Grid>
  );
};

export default CourseDateSelector;