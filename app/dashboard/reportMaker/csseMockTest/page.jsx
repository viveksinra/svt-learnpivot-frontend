"use client";
import { useState, useEffect, useRef } from 'react';
import { Box, Snackbar } from '@mui/material';
import { mockTestService } from '@/app/services';
import MySnackbar from '@/app/Components/MySnackbar/MySnackbar';

// Import all components from the index file
import {
  PageHeader,
  MockTestSelection,
  BatchInformation,
  MaxScoresSection,
  StudentScoresTable,
  SaveButton
} from './Comp';

const CSSEMockTestMaker = () => {
  const snackRef = useRef();
  
  // State management
  const [mockTests, setMockTests] = useState([]);
  const [selectedMockTest, setSelectedMockTest] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [mockTestExists, setMockTestExists] = useState(false);
  const [students, setStudents] = useState([]);
  const [maxScores, setMaxScores] = useState({
    math: 80,
    english: 70
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  // State for available batches
  const [availableBatches, setAvailableBatches] = useState([]);
  // State to show form without calling API
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch the list of available mock tests
  useEffect(() => {
    fetchPastMockTest()
  }, [])

  async function fetchPastMockTest() {
    setLoading(true)
    try {
      const response = await mockTestService.getCssePastMockTest();
      if(response.variant === "success"){
        setLoading(false)
        // Process mock tests and filter past batches
        const processedTests = response.data.map(test => {
          const currentDate = new Date();
          // Filter past batches (dates that have already occurred)
          const pastBatches = test.batch.filter(batch => {
            const batchDate = new Date(batch.date);
            return batchDate < currentDate;
          });
          
          return {
            ...test,
            pastBatches
          };
        });
        
        setMockTests(processedTests);
      } else {
        console.log(response); 
        setLoading(false);
        setSnackbar({
          open: true,
          message: response.message || 'Failed to fetch mock tests',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error fetching mock tests:', error);
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Failed to fetch mock tests',
        severity: 'error'
      });
    }
  }
  
  // Handle mock test selection
  const handleMockTestChange = async (event) => {
    const mockTestId = event.target.value;
    setSelectedMockTest(mockTestId);
    setSelectedBatch(''); // Reset batch selection
    setShowCreateForm(false); // Reset form state
    
    if (mockTestId) {
      // Find the selected test and get its batches
      const selectedTest = mockTests.find(test => test._id === mockTestId);
      if (selectedTest && selectedTest.pastBatches) {
        setAvailableBatches(selectedTest.pastBatches);
      } else {
        setAvailableBatches([]);
      }
    } else {
      setMockTestExists(false);
      setStudents([]);
      setAvailableBatches([]);
    }
  };

  // Handle batch selection
  const handleBatchChange = async (event) => {
    const batchId = event.target.value;
    setSelectedBatch(batchId);
    setShowCreateForm(false); // Reset form state when changing batches
    
    if (batchId) {
      try {
        setActionLoading(true);
        // Check if the mock test report exists for this batch
        const response = await mockTestService.getCsseMockReport({
          mockTestId: selectedMockTest,
          batchId
        });
        
        setMockTestExists(response.variant === "success");
        
        // Fetch students associated with this mock test and batch
        await fetchStudents(selectedMockTest, batchId);
      } catch (error) {
        console.error('Error checking mock test:', error);
        setMockTestExists(false);
        snackRef.current.handleSnack({
          severity: "error",
          message: 'Failed to load mock test data'
        });
      } finally {
        setActionLoading(false);
      }
    } else {
      setMockTestExists(false);
      setStudents([]);
    }
  };

  // Fetch students for a mock test
  const fetchStudents = async (mockTestId, batchId) => {
    try {
      setActionLoading(true);
      // Use the service to fetch students for the mock test
      const response = await mockTestService.getAllChildOfMockTest({
        mockTestId,
        batchId
      });
      
      if (response.variant === "success") {
        // Only check for existing report if not in create form mode
        let studentsWithScores = [];
        
        if (!showCreateForm) {
          // Get existing scores if available
          const reportResponse = await mockTestService.getCsseMockReport({
            mockTestId,
            batchId
          });
          
          if (reportResponse.variant === "success") {
            // If report exists, use the scores from it
            const { childScore, mathsMaxScore, englishMaxScore } = reportResponse.data;
            
            // Update max scores from the report
            setMaxScores({
              math: mathsMaxScore,
              english: englishMaxScore
            });
            
            // Map students with their scores
            studentsWithScores = response.data.map(student => ({
              id: student.childId,
              name: student.childDetails.name,
              gender: student.childDetails.gender,
              year: student.childDetails.year,
              parentName: `${student.parentDetails.firstName} ${student.parentDetails.lastName}`,
              parentEmail: student.parentDetails.email,
              parentMobile: student.parentDetails.mobile,
              mathScore: childScore.find(score => score.childId === student.childId)?.mathsScore ?? '',
              englishScore: childScore.find(score => score.childId === student.childId)?.englishScore ?? '',
            }));
          } else {
            // If no report exists, initialize with empty scores
            studentsWithScores = response.data.map(student => ({
              id: student.childId,
              name: student.childDetails.name,
              gender: student.childDetails.gender,
              year: student.childDetails.year,
              parentName: `${student.parentDetails.firstName} ${student.parentDetails.lastName}`,
              parentEmail: student.parentDetails.email,
              parentMobile: student.parentDetails.mobile,
              mathScore: '',
              englishScore: '',
            }));
          }
        } else {
          // In create form mode, just initialize with empty scores
          studentsWithScores = response.data.map(student => ({
            id: student.childId,
            name: student.childDetails.name,
            gender: student.childDetails.gender,
            year: student.childDetails.year,
            parentName: `${student.parentDetails.firstName} ${student.parentDetails.lastName}`,
            parentEmail: student.parentDetails.email,
            parentMobile: student.parentDetails.mobile,
            mathScore: '',
            englishScore: '',
          }));
        }
        
        setStudents(studentsWithScores);
      } else {
        // Handle case when no students are found
        setStudents([]);
        snackRef.current.handleSnack({
          severity: "info",
          message: response.message || 'No students found for this mock test'
        });
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
      snackRef.current.handleSnack({
        severity: "error",
        message: 'Failed to fetch student data'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle score change for a student
  const handleScoreChange = (studentId, subject, value) => {
    const numericValue = value === '' ? '' : Number(value);
    const maxValue = subject === 'math' ? maxScores.math : maxScores.english;
    
    // Don't allow scores greater than max
    if (numericValue !== '' && numericValue > maxValue) {
      return;
    }
    
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, [`${subject}Score`]: numericValue } 
          : student
      )
    );
  };

  // Handle max score change
  const handleMaxScoreChange = (subject, value) => {
    const numericValue = value === '' ? 0 : Number(value);
    setMaxScores(prev => ({
      ...prev,
      [subject]: numericValue
    }));
  };

  // Create a new mock test with the selected ID - now just shows the form
  const handleCreateNew = () => {
    setShowCreateForm(true);
    // Fetch students for this mock test without creating a report
    fetchStudents(selectedMockTest, selectedBatch);
  };

  // New function to actually save the created test when user clicks save
  const handleSaveChanges = async () => {
    try {
      setActionLoading(true);
      
      // Prepare scores for all students
      const childScoreData = students.map(student => ({
        childId: student.id,
        mathsScore: student.mathScore === '' ? 0 : Number(student.mathScore),
        englishScore: student.englishScore === '' ? 0 : Number(student.englishScore)
      }));
      
      // Create a new mock test report with the current scores
      const mockTestData = {
        mockTestId: selectedMockTest,
        batchId: selectedBatch,
        mathsMaxScore: maxScores.math,
        englishMaxScore: maxScores.english,
        childScore: childScoreData
      };
      
      // Make the API call using the service
      const response = await mockTestService.addCsseMockReport(mockTestData);
      
      if (response.variant === "success") {
        // Fetch students again to get the updated report
        await fetchStudents(selectedMockTest, selectedBatch);
        setMockTestExists(true);
        setShowCreateForm(false); // Hide form after successful save
        
        // Show success message using the snackbar ref
        snackRef.current.handleSnack({
          severity: "success",
          message: response.message || 'New mock test report created successfully'
        });
      } else {
        // Show error message
        snackRef.current.handleSnack({
          severity: "error",
          message: response.message || 'Failed to create new mock test report'
        });
      }
    } catch (error) {
      console.error('Error saving mock test:', error);
      // Show error message
      snackRef.current.handleSnack({
        severity: "error",
        message: 'Failed to create new mock test report'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Update the save function to use the snackbar ref
  const handleSave = async () => {
    try {
      setActionLoading(true);
      
      // Format the data according to the API requirements
      const childScoreData = students.map(student => ({
        childId: student.id,
        mathsScore: student.mathScore === '' ? 0 : Number(student.mathScore),
        englishScore: student.englishScore === '' ? 0 : Number(student.englishScore)
      }));
      
      // Prepare the data for submission using the required API format
      const mockTestData = {
        mockTestId: selectedMockTest,
        batchId: selectedBatch,
        mathsMaxScore: maxScores.math,
        englishMaxScore: maxScores.english,
        childScore: childScoreData
      };
      
      // Make the API call using the service
      const response = await mockTestService.addCsseMockReport(mockTestData);
      
      if (response.variant === "success") {
        // Show success message using the snackbar ref
        snackRef.current.handleSnack({
          severity: "success",
          message: response.message || 'Mock test scores saved successfully'
        });
        
        // Refresh the mock test data
        await fetchStudents(selectedMockTest, selectedBatch);
        setMockTestExists(true);
      } else {
        // Show error message
        snackRef.current.handleSnack({
          severity: "error",
          message: response.message || 'Failed to save mock test scores'
        });
      }
    } catch (error) {
      console.error('Error saving mock test scores:', error);
      // Show error message
      snackRef.current.handleSnack({
        severity: "error",
        message: 'Failed to save mock test scores'
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box sx={{
      p: { xs: 1, sm: 2 },
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #f8fafc 0%, #e0e7ef 100%)',
    }}>
      {/* Page Header */}
      <PageHeader actionLoading={actionLoading} />
      
      {/* Mock Test Selection */}
      <MockTestSelection
        mockTests={mockTests}
        selectedMockTest={selectedMockTest}
        selectedBatch={selectedBatch}
        availableBatches={availableBatches}
        mockTestExists={mockTestExists}
        loading={loading}
        actionLoading={actionLoading}
        showCreateForm={showCreateForm}
        handleMockTestChange={handleMockTestChange}
        handleBatchChange={handleBatchChange}
        handleCreateNew={handleCreateNew}
      />

      {/* Batch Information */}
      {selectedMockTest && selectedBatch && availableBatches.length > 0 && (
        <BatchInformation
          selectedBatch={selectedBatch}
          availableBatches={availableBatches}
        />
      )}

      {/* Max Scores Section */}
      {selectedMockTest && selectedBatch && (mockTestExists || showCreateForm) && (
        <MaxScoresSection
          maxScores={maxScores}
          handleMaxScoreChange={handleMaxScoreChange}
          actionLoading={actionLoading}
        />
      )}

      {/* Student Scores Table */}
      {selectedMockTest && selectedBatch && (mockTestExists || showCreateForm) && (
        <StudentScoresTable
          students={students}
          maxScores={maxScores}
          actionLoading={actionLoading}
          handleScoreChange={handleScoreChange}
        />
      )}

      {/* Save Button */}
      {selectedMockTest && selectedBatch && (
        <SaveButton
          mockTestExists={mockTestExists}
          showCreateForm={showCreateForm}
          actionLoading={actionLoading}
          handleSave={handleSave}
          handleSaveChanges={handleSaveChanges}
        />
      )}

      {/* Snackbar for feedback */}
      <MySnackbar ref={snackRef} />
    </Box>
  );
};

export default CSSEMockTestMaker;
