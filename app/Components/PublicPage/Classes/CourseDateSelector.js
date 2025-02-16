import React, { useState, useEffect } from "react";
import {
  Divider,
  Grid,
  Typography,
  Checkbox,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Button,
} from "@mui/material";
import { FcApproval } from "react-icons/fc"; // Import the approval icon
import { formatDateToShortMonth } from "@/app/utils/dateFormat";
import CoursePayButton from "./CoursePayButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CourseDateSelector = ({
  isMobile,
  data, 
  setStep,
  setSubmitted, 
  setSubmittedId, 
  selectedChild, 
  setTotalAmount, 
  totalAmount, 
  selectedDates = [], // Add default value
  setSelectedDates,
}) => {
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [frontEndTotal, setFrontEndTotal] = useState(null);
  const today = new Date();

  useEffect(() => {
    const selectedDatesCount = selectedDates?.length || 0; // Add null check
    let total = 0;
    let oneDatePrice = data?.oneClassPrice;
    if (oneDatePrice) {
      total = selectedDatesCount * oneDatePrice;
      total = total.toFixed(2);
    }
    if(total > 0) {
      setFrontEndTotal(total);
    } else {
      setFrontEndTotal(null);
    }
  }, [selectedDates]);


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
          setStartDate(batchDates[0]);
        }
        const allSelectedDates = selectedBatches
          .map(batchId => data.allBatch.find(b => b._id === batchId))
          .filter(batch => batch && !batch.hide && !batch.bookingFull)
          .flatMap(batch => batch.oneBatch.filter(date => new Date(date) > today));
        
        if (allSelectedDates.length > 0) {
          setSelectedDates(allSelectedDates);
        }
      }
    }
  }, [selectedBatches, data]);

  const isBatchSelected = (batchId) => {
    return selectedBatches.includes(batchId);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    const selectedStartDate = new Date(event.target.value);
    
    const allSelectedDates = selectedBatches
      .map(batchId => data?.allBatch?.find(b => b._id === batchId))
      .filter(batch => batch && !batch.hide && !batch.bookingFull)
      .flatMap(batch => batch.oneBatch.filter(date => new Date(date) >= selectedStartDate));

    if (allSelectedDates?.length > 0) {
      setSelectedDates(allSelectedDates);
    } else {
      setSelectedDates([]); // Set empty array if no dates found
    }
  };

  const isDateSelected = (date) => {
    return selectedDates?.includes(date) || false; // Add null check
  };

  return (
    <Grid container spacing={2}>
      {/* Back button and header */}
      <Grid item xs={12}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setStep(2)}  // Simply go back to step 2 without clearing data
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

      {/* Start date selector */}
      <Grid item xs={12}>
        <FormControl variant="standard" fullWidth>
          <InputLabel id="start-date-label">Start Date</InputLabel>
          <Select
            focused
            labelId="start-date-label"
            id="start-date-select"
            value={startDate}
            onChange={handleStartDateChange}
          >
            {availableDates.map((date) => (
              <MenuItem key={date} value={date}>
                {formatDateToShortMonth(date)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Batch selection */}
      {data?.allBatch
        .filter(batch => !batch.hide)
        .map((batch, batchIndex) => (
        <Grid item xs={12} key={batch._id}>
          <Paper
            elevation={3}
            style={{
              padding: "16px",
              backgroundColor: isBatchSelected(batch._id) ? "#f0f0f0" : "inherit",
              opacity: batch.bookingFull ? 0.7 : 1,
            }}
          >
            <Grid container alignItems="center">
              <Checkbox
                checked={isBatchSelected(batch._id)}
                onChange={() => handleBatchSelect(batch._id)}
                disabled={batch.bookingFull}
              />
              <Typography variant="h6">
                Batch {batchIndex + 1}
                {batch.bookingFull && (
                  <Chip
                    label="Fully Booked"
                    size="small"
                    sx={{
                      ml: 1,
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      fontWeight: 'bold'
                    }}
                  />
                )}
              </Typography>
            </Grid>
            <Divider style={{ margin: "8px 0" }} />
            <Grid container spacing={2}>
              {batch.oneBatch.map((date) => (
                <Grid item xs={4} key={date} style={{ display: "flex", alignItems: "center" }}>
                  <Typography 
                    variant="body1" 
                    style={{ 
                      fontWeight: isDateSelected(date) ? "bold" : "normal",
                      color: new Date(date) <= today ? '#9CA3AF' : 'inherit'
                    }}
                  >
                    {formatDateToShortMonth(date)}
                  </Typography>
                  {isDateSelected(date) && <FcApproval style={{ marginLeft: "8px" }} />}
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      ))}

      {/* Payment button */}
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
