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

  const handleBatchSelect = (batchId) => {
    if (data.forcefullBuyCourse) return;
    let updatedBatches;
    if (selectedBatches.includes(batchId)) {
      updatedBatches = selectedBatches.filter((id) => id !== batchId);
    } else {
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
      // Get all dates from selected batches that are in the future
      const allSelectedDates = selectedBatches
        .map(batchId => data.allBatch.find(b => b._id === batchId))
        .filter(batch => batch && !batch.hide && !batch.bookingFull)
        .flatMap(batch => batch.oneBatch.filter(date => new Date(date) > today));

      // Sort dates chronologically
      const sortedDates = [...new Set(allSelectedDates)].sort((a, b) => new Date(a) - new Date(b));

      // Update available dates
      setAvailableDates(sortedDates);

      // Always set the start date to the first available date
      if (sortedDates.length > 0) {
        setStartDate(sortedDates[0]);
        // Update selected dates based on the new start date
        setSelectedDates(sortedDates);
      } else {
        setStartDate("");
        setSelectedDates([]);
      }
    } else {
      setAvailableDates([]);
      setStartDate("");
      setSelectedDates([]);
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
      {!data.restrictStartDateChange && availableDates?.length > 0 && !singleBatchWithOneDate && (
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                bgcolor: startDate ? '#e3f2fd' : '#ffebee',
                borderRadius: '8px',
                padding: '8px 16px',
                border: '1px solid',
                borderColor: startDate ? '#90caf9' : '#ffcdd2',
                transition: 'all 0.3s ease'
              }}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="bold"
                  sx={{
                    color: startDate ? '#1976d2' : '#d32f2f',
                  }}
                >
                  Start Date: {startDate ? formatDateToShortMonth(startDate) : 'Not Selected'}
                </Typography>
              </Box>
              {frontEndTotal && (
                <Typography 
                  variant="subtitle1" 
                  fontWeight="bold"
                  sx={{
                    bgcolor: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #a5d6a7'
                  }}
                >
                  Total: £{frontEndTotal}
                </Typography>
              )}
            </Box>
            <FormControl fullWidth variant="outlined" size="small">
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
            </FormControl>
          </Paper>
        </Grid>
      )}

      {/* Batch Selection */}
      {singleBatchWithOneDate ? (
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h6">
                Selected Class Date
              </Typography>
              <CheckCircleIcon color="success" />
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {formatDateToShortMonth(data.allBatch[0].oneBatch[0])}
            </Typography>
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
                disabled={batch.bookingFull || data.forcefullBuyCourse}
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
            <Grid container spacing={2}>
              {batch.oneBatch.map((date) => (
                <Grid item xs={4} key={date}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: new Date(date) <= today ? '#9CA3AF' : 'inherit'
                  }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      {formatDateToShortMonth(date)}
                    </Typography>
                    {new Date(date) > today && (
                      isDateSelected(date) 
                        ? <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                        : <CancelIcon color="error" sx={{ fontSize: 16 }} />
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      )))}

      {/* Legend - Shown once at the bottom */}
      {!singleBatchWithOneDate && (
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2, bgcolor: '#f8f9fa' }}>
  
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
                <Typography variant="body2">Selected Date</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CancelIcon color="error" sx={{ fontSize: 16 }} />
                <Typography variant="body2">Not Selected</Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InfoIcon color="disabled" sx={{ fontSize: 16 }} />
                <Typography variant="body2">Past Date</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      )}

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