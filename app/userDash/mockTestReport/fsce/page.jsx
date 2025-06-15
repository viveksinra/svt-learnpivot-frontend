"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { mockTestService } from "@/app/services";
import FsceMainCom from "./FsceReportCom/FsceMainCom";
import FsceAllInOneMain from "./FsceReportCom/FsceAllInOneMain";
import { childService } from "@/app/services";
import MySnackbar from "../../../Components/MySnackbar/MySnackbar";
import FsceChildSelector from "./ChildSelector";

const FsceReportPage = () => {
  const [allChildren, setAllChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [mockTests, setMockTests] = useState([]);
  const [selectedMockTest, setSelectedMockTest] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [reportData, setReportData] = useState(null);
  const [allReportData, setAllReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const snackRef = useRef();

  useEffect(() => {
    handleGetAllChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchMockTests(selectedChild);
      fetchAllReports(selectedChild);
    }
  }, [selectedChild]);

  useEffect(() => {
    if (selectedChild && selectedMockTest && selectedBatch) {
      fetchReport(selectedChild, selectedMockTest, selectedBatch);
    }
  }, [selectedChild, selectedMockTest, selectedBatch]);

  useEffect(() => {
    if (allChildren.length === 1) {
      handleChildSelect(allChildren[0]._id);
    }
  }, [allChildren]);

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
      snackRef.current.handleSnack({ message: 'Failed to fetch allChildren.', variant: 'error' });
    }
  };

  const handleChildSelect = async (childId) => {
    setSelectedChild(childId);
    setSelectedMockTest("");
    setSelectedBatch("");
    setReportData(null);
    setAllReportData(null);
    setMockTests([]);
    if (childId) {
      await fetchMockTests(childId);
      await fetchAllReports(childId);
    }
  };

  const handleMockTestChange = (event) => {
    const value = event.target.value;
    const [mockTestId, batchId] = value.split("_");
    setSelectedMockTest(mockTestId);
    setSelectedBatch(batchId);
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
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        FSCE Mock Test Reports
      </Typography>
      <FsceChildSelector 
        allChildren={allChildren}
        selectedChild={selectedChild}
        onSelectChild={handleChildSelect}
      />
      <Card>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={12}>
              <FormControl fullWidth disabled={!selectedChild || loading}>
                <InputLabel>Select Mock Test</InputLabel>
                <Select value={selectedMockTest && selectedBatch ? `${selectedMockTest}_${selectedBatch}` : ""} onChange={handleMockTestChange} label="Select Mock Test">
                  {loading ? (
                    <MenuItem value="">
                      <CircularProgress size={20} /> Loading...
                    </MenuItem>
                  ) : (
                    mockTests.map((test) => (
                      <MenuItem
                        key={`${test.mockTestId}_${test.selectedBatchId}`}
                        value={`${test.mockTestId}_${test.selectedBatchId}`}
                      >
                        {test.testName}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {loadingReport && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {reportData && !loadingReport && (
        <Box sx={{ mt: 4 }}>
            <FsceMainCom reportData={reportData} />
        </Box>
      )}
       {allReportData && !reportData && (
        <Box sx={{ mt: 4 }}>
            <FsceAllInOneMain 
                selectedChild={selectedChild}
                allChildren={allChildren}
                mockTestReports={allReportData}
                loading={loading}
                onViewDetail={handleViewDetail}
            />
        </Box>
      )}
      <MySnackbar ref={snackRef} />
    </Container>
  );
};

export default FsceReportPage;
