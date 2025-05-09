import React, { useState } from 'react';
import { Button, TextField, Grid, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';

const DateSelector = ({allBatch, setAllBatch}) => {
    const [selectedDates, setSelectedDates] = useState(new Set());

    const handleAddBatch = () => {
        setAllBatch([...allBatch, {
            oneBatch: [''],
            hide: false,
            bookingFull: false
        }]);
    };

    const handleAddTextField = (batchIndex) => {
        const newBatches = [...allBatch];
        newBatches[batchIndex].oneBatch = [...newBatches[batchIndex].oneBatch, ''];
        setAllBatch(newBatches);
    };

    const handleDateChange = (batchIndex, dateIndex, value) => {
        const newBatches = [...allBatch];
        newBatches[batchIndex].oneBatch[dateIndex] = value;
        setAllBatch(newBatches);
        setSelectedDates(prev => new Set([...prev, value]));
    };

    const handleBatchPropertyChange = (batchIndex, property) => {
        const newBatches = [...allBatch];
        newBatches[batchIndex][property] = !newBatches[batchIndex][property];
        setAllBatch(newBatches);
    };

    const handleRemoveDate = (batchIndex, dateIndex) => {
        if (window.confirm('Are you sure you want to delete this date?')) {
            const newBatches = [...allBatch];
            const removedDate = newBatches[batchIndex].oneBatch[dateIndex];
            newBatches[batchIndex].oneBatch.splice(dateIndex, 1);
            setAllBatch(newBatches);
            setSelectedDates(prev => {
                const updated = new Set(prev);
                updated.delete(removedDate);
                return updated;
            });
        }
    };

    const handleDeleteBatch = (batchIndex) => {
        if (allBatch.length === 1) return;
        if (window.confirm('Are you sure you want to delete this batch?')) {
            const newBatches = [...allBatch];
            newBatches.splice(batchIndex, 1);
            setAllBatch(newBatches);
        }
    };

    return (
        <div>
            {allBatch.map((batch, batchIndex) => (
                <Box key={batchIndex} mb={2} border={1} p={2}>
                    <Typography variant="h6" gutterBottom>
                        Batch {batchIndex + 1}
                        {allBatch.length > 1 && (
                            <Button variant="contained" color="error" onClick={() => handleDeleteBatch(batchIndex)} sx={{ marginLeft: '10px' }}>
                                Delete Batch
                            </Button>
                        )}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={batch.hide}
                                        onChange={() => handleBatchPropertyChange(batchIndex, 'hide')}
                                    />
                                }
                                label="Hide Batch"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={batch.bookingFull}
                                        onChange={() => handleBatchPropertyChange(batchIndex, 'bookingFull')}
                                    />
                                }
                                label="Booking Full"
                            />
                        </Grid>
                        {batch.oneBatch.map((date, dateIndex) => (
                            <Grid item xs={12} sm={6} md={3} key={dateIndex}>
                                <TextField
                                    label={`Date ${dateIndex + 1}`}
                                    variant="outlined"
                                    value={date}
                                    type='date'
                                    focused
                                    onChange={(e) => handleDateChange(batchIndex, dateIndex, e.target.value)}
                                    fullWidth
                                    sx={{ mb: 1 }}
                                />
                                <Button variant="outlined" color="error" onClick={() => handleRemoveDate(batchIndex, dateIndex)} sx={{ marginTop: '10px', width: '100%' }}>
                                    Remove
                                </Button>
                            </Grid>
                        ))}
                        <Grid item xs={12} sm={6} md={3}>
                            <Button
                                variant="contained" color="success"
                                onClick={() => handleAddTextField(batchIndex)}
                                fullWidth
                                sx={{ height: '56px' }}
                            >
                                Add Date
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            ))}
            <Button variant="contained" onClick={handleAddBatch} fullWidth sx={{ mt: 2 }}>
                Add Batch
            </Button>
        </div>
    );
};

export default DateSelector;
