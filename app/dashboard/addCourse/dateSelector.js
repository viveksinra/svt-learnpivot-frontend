import React, { useState } from 'react';
import { Button, TextField, Grid, Box, Typography } from '@mui/material';

const DateSelector = ({dates, setDates}) => {
  const [selectedDates, setSelectedDates] = useState(new Set());

  const handleAddBatch = () => {
    setDates([...dates, ['']]);
  };

  const handleAddTextField = (batchIndex) => {
    const newDates = [...dates];
    newDates[batchIndex] = [...newDates[batchIndex], ''];
    setDates(newDates);
  };

  const handleDateChange = (batchIndex, dateIndex, value) => {
    const newDates = [...dates];
    newDates[batchIndex][dateIndex] = value;
    setDates(newDates);
    // Add the selected date to the set of selected dates
    setSelectedDates((prevSelectedDates) => new Set([...prevSelectedDates, value]));
  };

  const handleRemoveDate = (batchIndex, dateIndex) => {
    const newDates = [...dates];
    const removedDate = newDates[batchIndex][dateIndex];
    newDates[batchIndex].splice(dateIndex, 1);
    setDates(newDates);
    // Remove the selected date from the set of selected dates
    setSelectedDates((prevSelectedDates) => {
      const updatedSet = new Set(prevSelectedDates);
      updatedSet.delete(removedDate);
      return updatedSet;
    });
  };

  const handleDeleteBatch = (batchIndex) => {
    if (dates.length === 1) return; // Don't delete if there is only one batch
    const newDates = [...dates];
    newDates.splice(batchIndex, 1);
    setDates(newDates);
  };

  const isAddDateDisabled = (batchIndex, dateIndex) => {
    return dateIndex > 0 && !dates[batchIndex][dateIndex - 1];
  };

  const isAddBatchDisabled = (batchIndex) => {
    return dates[batchIndex].some(date => !date);
  };

  const isDateUnique = (batchIndex, dateIndex, date) => {
return true
  };
  

  return (
    <div>
      {dates.map((batch, batchIndex) => (
        <Box key={batchIndex} mb={2} border={1} p={2}>
          <Typography variant="h6" gutterBottom>
            Batch {batchIndex + 1}
            {dates.length > 1 && (
              <Button variant="contained" color="error" onClick={() => handleDeleteBatch(batchIndex)} sx={{ marginLeft: '10px' }}>
                Delete Batch
              </Button>
            )}
          </Typography>
          <Grid container spacing={2}>
            {batch.map((date, dateIndex) => (
              <Grid item xs={3} key={dateIndex}>
                <TextField
                  label={`Date ${dateIndex + 1}`}
                  variant="outlined"
                  value={date}
                  type='date'
                  focused
                  onChange={(e) => handleDateChange(batchIndex, dateIndex, e.target.value)}
                  error={!isDateUnique(batchIndex, dateIndex, date)}
                  helperText={!isDateUnique(batchIndex, dateIndex, date) && "Date already selected in another batch"}
                />
                <Button variant="outlined" color="error" onClick={() => handleRemoveDate(batchIndex, dateIndex)} sx={{ marginTop: '10px' }}>
                  Remove
                </Button>
              </Grid>
            ))}
            <Grid item xs={3}>
              <Button
                variant="contained" color="success"
                onClick={() => handleAddTextField(batchIndex)}
                disabled={isAddDateDisabled(batchIndex, batch.length)}
              >
                Add Date
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button variant="contained" onClick={handleAddBatch} disabled={isAddBatchDisabled(dates.length - 1)}>
        Add Batch
      </Button>
    </div>
  );
};

export default DateSelector;
