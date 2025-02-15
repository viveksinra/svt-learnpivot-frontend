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
  selectedDates,
  setSelectedDates,
}) => {
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [frontEndTotal, setFrontEndTotal] = useState(null);
  // Get today's date
  const today = new Date();

  useEffect(() => {
    // Update frontEndTotal with selected dates

    const selectedDatesCount = selectedDates.length;
    let total = 0;
    let oneDatePrice = data?.oneClassPrice;
    if (oneDatePrice) {
      total = selectedDatesCount * oneDatePrice;
     total = total.toFixed(2)
    }
    if(total> 0){
      setFrontEndTotal(total);
    } else {
      setFrontEndTotal(null);
    }

  }, [selectedDates]);
  useEffect(() => {
    // Find the first date that is after today
    for (let batchIndex = 0; batchIndex < data?.dates.length; batchIndex++) {
      for (let dateIndex = 0; dateIndex < data?.dates[batchIndex].length; dateIndex++) {
        const date = new Date(data?.dates[batchIndex][dateIndex]);
        if (date > today) {
          setSelectedBatches([batchIndex]);
          setStartDate(data?.dates[batchIndex][dateIndex]);
          setAvailableDates(data?.dates[batchIndex].slice(dateIndex));
          setSelectedDates(data?.dates[batchIndex].slice(dateIndex));
          return;
        }
      }
    }
  }, [data]);

  const handleBatchSelect = (batchIndex) => {
    let updatedBatches;
    if (selectedBatches.includes(batchIndex)) {
      updatedBatches = selectedBatches.filter((index) => index !== batchIndex);
    } else {
      updatedBatches = [...selectedBatches, batchIndex].sort();
    }

    setSelectedBatches(updatedBatches);

    // Clear selected dates if no batches are selected
    if (updatedBatches.length === 0) {
      setSelectedDates([]);
      setAvailableDates([]);
      setStartDate("");
    }
  };

  useEffect(() => {
    if (selectedBatches.length > 0) {
      const batchDates = data?.dates[selectedBatches[0]].filter((date) => new Date(date) > today);
      setAvailableDates(batchDates);
      if (batchDates.length > 0) {
        setStartDate(batchDates[0]);
      }
      const selBaDates = selectedBatches.flatMap((batchIndex) =>
        data?.dates[batchIndex].filter((date) => new Date(date) > today)
      );
      if (selBaDates.length > 0) {
        setSelectedDates(selBaDates);
      }
    }
  }, [selectedBatches, data]);

  const isBatchSelected = (batchIndex) => {
    return selectedBatches.includes(batchIndex);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    const selBaDates = selectedBatches.flatMap((batchIndex) =>
      data?.dates[batchIndex].filter((date) => new Date(date) >= new Date(event.target.value))
    );
    if (selBaDates.length > 0) {
      setSelectedDates(selBaDates);
    }
  };

  // Check if a date is in the selected dates array
  const isDateSelected = (date) => {
    return selectedDates.includes(date);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
      <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setStep(2)}
            sx={{ 
              width: isMobile?"30%":'20%',
              minWidth: 'auto',
              color: 'white', 
              marginRight: '10px',
              backgroundColor: '#fc7658', 
              '&:hover': { backgroundColor: 'darkred' }
            }}
          >
            Back
          </Button>
          <Typography variant="h7" sx={{ width: isMobile?"70%":'80%', fontWeight: 400 }}>
       Book Courses for <span style={{ fontWeight: 'bold' }}>{selectedChild.childName}</span>
          </Typography>
      </Grid>
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
      {data?.dates.map((batch, batchIndex) => (
        <Grid item xs={12} key={batchIndex}>
          <Paper
            elevation={3}
            style={{
              padding: "16px",
              backgroundColor: isBatchSelected(batchIndex) ? "#f0f0f0" : "inherit",
            }}
          >
            <Grid container alignItems="center">
              <Checkbox
                checked={isBatchSelected(batchIndex)}
                onChange={() => handleBatchSelect(batchIndex)}
              />
              <Typography variant="h6">Batch {batchIndex + 1}</Typography>
            </Grid>
            <Divider style={{ margin: "8px 0" }} />
            <Grid container spacing={2}>
            {batch.map((date) => (
  <Grid item xs={4} key={date} style={{ display: "flex", alignItems: "center" }}>
    <Typography 
      variant="body1" 
      style={{ fontWeight: isDateSelected(date) ? "bold" : "normal" }}
    >
      {formatDateToShortMonth(date)}
    </Typography>
    {isDateSelected(date) && <FcApproval style={{ marginLeft: "8px" }} />} {/* Conditionally render the icon */}
  </Grid>
))}

            </Grid>
          </Paper>
        </Grid>
      ))}
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
