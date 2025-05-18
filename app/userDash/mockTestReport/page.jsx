"use client";
import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper
} from '@mui/material';
import { 
  PersonOutline 
} from '@mui/icons-material';
import MySnackbar from '../../Components/MySnackbar/MySnackbar';
import { childService, mockTestService } from '@/app/services';
import AllInOneMain from './ReportComp/AllInOne/AllInOneMain';

const MockTestReport = () => {
  const [selectedChild, setSelectedChild] = useState('');
  const [allChildren, setAllChildren] = useState([]);
  const snackRef = useRef();
  const [mockTestReport, setMockTestReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catchmentType, setCatchmentType] = useState('inside'); // 'inside' or 'outside'
  useEffect(() => {
    handleGetAllChildren();
  }, []);
  // Effect to auto-select the only child if there's only one
  useEffect(() => {
    if (allChildren.length === 1) {
      handleChildSelect(allChildren[0]._id);
    }
  }, [allChildren]);
  // Effect to fetch report when a child is selected
  useEffect(() => {
    if (selectedChild) {
      handleGetAllMockTestReport();
    }
  }, [selectedChild]);
  const handleGetAllChildren = async () => {
    try {
      const response = await childService.getAll();
      if (response.data) {
        setAllChildren(response.data);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      snackRef.current.handleSnack({ message: 'Failed to fetch children.', variant: 'error' });
    }
  };
  const handleChildSelect = (childId) => {
    setMockTestReport([]);
    setSelectedChild(childId);
  };
  const handleGetAllMockTestReport = async () => {
    try {
      setLoading(true);
      console.log('Fetching mock test report for child:', selectedChild);
      const response = await mockTestService.getMyPastCsseMockTest({childId: selectedChild});
      console.log('Mock test report response:', response);
      if (response.data) {
        // Sort reports by date for chronological display
        const sortedReports = [...response.data].sort((a, b) => 
          new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
        );
        setMockTestReport(sortedReports);
      } else {
        if(response.message){
          snackRef.current.handleSnack({ message: response.message, variant: 'error' });
        }else{
          throw new Error('No data received');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      snackRef.current.handleSnack({ message: 'Failed to fetch mock test report.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      minHeight: '100vh',
      py: { xs: 2, sm: 4 }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" fontWeight="bold" sx={{ 
          mb: 3,
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' } 
        }}>
          Mock Test Reports
        </Typography>
        {allChildren.length > 1 && (
          <Paper elevation={0} sx={{ 
            p: { xs: 2, sm: 3 }, 
            mb: 4, 
            borderRadius: 2, 
            border: '1px solid #e0e0e0' 
          }}>
            <Typography variant="h6" sx={{ 
              mb: 2,
              fontSize: { xs: '1rem', sm: '1.25rem' } 
            }}>
              Select Child
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 2 }
            }}>
              {allChildren.map((child) => (
                <Button
                  key={child._id}
                  variant={selectedChild === child._id ? "contained" : "outlined"}
                  onClick={() => handleChildSelect(child._id)}
                  startIcon={<PersonOutline />}
                  size={['xs', 'sm'].includes(typeof window !== 'undefined' && window.innerWidth < 600) ? "small" : "medium"}
                  sx={{
                    borderRadius: 2,
                    py: { xs: 0.5, sm: 1 },
                    px: { xs: 1, sm: 2 },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                >
                  {child.childName} - {child.childYear}
                </Button>
              ))}
            </Box>
          </Paper>
        )}
        
        <AllInOneMain 
          selectedChild={selectedChild}
          allChildren={allChildren}
          mockTestReport={mockTestReport}
          loading={loading}
          catchmentType={catchmentType}
          setCatchmentType={setCatchmentType}
          handleChildSelect={handleChildSelect}
          handleGetAllChildren={handleGetAllChildren}
          handleGetMockTestReport={handleGetAllMockTestReport}
          snackRef={snackRef}
        />
        
        <MySnackbar ref={snackRef} />
      </Container>
    </Box>
  );
};
export default MockTestReport;