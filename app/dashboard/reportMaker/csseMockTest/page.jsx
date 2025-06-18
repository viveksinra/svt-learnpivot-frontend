"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Box, Snackbar, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { mockTestService } from '@/app/services';
import MySnackbar from '@/app/Components/MySnackbar/MySnackbar';

// Import all components from the index file
import {
  PageHeader,
  MockTestSelection,
  BatchInformation,
  MaxScoresSection,
  StudentScoresTable,
  SaveButton,
  ResultsVisualization
} from './Comp';

// Utility function to calculate ranks
function calculateRanks(students, params = { englishMean: 34.35675165, englishStdDev: 7.757773879, mathsMean: 27.49480642, mathsStdDev: 11.77128731 }) {
  console.log('calculateRanks called with', students.length, 'students');
  // Helper to rank an array of students by a score key with tie-breaking logic
  function rankByKey(arr, key) {
    // Sort with tie-breaking logic
    const sorted = [...arr].sort((a, b) => {
      const scoreA = Number(a[key] || 0);
      const scoreB = Number(b[key] || 0);
      
      // Primary sort: higher score = better rank
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      
      // Tie-breaking for subject scores: younger child gets better rank
      if (a.childDob && b.childDob) {
        const dobA = new Date(a.childDob);
        const dobB = new Date(b.childDob);
        return dobB - dobA; // Younger child (later date) gets better rank
      }
      
      // If no DOB available, maintain original order
      return 0;
    });
    
         let currentRank = 1;
     return sorted.map((student, idx) => {
       // Since we've already sorted with tie-breaking, each student gets a unique rank
       return { id: student.id, rank: currentRank++ };
     });
  }

  // Helper to rank students by standardized score with specific tie-breaking logic
  function rankByTotalScore(arr) {
    // Sort with tie-breaking logic for standardized scores
    const sorted = [...arr].sort((a, b) => {
      const standardizedA = a.standardizedScore;
      const standardizedB = b.standardizedScore;
      
      // Primary sort: higher standardized score = better rank
      if (standardizedA !== standardizedB) {
        return standardizedB - standardizedA;
      }
      
      // First tie-breaker: better English score gets better rank
      const englishA = Number(a.englishScore || 0);
      const englishB = Number(b.englishScore || 0);
      if (englishA !== englishB) {
        return englishB - englishA;
      }
      
      // Second tie-breaker: younger child gets better rank
      if (a.childDob && b.childDob) {
        const dobA = new Date(a.childDob);
        const dobB = new Date(b.childDob);
        return dobB - dobA; // Younger child (later date) gets better rank
      }
      
      // If no DOB available, maintain original order
      return 0;
    });
    
         let currentRank = 1;
     return sorted.map((student, idx) => {
       // Since we've already sorted with tie-breaking, each student gets a unique rank
       return { id: student.id, rank: currentRank++ };
     });
  }

  // Calculate standardized scores using the new formula
  const studentsWithTotal = students.map(s => {
    const mathScore = Number(s.mathScore || 0);
    const englishScore = Number(s.englishScore || 0);
    
    // New standardization formula: Standardised score = (((raw score - μ) ÷ σ) × 15) + 100
    const englishStandardized = (((englishScore - params.englishMean) / params.englishStdDev) * 15) + 100;
    const mathStandardized = (((mathScore - params.mathsMean) / params.mathsStdDev) * 15) + 100;
    
    // Total score = 1.5 × (standardised English + standardised Mathematics)
    // Note: We're ignoring age adjustment as requested
    const standardizedScore = 1.5 * (englishStandardized + mathStandardized);
    
    return {
      ...s,
      totalScore: mathScore + englishScore, // Keep raw total for display
      standardizedScore: standardizedScore // New standardized score for ranking
    };
  });

  // Overall ranks
  const overallMathRanks = rankByKey(studentsWithTotal, 'mathScore');
  const overallEnglishRanks = rankByKey(studentsWithTotal, 'englishScore');
  const overallTotalRanks = rankByTotalScore(studentsWithTotal);

  // Gender-based ranks
  const boys = studentsWithTotal.filter(s => s.gender === 'Boy');
  const girls = studentsWithTotal.filter(s => s.gender === 'Girl');
  const genderMathRanks = [
    ...rankByKey(boys, 'mathScore'),
    ...rankByKey(girls, 'mathScore')
  ];
  const genderEnglishRanks = [
    ...rankByKey(boys, 'englishScore'),
    ...rankByKey(girls, 'englishScore')
  ];
  const genderTotalRanks = [
    ...rankByTotalScore(boys),
    ...rankByTotalScore(girls)
  ];

  // Helper to get rank by id
  const getRank = (arr, id) => arr.find(r => r.id === id)?.rank || 0;

  // Attach ranks to each student
  return studentsWithTotal.map(s => ({
    ...s,
    genderMathRank: getRank(genderMathRanks, s.id),
    genderEnglishRank: getRank(genderEnglishRanks, s.id),
    genderTotalRank: getRank(genderTotalRanks, s.id),
    overallMathRank: getRank(overallMathRanks, s.id),
    overallEnglishRank: getRank(overallEnglishRanks, s.id),
    overallTotalRank: getRank(overallTotalRanks, s.id),
  }));
}

