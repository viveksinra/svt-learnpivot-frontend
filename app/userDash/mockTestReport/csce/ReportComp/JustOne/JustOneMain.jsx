import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  Divider, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime, 
  LocationOn, 
  School, 
  BarChart,
  EmojiEvents,
  Person,
  Boy,
  Girl,
  Assessment
} from '@mui/icons-material';
import moment from 'moment';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  ScoreCard, 
  ChancesOfSelectionTable, 
  RankingTable, 
  ScoreDistributionChart, 
  TestHeader,
  calculateStandardizedScore,
  getStatusColor,
  getSelectionChance,
  getPerformanceGrade
} from '../Common';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Using utility functions from Common components

// Using ChancesOfSelectionTable component from Common

// Using ScoreCard component from Common

// Using RankingTable component from Common

// Using ScoreDistributionChart component from Common

const JustOneMain = ({ oneMockTestReport, allChildren, selectedChild }) => {
  // Find the selected child from allChildren array
  const currentChild = allChildren?.find(child => child._id === selectedChild);
  
  // Determine default tab based on child's gender
  const isGirl = oneMockTestReport?.childScore?.childGender === 'Girl';
  const defaultTab = isGirl ? 0 : 1; // 0 for girls, 1 for boys
  
  const [tabValue, setTabValue] = React.useState(defaultTab);
  console.log("allChildren");
  console.log(allChildren);
  console.log(selectedChild);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!oneMockTestReport || Object.keys(oneMockTestReport).length === 0) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h6">No report data available</Typography>
      </Box>
    );
  }

  const {
    childScore,
    mockTestDetails,
    batchDetails,
    englishMaxScore,
    mathsMaxScore,
    boysScoreThresholds,
    girlsScoreThresholds,
    createdAt,
    boysRanking,
    girlsRanking,
    performanceBoundaries,
    englishMean = 34.35675165,
    englishStdDev = 7.757773879,
    mathsMean = 27.49480642,
    mathsStdDev = 11.77128731,
    hideStandardisedScore = false
  } = oneMockTestReport;

  // Determine which thresholds to use based on gender and location
  // const isGirl = childScore.childGender === 'Girl'; // Already defined above
  const schoolLocation = mockTestDetails?.location?.label?.toLowerCase() || '';
  
  // Determine catchment area (defaulting to 'inside')
  const catchmentType = 'inside'; // This could be dynamic based on user input
  
  let thresholds = {};
  
  // Get appropriate school thresholds
  if (isGirl) {
    // For girls
    if (schoolLocation.includes('colchester')) {
      thresholds = girlsScoreThresholds.colchester[catchmentType];
    } else if (schoolLocation.includes('westcliff')) {
      thresholds = girlsScoreThresholds.westcliff[catchmentType];
    } else if (schoolLocation.includes('southend')) {
      thresholds = girlsScoreThresholds.southend[catchmentType];
    } else {
      // Default
      thresholds = girlsScoreThresholds.colchester[catchmentType];
    }
  } else {
    // For boys
    if (schoolLocation.includes('colchester')) {
      thresholds = boysScoreThresholds.colchester[catchmentType];
    } else if (schoolLocation.includes('westcliff')) {
      thresholds = boysScoreThresholds.westcliff[catchmentType];
    } else if (schoolLocation.includes('southend')) {
      thresholds = boysScoreThresholds.southend[catchmentType];
    } else if (schoolLocation.includes('kegs')) {
      thresholds = boysScoreThresholds.kegs[catchmentType];
    } else {
      // Default
      thresholds = boysScoreThresholds.colchester[catchmentType];
    }
  }

  const totalMaxScore = englishMaxScore + mathsMaxScore;
  const totalScore = childScore.englishScore + childScore.mathsScore;
  const standardizedScore = calculateStandardizedScore(childScore.mathsScore, childScore.englishScore, englishMean, englishStdDev, mathsMean, mathsStdDev);
  
  const englishStatus = getStatusColor(childScore.englishScore, thresholds);
  const mathsStatus = getStatusColor(childScore.mathsScore, thresholds);
  const totalStatus = getStatusColor(totalScore, thresholds);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header with test details */}
      <TestHeader 
        mockTestDetails={mockTestDetails}
        batchDetails={batchDetails}
        currentChild={currentChild}
        childScore={childScore}
        variant="detailed"
      />

      {/* Scores Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ScoreCard 
            title="English Score" 
            score={childScore.englishScore} 
            maxScore={englishMaxScore}
            genderRank={childScore.genderEnglishRank}
            overallRank={childScore.overallEnglishRank}
            totalGenderStudents={isGirl ? girlsRanking?.length || 0 : boysRanking?.length || 0}
            totalOverallStudents={(boysRanking?.length || 0) + (girlsRanking?.length || 0)}
            performanceBoundaries={performanceBoundaries}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ScoreCard 
            title="Mathematics Score" 
            score={childScore.mathsScore} 
            maxScore={mathsMaxScore}
            genderRank={childScore.genderMathRank}
            overallRank={childScore.overallMathRank}
            totalGenderStudents={isGirl ? girlsRanking?.length || 0 : boysRanking?.length || 0}
            totalOverallStudents={(boysRanking?.length || 0) + (girlsRanking?.length || 0)}
            performanceBoundaries={performanceBoundaries}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ScoreCard 
            title="Total Score" 
            score={totalScore} 
            maxScore={totalMaxScore}
            genderRank={childScore.genderTotalRank}
            overallRank={childScore.overallTotalRank}
            totalGenderStudents={isGirl ? girlsRanking?.length || 0 : boysRanking?.length || 0}
            totalOverallStudents={(boysRanking?.length || 0) + (girlsRanking?.length || 0)}
            performanceBoundaries={performanceBoundaries}
          />
        </Grid>
      </Grid>

      {/* Chances of Selection by School */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2, md: 3 }, mt: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          <School sx={{ mr: 1 }} /> Chances of Selection by School
        </Typography>
        
        <ChancesOfSelectionTable 
          childScore={childScore}
          isGirl={isGirl}
          schoolThresholds={isGirl ? girlsScoreThresholds : boysScoreThresholds}
          standardizedScore={standardizedScore}
          englishMean={englishMean}
          englishStdDev={englishStdDev}
          mathsMean={mathsMean}
          mathsStdDev={mathsStdDev}
          hideStandardisedScore={hideStandardisedScore}
          englishMaxScore={englishMaxScore}
          mathsMaxScore={mathsMaxScore}
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          *This table shows your child's selection chances at different schools, based on their current performance, CSSE data, and our judgement. It does not reflect their full potential.
        </Typography>
      </Paper>

    

      {/* Overall Ranking Tables with Tabs */}
      <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2, md: 3 }, mt: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          <Assessment sx={{ mr: 1 }} /> Overall Student Rankings
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="ranking tabs"
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                minWidth: { xs: 'auto', sm: 120 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                padding: { xs: '6px 8px', sm: '12px 16px' },
                '& .MuiSvgIcon-root': {
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  marginBottom: { xs: '2px', sm: '4px' }
                }
              }
            }}
          >
            <Tab icon={<Girl />} label="Girls Ranking" iconPosition="top" />
            <Tab icon={<Boy />} label="Boys Ranking" iconPosition="top" />
            <Tab icon={<BarChart />} label="Score Distribution" iconPosition="top" />
          </Tabs>
        </Box>
        
        {tabValue === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Girls Ranking (CSSE Style Mock Result - {moment(createdAt).format('DD MMMM YYYY')})
            </Typography>
            <RankingTable 
              data={girlsRanking || []} 
              isBoysTable={false} 
              currentChildId={childScore?.childId?.toString()} 
              currentChildName={currentChild?.childName || childScore?.childName}
              englishMaxScore={englishMaxScore}
              mathsMaxScore={mathsMaxScore}
              schoolThresholds={girlsScoreThresholds}
              englishMean={englishMean}
              englishStdDev={englishStdDev}
              mathsMean={mathsMean}
              mathsStdDev={mathsStdDev}
              hideStandardisedScore={hideStandardisedScore}
            />
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Boys Ranking (CSSE Style Mock Result - {moment(createdAt).format('DD MMMM YYYY')})
            </Typography>
            <RankingTable 
              data={boysRanking || []} 
              isBoysTable={true} 
              currentChildId={childScore?.childId?.toString()} 
              currentChildName={currentChild?.childName || childScore?.childName}
              englishMaxScore={englishMaxScore}
              mathsMaxScore={mathsMaxScore}
              schoolThresholds={boysScoreThresholds}
              englishMean={englishMean}
              englishStdDev={englishStdDev}
              mathsMean={mathsMean}
              mathsStdDev={mathsStdDev}
              hideStandardisedScore={hideStandardisedScore}
            />
          </Box>
        )}
        
        {tabValue === 2 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Score Distribution Analysis
            </Typography>
            <ScoreDistributionChart 
              boysRanking={boysRanking || []} 
              girlsRanking={girlsRanking || []} 
              englishMaxScore={englishMaxScore}
              mathsMaxScore={mathsMaxScore}
            />
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                This chart shows the distribution of total scores across all students who took this test.
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default JustOneMain;