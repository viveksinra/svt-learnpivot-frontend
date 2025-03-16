"use client";
import { registrationService } from '@/app/services';
import React, { useState, useEffect } from 'react';
import ChildTestTable from './Comp/ChildTestTable';
import { Alert, Box, Container, Skeleton, Paper } from '@mui/material';

const ChildTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      setError(null);
      try {
        let response = await registrationService.getAllChild();
        if (response.variant === "success") {
          setRows(response.data);
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
    fetchAllData();
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
          <ChildTestTable data={rows} />
        )}
      </Paper>
    </Container>
  );
};

export default ChildTable;
