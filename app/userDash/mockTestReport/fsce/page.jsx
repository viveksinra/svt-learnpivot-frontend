"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Chip,
  Stack,
} from "@mui/material";
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

  // Handle selection via chip clicks
  const handleMockTestSelect = (mockTestId, batchId) => {
    setSelectedMockTest(mockTestId);
    setSelectedBatch(batchId);
    setReportData(null);
  };

  const handleAllSelect = () => {
    setSelectedMockTest("");
    setSelectedBatch("");
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
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip
                label="All"
                clickable
                disabled={!selectedChild}
                color={!selectedMockTest && !selectedBatch ? "primary" : "default"}
                onClick={handleAllSelect}
              />
              {mockTests.map((test) => (
                <Chip
                  key={`${test.mockTestId}_${test.batchId}`}
                  label={`${test.mockTestTitle || test.testName} (${test.date})`}
                  clickable
                  disabled={!selectedChild}
                  color={selectedMockTest === test.mockTestId && selectedBatch === test.batchId ? "primary" : "default"}
                  onClick={() => handleMockTestSelect(test.mockTestId, test.batchId)}
                  sx={{ mt: 1 }}
                />
              ))}
            </Stack>
          )}
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
