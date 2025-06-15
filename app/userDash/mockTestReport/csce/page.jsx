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
import MySnackbar from '../../../Components/MySnackbar/MySnackbar';
import { childService, mockTestService } from '@/app/services';
import AllInOneMain from '../ReportComp/AllInOne/AllInOneMain';
import JustOneMain from '../ReportComp/JustOne/JustOneMain';
import { formatDateToShortMonth } from '@/app/utils/dateFormat';

const MockTestReport = () => {
  const [selectedChild, setSelectedChild] = useState('');
  const [allChildren, setAllChildren] = useState([]);
  const snackRef = useRef();
  const [mockTestReport, setMockTestReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catchmentType, setCatchmentType] = useState('inside'); // 'inside' or 'outside'
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [availableMockTests, setAvailableMockTests] = useState([]);
  const [selectedMockTestId, setSelectedMockTestId] = useState('all');
  const [selectedBatchId, setSelectedBatchId] = useState('all');
  const [mockTestReports, setMockTestReports] = useState([]);
  const [oneMockTestReport, setOneMockTestReport] = useState({});

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
      handleGetMockTestReport(selectedChild, selectedMockTestId || 'all', selectedBatchId || 'all');
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

  const handleGetAllMockResultForSelectedChild = async (childId) => {
    setLoading(true);
    try {
      const response = await mockTestService.getMockTestIdsByChildId(childId);
      if (response.variant === "success") {
        setAvailableMockTests(response.data);
        // Reset selected mock test to "all"
        setSelectedMockTestId('all');
        setSelectedBatchId('all');
        // Fetch all reports by default
        await handleGetMockTestReport(childId, 'all', 'all');
      }
    } catch (error) {
      console.error("Error fetching mock tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChildSelect = async (childId) => {
    setSelectedChildId(childId);
    setSelectedChild(childId);
    if (childId) {
      await handleGetAllMockResultForSelectedChild(childId);
    } else {
      setAvailableMockTests([]);
      setMockTestReports([]);
    }
  };

  const handleGetMockTestReport = async (childId, mockTestId, batchId) => {
    setLoading(true);
    try {
      if (batchId === 'all') {
        await getMyPastCsseMockTestResultForAll(childId);
      } else {
        await getMyPastCsseMockTestResultByBatchId(childId, mockTestId, batchId);
      }
    } catch (error) {
      console.error("Error fetching mock test reports:", error);
    } finally {
      setLoading(false);
    }
  };
  const getMyPastCsseMockTestResultByBatchId = async (childId, mockTestId, batchId) => {
    setLoading(true);
    try {
      const response = await mockTestService.getMyPastCsseMockTestResultByBatchId({childId, mockTestId, batchId});
      if (response.variant === "success") {
        setOneMockTestReport(response.data);
      }
    } catch (error) {
      console.error("Error fetching mock test reports:", error);
    } finally {
      setLoading(false);
    }
  };
  const getMyPastCsseMockTestResultForAll = async (childId) => {
    setLoading(true);
    try {
      const response = await mockTestService.getMyPastCsseMockTestResultForAll(childId);
      if (response.variant === "success") {
        setMockTestReports(response.data);
      }
    } catch (error) {
      console.error("Error fetching mock test reports:", error);
    } finally {
      setLoading(false);
    }
  };









  const handleMockTestSelect = async (mockTestId, batchId) => {
    setSelectedMockTestId(mockTestId);
    setSelectedBatchId(batchId);
    await handleGetMockTestReport(selectedChildId, mockTestId, batchId);
  };

  const handleViewDetail = (mockTestId, batchId) => {
    handleMockTestSelect(mockTestId, batchId);
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
        
        {selectedChild && availableMockTests.length > 0 && (
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
              Select Mock Test
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 2 }
            }}>
              <Button
                variant={selectedMockTestId === 'all' ? "contained" : "outlined"}
                onClick={() => handleMockTestSelect('all', 'all')}
                size={['xs', 'sm'].includes(typeof window !== 'undefined' && window.innerWidth < 600) ? "small" : "medium"}
                sx={{
                  borderRadius: 2,
                  py: { xs: 0.5, sm: 1 },
                  px: { xs: 1, sm: 2 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                All Mock Tests
              </Button>
              {availableMockTests.map((mockTest) => (
                <Button
                  key={`${mockTest.mockTestId}-${mockTest.batchId}`}
                  variant={selectedMockTestId === mockTest.mockTestId && selectedBatchId === mockTest.batchId ? "contained" : "outlined"}
                  onClick={() => handleMockTestSelect(mockTest.mockTestId, mockTest.batchId)}
                  size={['xs', 'sm'].includes(typeof window !== 'undefined' && window.innerWidth < 600) ? "small" : "medium"}
                  sx={{
                    borderRadius: 2,
                    py: { xs: 0.5, sm: 1 },
                    px: { xs: 1, sm: 2 },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                                  >
                    {mockTest.mockTestTitle} - {formatDateToShortMonth(mockTest.date)}
                  </Button>
              ))}
            </Box>
          </Paper>
        )}
        
{  selectedBatchId === 'all' ?     <AllInOneMain 
          selectedChild={selectedChild}
          allChildren={allChildren}
          mockTestReports={mockTestReports}
          loading={loading}
          catchmentType={catchmentType}
          setCatchmentType={setCatchmentType}
          onViewDetail={handleViewDetail}
        
        /> 
      :
      <JustOneMain
      oneMockTestReport={oneMockTestReport}
      allChildren={allChildren}
      selectedChild={selectedChild}


      />
      
      }
        
        <MySnackbar ref={snackRef} />
      </Container>
    </Box>
  );
};
export default MockTestReport;