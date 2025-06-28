"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { 
  PersonOutline 
} from '@mui/icons-material';
import { mockTestService } from "@/app/services";
import FsceMainCom from "./FsceReportCom/FsceMainCom";
import FsceAllInOneMain from "./FsceReportCom/FsceAllInOneMain";
import { childService } from "@/app/services";
import MySnackbar from "../../../Components/MySnackbar/MySnackbar";
import { formatDateToShortMonth } from '@/app/utils/dateFormat';

const FsceReportPage = () => {
  const [allChildren, setAllChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [mockTests, setMockTests] = useState([]);
  const [selectedMockTest, setSelectedMockTest] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [reportData, setReportData] = useState(null);
  const [allReportData, setAllReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const snackRef = useRef();

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
      fetchMockTests(selectedChild);
      fetchAllReports(selectedChild);
    }
  }, [selectedChild]);

  useEffect(() => {
    if (selectedChild && selectedMockTest && selectedBatch && selectedMockTest !== "all") {
      fetchReport(selectedChild, selectedMockTest, selectedBatch);
    }
  }, [selectedChild, selectedMockTest, selectedBatch]);

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

  const handleChildSelect = async (childId) => {
    setSelectedChild(childId);
    setSelectedMockTest("all");
    setSelectedBatch("all");
    setReportData(null);
    setAllReportData(null);
    setMockTests([]);
    if (childId) {
      await fetchMockTests(childId);
      await fetchAllReports(childId);
    }
  };

  // Handle selection via button clicks
  const handleMockTestSelect = (mockTestId, batchId) => {
    setSelectedMockTest(mockTestId);
    setSelectedBatch(batchId);
    setReportData(null);
  };

  const fetchMockTests = async (childId) => {
    setLoading(true);
    try {
      const response = await mockTestService.getFsceMockTestIdsByChildId(childId);
      if (response.variant === "success") {
        setMockTests(response.data);
      } else {
        snackRef.current?.handleSnack({ message: response.message, variant: "error" });
      }
    } catch (error) {
      snackRef.current?.handleSnack({ message: "Failed to fetch mock tests", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReports = async (childId) => {
    setLoading(true);
    try {
      const response = await mockTestService.getMyPastFsceMockTestResultForAll(childId);
      if (response.variant === "success") {
        setAllReportData(response.data);
      } else {
        snackRef.current?.handleSnack({ message: response.message, variant: "error" });
      }
    } catch (error) {
      snackRef.current?.handleSnack({ message: "Failed to fetch reports", variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fetchReport = async (childId, mockTestId, batchId) => {
    setLoadingReport(true);
    try {
      const response = await mockTestService.getMyPastFsceMockTestResultByBatchId({ childId, mockTestId, batchId });
      if (response.variant === "success") {
        setReportData(response.data);
      } else {
        setReportData(null);
        snackRef.current?.handleSnack({ message: response.message, variant: "error" });
      }
    } catch (error) {
      snackRef.current?.handleSnack({ message: "Failed to fetch report", variant: "error" });
    } finally {
      setLoadingReport(false);
    }
  };

  const handleViewDetail = (mockTestId, batchId) => {
    setSelectedMockTest(mockTestId);
    setSelectedBatch(batchId);
    setReportData(null);
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
          FSCE Mock Test Reports
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
        
        {selectedChild && mockTests.length > 0 && (
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
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: { xs: 1, sm: 2 }
              }}>
                <Button
                  variant={selectedMockTest === 'all' ? "contained" : "outlined"}
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
                {mockTests.map((test) => (
                  <Button
                    key={`${test.mockTestId}_${test.batchId}`}
                    variant={selectedMockTest === test.mockTestId && selectedBatch === test.batchId ? "contained" : "outlined"}
                    onClick={() => handleMockTestSelect(test.mockTestId, test.batchId)}
                    size={['xs', 'sm'].includes(typeof window !== 'undefined' && window.innerWidth < 600) ? "small" : "medium"}
                    sx={{
                      borderRadius: 2,
                      py: { xs: 0.5, sm: 1 },
                      px: { xs: 1, sm: 2 },
                      fontSize: { xs: '0.8rem', sm: '0.875rem' }
                    }}
                  >
                    {test.mockTestTitle || test.testName} - {formatDateToShortMonth(test.date)}
                  </Button>
                ))}
              </Box>
            )}
          </Paper>
        )}

        {loadingReport && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {selectedBatch === 'all' ? (
          <FsceAllInOneMain 
            selectedChild={selectedChild}
            allChildren={allChildren}
            mockTestReports={allReportData}
            loading={loading}
            onViewDetail={handleViewDetail}
          />
        ) : (
          reportData && !loadingReport && (
            <Box sx={{ mt: 4 }}>
              <FsceMainCom reportData={reportData} />
            </Box>
          )
        )}

        <MySnackbar ref={snackRef} />
      </Container>
    </Box>
  );
};

export default FsceReportPage;