const CSSEMockTestMaker = () => {
  const snackRef = useRef();
  const rankCalculationTimeoutRef = useRef();
  
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
  const [standardizationParams, setStandardizationParams] = useState({
    englishMean: 34.35675165,
    englishStdDev: 7.757773879,
    mathsMean: 27.49480642,
    mathsStdDev: 11.77128731
  });
  const [hideStandardisedScore, setHideStandardisedScore] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [performanceBoundaries, setPerformanceBoundaries] = useState({
    math: {
      excellent: 45,
      good: 35,
      average: 25
    },
    english: {
      excellent: 40,
      good: 30,
      average: 20
    }
  });
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isRecalculating, setIsRecalculating] = useState(false);
  // State for thresholds
  const [boysThresholds, setBoysThresholds] = useState({
    kegs: {
      inside: { safe: 90, borderline: 70 },
      outside: { safe: 90, borderline: 70 }
    },
    colchester: {
      inside: { safe: 85, borderline: 65 },
      outside: { safe: 90, borderline: 70 }
    },
    westcliff: {
      inside: { safe: 90, borderline: 70 },
      outside: { safe: 90, borderline: 70 }
    },
    southend: {
      inside: { safe: 90, borderline: 70 },
      outside: { safe: 90, borderline: 70 }
    }
  });
  const [girlsThresholds, setGirlsThresholds] = useState({
    colchester: {
      inside: { safe: 90, borderline: 70 },
      outside: { safe: 90, borderline: 70 }
    },
    westcliff: {
      inside: { safe: 90, borderline: 70 },
      outside: { safe: 90, borderline: 70 }
    },
    southend: {
      inside: { safe: 90, borderline: 70 },
      outside: { safe: 90, borderline: 70 }
    }
  });
  // State for available batches
  const [availableBatches, setAvailableBatches] = useState([]);
  // State to show form without calling API
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Fetch the list of available mock tests
  useEffect(() => {
    fetchPastMockTest()
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (rankCalculationTimeoutRef.current) {
        clearTimeout(rankCalculationTimeoutRef.current);
      }
    };
  }, []);

  // Note: Removed debounced rank calculation to avoid issues with ties during typing
  // Users can manually recalculate ranks using the "Recalculate Ranks" button

  async function fetchPastMockTest() {
    setLoading(true)
    try {
      const response = await mockTestService.getPastCsseMockTest();
      
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
        if(response.variant === "success"){
          // Update max scores from the report
          setMaxScores({
            math: response.data.mathsMaxScore,
            english: response.data.englishMaxScore
          });

          // Update standardization parameters from the report if they exist
          if (response.data.englishMean !== undefined && response.data.englishStdDev !== undefined && 
              response.data.mathsMean !== undefined && response.data.mathsStdDev !== undefined) {
            setStandardizationParams({
              englishMean: response.data.englishMean,
              englishStdDev: response.data.englishStdDev,
              mathsMean: response.data.mathsMean,
              mathsStdDev: response.data.mathsStdDev
            });
          }

          // Update hideStandardisedScore from the report if it exists
          if (response.data.hasOwnProperty('hideStandardisedScore')) {
            setHideStandardisedScore(response.data.hideStandardisedScore);
          } else {
            setHideStandardisedScore(false);
          }

          // Update publish status
          if (response.data.hasOwnProperty('isPublished')) {
            setIsPublished(response.data.isPublished);
          } else {
            setIsPublished(false);
          }

          // Update performance boundaries from the report if they exist
          if (response.data.performanceBoundaries) {
            setPerformanceBoundaries(response.data.performanceBoundaries);
          }

          // Update thresholds from the report if they exist
          if (response.data.boysScoreThresholds) {
            setBoysThresholds(response.data.boysScoreThresholds);
          }
          if (response.data.girlsScoreThresholds) {
            setGirlsThresholds(response.data.girlsScoreThresholds);
          }

          // Fetch students for this mock test and batch
          const studentsResponse = await mockTestService.getAllChildOfMockTest({
            mockTestId: selectedMockTest,
            batchId
          });

          if (studentsResponse.variant === "success" && studentsResponse.data) {
            // Map students with their scores from the report
            const studentsWithScores = studentsResponse.data.map(student => {
              const score = response.data.childScore.find(
                s => s.childId === student.childId
              );
              return {
                id: student.childId,
                name: student.childDetails.name,
                gender: student.childDetails.gender,
                year: student.childDetails.year,
                childDob: student.childDetails.dob,
                parentName: `${student.parentDetails.firstName} ${student.parentDetails.lastName}`,
                parentEmail: student.parentDetails.email,
                parentMobile: student.parentDetails.mobile,
                mathScore: score ? Number(score.mathsScore) : '',
                englishScore: score ? Number(score.englishScore) : '',
                // We won't use ranks from the API data since they might be outdated
                // We'll recalculate them instead
              };
            });
            // Calculate ranks using our utility function
            const rankedStudents = calculateRanks(studentsWithScores, standardizationParams);
            setStudents(rankedStudents);
          } else {
            setStudents([]);
            snackRef.current.handleSnack({
              severity: "info",
              message: studentsResponse.message || 'No students found for this mock test'
            });
          }
        } else {
          await fetchStudents(selectedMockTest, batchId);
        }
        // Fetch students associated with this mock test and batch
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
      
      
      
      if (response.variant === "success" && response.data && response.data.length > 0) {
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
            const { childScore, mathsMaxScore, englishMaxScore, boysScoreThresholds: reportBoysThresholds, girlsScoreThresholds: reportGirlsThresholds } = reportResponse.data;
            
            // Update max scores from the report
            setMaxScores({
              math: mathsMaxScore,
              english: englishMaxScore
            });
            
            // Update standardization parameters from the report if they exist
            if (reportResponse.data.englishMean !== undefined && reportResponse.data.englishStdDev !== undefined && 
                reportResponse.data.mathsMean !== undefined && reportResponse.data.mathsStdDev !== undefined) {
              setStandardizationParams({
                englishMean: reportResponse.data.englishMean,
                englishStdDev: reportResponse.data.englishStdDev,
                mathsMean: reportResponse.data.mathsMean,
                mathsStdDev: reportResponse.data.mathsStdDev
              });
            }
            
            // Update hideStandardisedScore from the report if it exists
            if (reportResponse.data.hasOwnProperty('hideStandardisedScore')) {
              setHideStandardisedScore(reportResponse.data.hideStandardisedScore);
            } else {
              setHideStandardisedScore(false);
            }

            // Update publish status
            if (reportResponse.data.hasOwnProperty('isPublished')) {
              setIsPublished(reportResponse.data.isPublished);
            } else {
              setIsPublished(false);
            }

            // Update performance boundaries from the report if they exist
            if (reportResponse.data.performanceBoundaries) {
              setPerformanceBoundaries(reportResponse.data.performanceBoundaries);
            }

            // Update thresholds from the report if they exist
            if (reportBoysThresholds) {
              setBoysThresholds(reportBoysThresholds);
            }
            if (reportGirlsThresholds) {
              setGirlsThresholds(reportGirlsThresholds);
            }
            
            // Map students with their scores
            studentsWithScores = response.data.map(student => {
              const score = childScore.find(score => score.childId === student.childId);
              return {
                id: student.childId,
                name: student.childDetails.name,
                gender: student.childDetails.gender,
                year: student.childDetails.year,
                childDob: student.childDetails.dob,
                parentName: `${student.parentDetails.firstName} ${student.parentDetails.lastName}`,
                parentEmail: student.parentDetails.email,
                parentMobile: student.parentDetails.mobile,
                mathScore: score?.mathsScore ?? '',
                englishScore: score?.englishScore ?? '',
                // We'll recalculate these ranks after getting all students
                genderMathRank: null,
                genderEnglishRank: null,
                genderTotalRank: null,
                overallMathRank: null,
                overallEnglishRank: null,
                overallTotalRank: null,
              };
            });
            
            // Calculate ranks using our utility function instead of using the API-provided ranks
            studentsWithScores = calculateRanks(studentsWithScores, standardizationParams);
          } else {
            // If no report exists, initialize with empty scores
            studentsWithScores = response.data.map(student => {
              return {
                id: student.childId,
                name: student.childDetails.name,
                gender: student.childDetails.gender,
                year: student.childDetails.year,
                childDob: student.childDetails.dob,
                parentName: `${student.parentDetails.firstName} ${student.parentDetails.lastName}`,
                parentEmail: student.parentDetails.email,
                parentMobile: student.parentDetails.mobile,
                mathScore: '',
                englishScore: '',
              };
            });
          }
        } else {
          // In create form mode, just initialize with empty scores
          studentsWithScores = response.data.map(student => {
            return {
              id: student.childId,
              name: student.childDetails.name,
              gender: student.childDetails.gender,
              year: student.childDetails.year,
              childDob: student.childDetails.dob,
              parentName: `${student.parentDetails.firstName} ${student.parentDetails.lastName}`,
              parentEmail: student.parentDetails.email,
              parentMobile: student.parentDetails.mobile,
              mathScore: '',
              englishScore: '',
            };
          });
        }
        
        setStudents(studentsWithScores);
      } else {
        // Handle case when no students are found
        
        // Check if we have the manual test student flag set
        if (response.data && response.data.length > 0) {
          // Process the data even if variant isn't success
          const manualStudentsWithScores = response.data.map(student => ({
            id: student.childId,
            name: student.childDetails.name,
            gender: student.childDetails.gender,
            year: student.childDetails.year,
            childDob: student.childDetails.dob,
            parentName: `${student.parentDetails.firstName} ${student.parentDetails.lastName}`,
            parentEmail: student.parentDetails.email,
            parentMobile: student.parentDetails.mobile,
            mathScore: '',
            englishScore: '',
          }));
          
          setStudents(manualStudentsWithScores);
        } else {
          setStudents([]);
        }
        
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
  const handleScoreChange = useCallback((studentId, subject, value) => {
    const numericValue = value === '' ? '' : Number(value);
    const maxValue = subject === 'math' ? maxScores.math : maxScores.english;
    
    // Don't allow scores greater than max
    if (numericValue !== '' && numericValue > maxValue) {
      return;
    }
    
    setStudents(prev => {
      const updated = prev.map(student => 
        student.id === studentId 
          ? { ...student, [`${subject}Score`]: numericValue } 
          : student
      );
      
      // Don't auto-calculate ranks during typing to avoid issues with ties
      // Users can manually recalculate ranks using the button
      return updated;
    });
  }, [maxScores.math, maxScores.english]);

  // Handle max score change
  const handleMaxScoreChange = (subject, value) => {
    const numericValue = value === '' ? 0 : Number(value);
    setMaxScores(prev => ({
      ...prev,
      [subject]: numericValue
    }));
  };

  // Handle performance boundary change
  const handlePerformanceBoundaryChange = (subject, grade, value) => {
    const numericValue = value === '' ? 0 : Number(value);
    setPerformanceBoundaries(prev => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [grade]: numericValue
      }
    }));
  };

  // Handle standardization parameter change
  const handleStandardizationParamChange = (paramType, value) => {
    const numericValue = value === '' ? 0 : Number(value);
    setStandardizationParams(prev => ({
      ...prev,
      [paramType]: numericValue
    }));
  };

  // Handle hide standardised score change
  const handleHideStandardisedScoreChange = (value) => {
    setHideStandardisedScore(value);
  };

  // Handle publish status change
  const handleIsPublishedChange = (value) => {
    setIsPublished(value);
  };

  // Create a new mock test with the selected ID - now just shows the form
  const handleCreateNew = () => {
    setShowCreateForm(true);
    // Fetch students for this mock test without creating a report
    fetchStudents(selectedMockTest, selectedBatch);
  };

  // Handle boys threshold change
  const handleBoysThresholdChange = (school, location, level, value) => {
    const numericValue = Number(value);
    setBoysThresholds(prev => ({
      ...prev,
      [school]: {
        ...prev[school],
        [location]: {
          ...prev[school][location],
          [level]: numericValue
        }
      }
    }));
  };

  // Handle girls threshold change
  const handleGirlsThresholdChange = (school, location, level, value) => {
    const numericValue = Number(value);
    setGirlsThresholds(prev => ({
      ...prev,
      [school]: {
        ...prev[school],
        [location]: {
          ...prev[school][location],
          [level]: numericValue
        }
      }
    }));
  };

  // Update the handleSaveChanges function to include thresholds
  const handleSaveChanges = async () => {
    try {
      setActionLoading(true);
      
      // Always recalculate ranks before saving to ensure accuracy
      const rankedStudents = calculateRanks(students, standardizationParams);
      
      // Prepare scores for all students with ranks
      const childScoreData = rankedStudents.map(student => ({
        childId: student.id,
        childGender: student.gender,
        childDob: student.childDob,
        mathsScore: student.mathScore === '' ? 0 : Number(student.mathScore),
        englishScore: student.englishScore === '' ? 0 : Number(student.englishScore),
        genderMathRank: student.genderMathRank,
        genderEnglishRank: student.genderEnglishRank,
        genderTotalRank: student.genderTotalRank,
        overallMathRank: student.overallMathRank,
        overallEnglishRank: student.overallEnglishRank,
        overallTotalRank: student.overallTotalRank,
      }));
      
      // Create a new mock test report with the current scores
      const mockTestData = {
        mockTestId: selectedMockTest,
        batchId: selectedBatch,
        mathsMaxScore: maxScores.math,
        englishMaxScore: maxScores.english,
        englishMean: standardizationParams.englishMean,
        englishStdDev: standardizationParams.englishStdDev,
        mathsMean: standardizationParams.mathsMean,
        mathsStdDev: standardizationParams.mathsStdDev,
        hideStandardisedScore,
        isPublished,
        performanceBoundaries,
        childScore: childScoreData,
        boysScoreThresholds: boysThresholds,
        girlsScoreThresholds: girlsThresholds
      };
      
      // Make the API call using the service
      const response = await mockTestService.addCsseMockReport(mockTestData);
      
      if (response.variant === "success") {
        // Update students with the ranked data instead of fetching again
        setStudents(rankedStudents);
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

  // Update the handleSave function to include thresholds
  const handleSave = async () => {
    try {
      setActionLoading(true);
      
      // Always recalculate ranks before saving to ensure accuracy
      const rankedStudents = calculateRanks(students, standardizationParams);
      
      // Format the data according to the API requirements with ranks
      const childScoreData = rankedStudents.map(student => ({
        childId: student.id,
        childGender: student.gender,
        mathsScore: student.mathScore === '' ? 0 : Number(student.mathScore),
        englishScore: student.englishScore === '' ? 0 : Number(student.englishScore),
        genderMathRank: student.genderMathRank,
        genderEnglishRank: student.genderEnglishRank,
        genderTotalRank: student.genderTotalRank,
        overallMathRank: student.overallMathRank,
        overallEnglishRank: student.overallEnglishRank,
        overallTotalRank: student.overallTotalRank,
      }));
      
      // Prepare the data for submission using the required API format
      const mockTestData = {
        mockTestId: selectedMockTest,
        batchId: selectedBatch,
        mathsMaxScore: maxScores.math,
        englishMaxScore: maxScores.english,
        englishMean: standardizationParams.englishMean,
        englishStdDev: standardizationParams.englishStdDev,
        mathsMean: standardizationParams.mathsMean,
        mathsStdDev: standardizationParams.mathsStdDev,
        hideStandardisedScore,
        isPublished,
        performanceBoundaries,
        childScore: childScoreData,
        boysScoreThresholds: boysThresholds,
        girlsScoreThresholds: girlsThresholds
      };
      
      // Make the API call using the service
      const response = await mockTestService.addCsseMockReport(mockTestData);
      
      if (response.variant === "success") {
        // Show success message using the snackbar ref
        snackRef.current.handleSnack({
          severity: "success",
          message: response.message || 'Mock test scores saved successfully'
        });
        
        // Update students with the ranked data instead of fetching again
        setStudents(rankedStudents);
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

  // Function to reload student data
  const handleReloadStudents = () => {
    if (selectedMockTest && selectedBatch) {
      fetchStudents(selectedMockTest, selectedBatch);
    }
  };

  // Function to manually recalculate ranks
  const handleRecalculateRanks = useCallback(() => {
    if (students && students.length > 0) {
      setIsRecalculating(true);
      console.log('Recalculating ranks for students:', students.length);
      const rankedStudents = calculateRanks(students, standardizationParams);
      console.log('Ranks recalculated successfully');
      setStudents(rankedStudents);
      
      // Reset recalculating state and show success message after a short delay
      setTimeout(() => {
        setIsRecalculating(false);
        snackRef.current.handleSnack({
          severity: "success",
          message: `Ranks recalculated successfully for ${students.length} students`
        });
      }, 1000);
    }
  }, [students, standardizationParams]);

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
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="mock-test-selection-content"
          id="mock-test-selection-header"
        >
          <Typography variant="h6" fontWeight="bold">
            Mock Test & Batch Selection
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
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
        </AccordionDetails>
      </Accordion>

      {/* Batch Information */}
      {selectedMockTest && selectedBatch && availableBatches.length > 0 && (
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="batch-information-content"
            id="batch-information-header"
          >
            <Typography variant="h6" fontWeight="bold">
              Batch Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BatchInformation
              selectedBatch={selectedBatch}
              availableBatches={availableBatches}
              students={students}
            />
          </AccordionDetails>
        </Accordion>
      )}
     {/* Max Scores Section - SHOW FIRST  */}
     {selectedMockTest && selectedBatch && (mockTestExists || showCreateForm) && (
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="max-scores-content"
            id="max-scores-header"
          >
            <Typography variant="h6" fontWeight="bold">
              Configuration & Thresholds
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <MaxScoresSection
              maxScores={maxScores}
              handleMaxScoreChange={handleMaxScoreChange}
              standardizationParams={standardizationParams}
              handleStandardizationParamChange={handleStandardizationParamChange}
              hideStandardisedScore={hideStandardisedScore}
              handleHideStandardisedScoreChange={handleHideStandardisedScoreChange}
              isPublished={isPublished}
              handleIsPublishedChange={handleIsPublishedChange}
              performanceBoundaries={performanceBoundaries}
              handlePerformanceBoundaryChange={handlePerformanceBoundaryChange}
              actionLoading={actionLoading}
              boysThresholds={boysThresholds}
              handleBoysThresholdChange={handleBoysThresholdChange}
              girlsThresholds={girlsThresholds}
              handleGirlsThresholdChange={handleGirlsThresholdChange}
            />
          </AccordionDetails>
        </Accordion>
      )}

      {/* Student Scores Table - SHOW SECOND  */}
      {selectedMockTest && selectedBatch && (mockTestExists || showCreateForm) && (
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="student-scores-content"
            id="student-scores-header"
          >
            <Typography variant="h6" fontWeight="bold">
              Student Scores & Rankings
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <StudentScoresTable
              students={students}
              maxScores={maxScores}
              actionLoading={actionLoading}
              handleScoreChange={handleScoreChange}
              onReloadStudents={handleReloadStudents}
            />
          </AccordionDetails>
        </Accordion>
      )}

      {/* Results Visualization */}
      {selectedMockTest && selectedBatch && mockTestExists && students.length > 0 && (
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="results-visualization-content"
            id="results-visualization-header"
          >
            <Typography variant="h6" fontWeight="bold">
              Results Visualization & Analytics
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ResultsVisualization
              students={students}
              maxScores={maxScores}
            />
          </AccordionDetails>
        </Accordion>
      )}

 

      {/* Save Button */}
      {selectedMockTest && selectedBatch && (
        <SaveButton
          mockTestExists={mockTestExists}
          showCreateForm={showCreateForm}
          actionLoading={actionLoading}
          handleSave={handleSave}
          handleSaveChanges={handleSaveChanges}
          onRecalculateRanks={handleRecalculateRanks}
          students={students}
          isRecalculating={isRecalculating}
        />
      )}

      {/* Snackbar for feedback */}
      <MySnackbar ref={snackRef} />
    </Box>
  );
};

export default CSSEMockTestMaker;
