"use client";
import { registrationService } from '@/app/services';
import React, { useState, useEffect } from 'react';
import CourseTestTable from './Comp/CourseTestTable';
import CourseTestGrid from './Comp/CourseTestGrid';
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
        let response = await registrationService.getCourseTestNumbersApi();
        if (response.variant === "success") {
          // Process data to get max filled seats for each course title
          const processedData = processMaxEnrollment(response.data);
          setRows(processedData);
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

  // Process data to get only the entry with maximum filled seats for each course
  const processMaxEnrollment = (data) => {
    const courseMap = new Map();
    
    // Group by course title and find max filled seats for each
    data.forEach(entry => {
      const courseTitle = entry.title;
      
      // If we haven't seen this course or this entry has more filled seats
      if (!courseMap.has(courseTitle) || 
          entry.filledSeat > courseMap.get(courseTitle).filledSeat) {
        courseMap.set(courseTitle, entry);
      } 
      // If filled seats are the same but this is a more recent date
      else if (entry.filledSeat === courseMap.get(courseTitle).filledSeat && 
               entry.batchDate > courseMap.get(courseTitle).batchDate) {
        courseMap.set(courseTitle, entry);
      }
    });
    
    // Convert map values back to array
    return Array.from(courseMap.values());
  };

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
            ? <CourseTestTable data={rows} exportFileName="course_batch_report" /> 
            : <CourseTestGrid data={rows} exportFileName="course_batch_report" />
        )}
      </Paper>
    </Container>
  );
};

export default CourseParentTable;