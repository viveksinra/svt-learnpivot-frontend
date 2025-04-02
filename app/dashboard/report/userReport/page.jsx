"use client";
import { registrationService } from '@/app/services';
import React, { useState, useEffect } from 'react';
import UserTestTable from './Comp/UserTestTable';
import UserTestGrid from './Comp/UserTestGrid';
import { 
  Alert, 
  Box, 
  Container, 
  Skeleton, 
  Paper,
  ToggleButtonGroup, 
  ToggleButton, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';

const CourseParentTable = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Auto switch to grid view on mobile
  useEffect(() => {
    if (isMobile) {
      setViewMode('grid');
    }
  }, [isMobile]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      setError(null);
      try {
        let response = await registrationService.getAllUser();
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
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 1, sm: 2, md: 3 }, mt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}
        
        {!loading && !isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewChange}
              aria-label="view mode"
              size="small"
            >
              <ToggleButton value="table" aria-label="table view">
                <TableRowsIcon />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="grid view">
                <GridViewIcon />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        )}
        
        {loading ? (
          <Box sx={{ width: '100%' }}>
            <Skeleton height={60} />
            <Skeleton height={400} />
          </Box>
        ) : (
          viewMode === 'table' 
            ? <UserTestTable data={rows} exportFileName="user_report" /> 
            : <UserTestGrid data={rows} exportFileName="user_report" />
        )}
      </Paper>
    </Container>
  );
};

export default CourseParentTable;
