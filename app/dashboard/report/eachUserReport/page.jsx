"use client";
import { registrationService } from '@/app/services';
import React, { useState, useEffect } from 'react';
import { Alert, Box, Container, Skeleton, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const EachUserReport = () => {
  const [allChildForDropDown, setAllChildForDropDown] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState('');

  async function fetchAllChildForDropDown() {
    setLoading(true);
    setError(null);
    try {
      let response = await registrationService.getAllChildForDropDown();
      if (response.variant === "success") {
        setAllChildForDropDown(response.data);
        // Set the first child as default if available
        if (response.data.length > 0) {
          setSelectedChild(response.data[0]._id);
        }
      } else {
        setError("Failed to fetch data");
      }
    } catch (error) {
      setError("An error occurred while fetching data");
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChildChange = (event) => {
    setSelectedChild(event.target.value);
  };

  useEffect(() => {
    fetchAllChildForDropDown();
  }, []);

  return (
    <Container maxWidth="xl">
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        
        {loading ? (
          <Box sx={{ width: '100%' }}>
            <Skeleton height={60} />
            <Skeleton height={400} />
          </Box>
        ) : (
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="child-select-label">Select Child</InputLabel>
              <Select
                labelId="child-select-label"
                id="child-select"
                value={selectedChild}
                label="Select Child"
                onChange={handleChildChange}
              >
                {allChildForDropDown.map((child) => (
                  <MenuItem key={child._id} value={child._id}>
                    {child.childName} - {child.childYear} ({child.parent.firstName} {child.parent.lastName})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default EachUserReport;
