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

  const handleBatchSelect = (batchId) => {
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
      const selectedBatch = data.allBatch.find(batch => batch._id === selectedBatches[0]);
      if (selectedBatch) {
        const batchDates = selectedBatch.oneBatch.filter(date => new Date(date) > today);
        setAvailableDates(batchDates);
        if (batchDates.length > 0) {
          if (!startDate || new Date(startDate) < new Date(batchDates[0])) {
            setStartDate(batchDates[0]);
          }
        }
        const allSelectedDates = selectedBatches
          .map(batchId => data.allBatch.find(b => b._id === batchId))
          .filter(batch => batch && !batch.hide && !batch.bookingFull)
          .flatMap(batch => batch.oneBatch.filter(date => new Date(date) > today));
        if (allSelectedDates.length > 0) {
          setSelectedDates(allSelectedDates);
        }
        if (startDate) {
          handleStartDateChange(startDate);
        }
      }
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
      <Grid item xs={12}>
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
          Book Courses for <span style={{ fontWeight: 'bold' }}>{selectedChild.childName}</span>
        </Typography>
      </Grid>

      {/* Start Date Selector */}
      {availableDates?.length > 0 && (
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" color="textSecondary">
                Start Date: {startDate ? formatDateToShortMonth(startDate) : 'Not Selected'}
              </Typography>
              {frontEndTotal && (
                <Typography variant="subtitle1" fontWeight="bold">
                  Total: ${frontEndTotal}
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
      {data?.allBatch
        .filter(batch => !batch.hide)
        .map((batch, batchIndex) => (
        <Grid item xs={12} key={batch._id}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Checkbox
                checked={selectedBatches.includes(batch._id)}
                onChange={() => handleBatchSelect(batch._id)}
                disabled={batch.bookingFull}
              />
              <Typography variant="h6" sx={{ mr: 2 }}>
                Batch {batchIndex + 1}
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
      ))}

      {/* Legend - Shown once at the bottom */}
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