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

const getStatusColor = (score, thresholds) => {
  if (score >= thresholds.safe) return { color: '#2e7d32', label: 'Safe', background: '#e8f5e9' };
  if (score >= thresholds.borderline) return { color: '#ed6c02', label: 'Borderline', background: '#fff3e0' };
  return { color: '#d32f2f', label: 'Concern', background: '#ffebee' };
};

const getSelectionChance = (score, threshold) => {
  if (!threshold) return 'N/A';
  if (score >= threshold.safe) return 'Safe';
  if (score >= threshold.borderline) return 'Borderline';
  return 'Concern';
};

const ChancesOfSelectionTable = ({ childScore, isGirl, schoolThresholds, totalScore }) => {
  // Get relevant school types for the gender
  const schoolTypes = isGirl 
    ? ['Colchester Girls', 'Westcliff Girls', 'Southend Girls'] 
    : ['KEGS', 'Colchester Boys', 'Westcliff Boys', 'Southend Boys'];
  
  // Get cell color based on status
  const getStatusCellStyle = (status) => {
    if (status === 'Safe') return { backgroundColor: '#e8f5e9', color: '#2e7d32', fontWeight: 'medium' };
    if (status === 'Borderline') return { backgroundColor: '#fff3e0', color: '#ed6c02', fontWeight: 'medium' };
    if (status === 'Concern') return { backgroundColor: '#ffebee', color: '#d32f2f', fontWeight: 'medium' };
    return {};
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', mb: 2, mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell colSpan={9} align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              Chances of selection
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            {schoolTypes.map(school => (
              <TableCell colSpan={2} align="center" key={school} sx={{ fontWeight: 'medium' }}>
                {school}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell></TableCell>
            {schoolTypes.map(school => (
              <React.Fragment key={`${school}-catchment`}>
                <TableCell align="center" sx={{ fontWeight: 'medium' }}>Inside Catchment</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'medium' }}>Outside Catchment</TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={{ fontWeight: 'medium' }}>{totalScore}</TableCell>
            {schoolTypes.map(school => {
              // Convert school name to key for thresholds
              const schoolKey = school.toLowerCase().split(' ')[0];
              
              const insideStatus = getSelectionChance(totalScore, schoolThresholds?.[schoolKey]?.inside);
              const outsideStatus = getSelectionChance(totalScore, schoolThresholds?.[schoolKey]?.outside);
              
              return (
                <React.Fragment key={`${school}-status`}>
                  <TableCell align="center" sx={getStatusCellStyle(insideStatus)}>
                    {insideStatus}
                  </TableCell>
                  <TableCell align="center" sx={getStatusCellStyle(outsideStatus)}>
                    {outsideStatus}
                  </TableCell>
                </React.Fragment>
              );
            })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ScoreCard = ({ title, score, maxScore, rank, statusColor }) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" component="span" sx={{ fontWeight: 'bold', color: statusColor.color }}>
            {score}
          </Typography>
          <Typography variant="body1" component="span" sx={{ ml: 1 }}>
            / {maxScore}
          </Typography>
        </Box>
        <Box sx={{ mt: 2, mb: 1.5 }}>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ 
              height: 10, 
              borderRadius: 5,
              backgroundColor: 'rgba(0,0,0,0.05)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 5,
                backgroundColor: statusColor.color,
              }
            }} 
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Chip 
            size="small" 
            label={`${percentage.toFixed(0)}%`} 
            sx={{ 
              backgroundColor: statusColor.background, 
              color: statusColor.color,
              fontWeight: 'bold'
            }} 
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEvents fontSize="small" sx={{ color: '#ffc107', mr: 0.5 }} />
            <Typography variant="body2">Rank: {rank}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const RankingTable = ({ data, isBoysTable, currentChildId, englishMaxScore, mathsMaxScore, schoolThresholds }) => {
  // Get relevant school types based on gender
  const schoolTypes = isBoysTable 
    ? ['KEGS', 'Colchester', 'Westcliff', 'Southend'] 
    : ['Colchester', 'Westcliff', 'Southend'];

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', mb: 3, overflowX: 'auto' }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: isBoysTable ? '#e3f2fd' : '#fce4ec' }}>
            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Rank</TableCell>
            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Maths</TableCell>
            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>English</TableCell>
            <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Total</TableCell>
            {schoolTypes.map(school => (
              <TableCell 
                key={school} 
                align="center" 
                sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
              >
                {school}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((child, index) => {
            const isCurrentChild = child.childId.toString() === currentChildId;
            const totalScore = child.mathsScore + child.englishScore;

            return (
              <TableRow key={index} sx={{ 
                backgroundColor: isCurrentChild ? (isBoysTable ? '#e3f2fd55' : '#fce4ec55') : 'inherit',
                '&:hover': { backgroundColor: isCurrentChild ? (isBoysTable ? '#e3f2fd88' : '#fce4ec88') : '#f5f5f5' }
              }}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isBoysTable ? `Boy ${child.rank}` : `Girl ${child.rank}`}
                    {isCurrentChild && (
                      <Chip size="small" label="You" 
                        sx={{ ml: 1, backgroundColor: isBoysTable ? '#2196f3' : '#e91e63', color: 'white', height: 20 }} 
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>{child.mathsScore}</TableCell>
                <TableCell>{child.englishScore}</TableCell>
                <TableCell sx={{ fontWeight: isCurrentChild ? 'bold' : 'normal' }}>
                  {totalScore}
                </TableCell>
                
                {/* School-specific status chips */}
                {schoolTypes.map(school => {
                  const schoolKey = school.toLowerCase();
                  // Assuming inside catchment area for all students
                  const status = getSelectionChance(totalScore, schoolThresholds?.[schoolKey]?.inside);
                  
                  return (
                    <TableCell key={`${child.childId}-${school}`} align="center">
                      <Chip 
                        size="small" 
                        label={status} 
                        sx={{ 
                          backgroundColor: 
                            status === 'Safe' ? '#e8f5e9' : 
                            status === 'Borderline' ? '#fff3e0' : 
                            status === 'Concern' ? '#ffebee' : '#f5f5f5',
                          color: 
                            status === 'Safe' ? '#2e7d32' : 
                            status === 'Borderline' ? '#ed6c02' : 
                            status === 'Concern' ? '#d32f2f' : '#757575',
                          height: 20,
                          fontSize: '0.7rem'
                        }} 
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const ScoreDistributionChart = ({ boysRanking, girlsRanking, englishMaxScore, mathsMaxScore }) => {
  // Format data for chart
  const allScores = [...boysRanking, ...girlsRanking].map(child => child.mathsScore + child.englishScore);
  
  // Create bins for score ranges
  const bins = [
    '40-50', '51-60', '61-70', '71-80', '81-90', '91-100', '101-110'
  ];
  
  const scoreDistribution = bins.map(bin => {
    const [min, max] = bin.split('-').map(Number);
    return allScores.filter(score => score >= min && score <= max).length;
  });

  const data = {
    labels: bins,
    datasets: [
      {
        label: 'Number of students',
        data: scoreDistribution,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Score Distribution',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Score Range',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Students',
        },
        beginAtZero: true,
      },
    },
  };

  return <Box sx={{ height: 300, mt: 2 }}><Chart type='bar' data={data} options={options} /></Box>;
};

const JustOneMain = ({ oneMockTestReport, allChildren, selectedChild }) => {
  const [tabValue, setTabValue] = React.useState(0);
  console.log("allChildren");
  console.log(allChildren);
  console.log(selectedChild);

  // Find the selected child from allChildren array
  const currentChild = allChildren?.find(child => child._id === selectedChild);
  
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
    girlsRanking
  } = oneMockTestReport;

  // Determine which thresholds to use based on gender and location
  const isGirl = childScore.childGender === 'Girl';
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
  
  const englishStatus = getStatusColor(childScore.englishScore, thresholds);
  const mathsStatus = getStatusColor(childScore.mathsScore, thresholds);
  const totalStatus = getStatusColor(totalScore, thresholds);

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header with test details */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {mockTestDetails?.title || 'Mock Test'}
            </Typography>
            {mockTestDetails?.highlightedText && (
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                {mockTestDetails.highlightedText}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, md: 0 } }}>
            <Avatar sx={{ bgcolor: '#f5f5f5', color: 'primary.main', mr: 1 }}>
              <Person />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Student</Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {currentChild?.childName || childScore?.childName || 'Student Name'}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {currentChild?.childGender || childScore?.childGender || 'Gender'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarToday fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body2">
                Date: {batchDetails?.date ? moment(batchDetails.date).format('DD MMM YYYY') : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body2">
                Time: {batchDetails?.startTime || 'N/A'} - {batchDetails?.endTime || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <School fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              <Typography variant="body2">
                Test Type: {mockTestDetails?.testType?.label || 'N/A'}
              </Typography>
            </Box>
          </Grid>
          {mockTestDetails?.location && (
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOn fontSize="small" sx={{ color: 'primary.main', mr: 1, mt: 0.5 }} />
                <Typography variant="body2">
                  Location: {mockTestDetails.location.label}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Scores Section */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ScoreCard 
            title="English Score" 
            score={childScore.englishScore} 
            maxScore={englishMaxScore}
            rank={childScore.genderEnglishRank}
            statusColor={englishStatus}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ScoreCard 
            title="Maths Score" 
            score={childScore.mathsScore} 
            maxScore={mathsMaxScore}
            rank={childScore.genderMathRank}
            statusColor={mathsStatus}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ScoreCard 
            title="Total Score" 
            score={totalScore} 
            maxScore={totalMaxScore}
            rank={childScore.genderTotalRank}
            statusColor={totalStatus}
          />
        </Grid>
      </Grid>

      {/* Chances of Selection by School */}
      <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <School sx={{ mr: 1 }} /> Chances of Selection by School
        </Typography>
        
        <ChancesOfSelectionTable 
          childScore={childScore}
          isGirl={isGirl}
          schoolThresholds={isGirl ? girlsScoreThresholds : boysScoreThresholds}
          totalScore={totalScore}
        />
        
        <Typography variant="body2" color="text.secondary">
          This table shows your chances of selection at different schools based on your current performance and their historical acceptance thresholds.
        </Typography>
      </Paper>

      {/* Ranking Table */}
      <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <BarChart sx={{ mr: 1 }} /> Ranking Analysis
        </Typography>
        
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Gender Rank</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Overall Rank</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>English</TableCell>
                <TableCell align="center">{childScore.genderEnglishRank}</TableCell>
                <TableCell align="center">{childScore.overallEnglishRank}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Mathematics</TableCell>
                <TableCell align="center">{childScore.genderMathRank}</TableCell>
                <TableCell align="center">{childScore.overallMathRank}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'medium' }}>Total</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'medium' }}>{childScore.genderTotalRank}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'medium' }}>{childScore.overallTotalRank}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Report generated on {moment(createdAt).format('DD MMM YYYY, h:mm A')}
          </Typography>
        </Box>
      </Paper>

      {/* Overall Ranking Tables with Tabs */}
      <Paper elevation={0} sx={{ p: 3, mt: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 1 }} /> Overall Student Rankings
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="ranking tabs"
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab icon={<Boy />} label="Boys Ranking" />
            <Tab icon={<Girl />} label="Girls Ranking" />
            <Tab icon={<BarChart />} label="Score Distribution" />
          </Tabs>
        </Box>
        
        {tabValue === 0 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Boys Ranking (CSSE Style Mock Result - {moment(createdAt).format('DD MMMM YYYY')})
            </Typography>
            <RankingTable 
              data={boysRanking || []} 
              isBoysTable={true} 
              currentChildId={childScore?.childId?.toString()} 
              englishMaxScore={englishMaxScore}
              mathsMaxScore={mathsMaxScore}
              schoolThresholds={boysScoreThresholds}
            />
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Girls Ranking (CSSE Style Mock Result - {moment(createdAt).format('DD MMMM YYYY')})
            </Typography>
            <RankingTable 
              data={girlsRanking || []} 
              isBoysTable={false} 
              currentChildId={childScore?.childId?.toString()} 
              englishMaxScore={englishMaxScore}
              mathsMaxScore={mathsMaxScore}
              schoolThresholds={girlsScoreThresholds}
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