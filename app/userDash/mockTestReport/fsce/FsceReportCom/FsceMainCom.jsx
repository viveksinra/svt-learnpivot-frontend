"use client"
import React, { useState } from 'react';
import {
  Paper, Grid, Typography, Card, CardContent, Divider, Box, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, IconButton,
  Collapse, Tabs, Tab, Button
} from '@mui/material';
import {
  TrendingUp, Assessment, EmojiEvents, School, ExpandMore, ExpandLess,
  Person, CalendarToday, LocationOn, AccessTime, Stars, BarChart
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FsceMainCom = ({ reportData }) => {
  const [openParticipants, setOpenParticipants] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  
  if (!reportData) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">No report data available</Typography>
      </Paper>
    );
  }

  const { testInfo, currentChild, resultsTable, analytics } = reportData;
  const { mockTestDetails, batchDetails, totalParticipants, testDate } = testInfo;
  const { details: childDetails, performance, analysis } = currentChild;
  const { performanceAnalysis, entranceAnalysis } = analysis;
  const { allParticipants = [], summary = {} } = resultsTable;

  // Helper functions
  const getPerformanceColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'excellent': return '#4caf50';
      case 'good': return '#2196f3';
      case 'average': return '#ff9800';
      case 'below average': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getRankBadgeColor = (rank) => {
    if (rank <= 3) return '#ffd700';
    if (rank <= 10) return '#c0c0c0';
    if (rank <= 20) return '#cd7f32';
    return '#9e9e9e';
  };

  const getPercentileMessage = (percentile) => {
    const p = parseFloat(percentile);
    if (p >= 90) return 'Outstanding performance';
    if (p >= 75) return 'Excellent performance';
    if (p >= 50) return 'Good performance';
    if (p >= 25) return 'Room for improvement';
    return 'Needs significant improvement';
  };

  // Chart data for performance comparison
  const performanceChartData = {
    labels: ['Mathematics', 'English', 'Creative Writing'],
    datasets: [
      {
        label: 'Your Score',
        data: [
          performanceAnalysis.math?.score || 0,
          performanceAnalysis.english?.score || 0,
          performanceAnalysis.creativeWriting?.score || 0
        ],
        backgroundColor: '#2196f3',
        borderRadius: 8,
      },
      {
        label: 'Class Average',
        data: [
          analytics.statisticalData?.mathMean || 0,
          analytics.statisticalData?.englishMean || 0,
          analytics.gradeDistribution?.creativeWriting?.average || 0
        ],
        backgroundColor: '#ff9800',
        borderRadius: 8,
      },
      {
        label: 'Excellent Threshold',
        data: [
          analytics.gradeDistribution?.math?.excellent || 0,
          analytics.gradeDistribution?.english?.excellent || 0,
          analytics.gradeDistribution?.creativeWriting?.excellent || 0
        ],
        backgroundColor: '#4caf50',
        borderRadius: 8,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance Analysis',
        font: { size: 16, weight: 'bold' }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f0f0f0' }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
      {/* Header Section */}
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 4
        }}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {mockTestDetails.title}
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarToday sx={{ mr: 1 }} />
                <Typography variant="h6">{batchDetails.date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTime sx={{ mr: 1 }} />
                <Typography>{batchDetails.startTime} - {batchDetails.endTime}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} />
                <Typography variant="body2">{batchDetails.venue?.label}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Typography variant="h4" fontWeight="bold">
                  {totalParticipants}
                </Typography>
                <Typography>Total Participants</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Student Information */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ 
              width: 64, 
              height: 64, 
              mr: 3,
              bgcolor: childDetails.gender === 'Girl' ? '#e91e63' : '#2196f3'
            }}>
              <Person sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {childDetails.name}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {childDetails.year} • {childDetails.gender}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Age: {new Date().getFullYear() - new Date(childDetails.dateOfBirth).getFullYear()} years
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Key Performance Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, height: '100%' }}>
            <EmojiEvents sx={{ fontSize: 48, color: getRankBadgeColor(performance.overallRank), mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
              {performance.overallRank}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Overall Rank
            </Typography>
            <Typography variant="body2" color="text.secondary">
              out of {totalParticipants}
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, height: '100%' }}>
            <Assessment sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
              {performance.totalScore}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Total Score
            </Typography>
            <Typography variant="body2" color="text.secondary">
              out of {Object.values(performanceAnalysis).reduce((sum, subject) => sum + (subject.maxScore || 0), 0)}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, height: '100%' }}>
            <Stars sx={{ 
              fontSize: 48, 
              color: performance.genderRank <= 5 ? '#ffd700' : '#2196f3', 
              mb: 2 
            }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
              {performance.genderRank}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {performance.gender} Rank
            </Typography>
            <Typography variant="body2" color="text.secondary">
              among {performance.gender.toLowerCase()}s
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, height: '100%' }}>
            <TrendingUp sx={{ 
              fontSize: 48, 
              color: performance.totalScore >= summary.averageScore ? '#4caf50' : '#ff9800',
              mb: 2 
            }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
              {((performance.totalScore / summary.averageScore) * 100).toFixed(0)}%
            </Typography>
            <Typography variant="h6" color="text.secondary">
              vs Average
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Class avg: {summary.averageScore?.toFixed(1)}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Subject Performance Analysis */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mb: 3
          }}>
            <BarChart sx={{ mr: 2 }} />
            Subject Performance Analysis
          </Typography>
          
          <Grid container spacing={3}>
            {Object.entries(performanceAnalysis).map(([subject, data]) => (
              <Grid item xs={12} md={4} key={subject}>
                <Card elevation={0} sx={{ 
                  border: `2px solid ${getPerformanceColor(data.level)}`,
                  borderRadius: 2,
                  height: '100%'
                }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" sx={{ textTransform: 'capitalize', mb: 2 }}>
                      {subject === 'creativeWriting' ? 'Creative Writing' : subject}
                    </Typography>
                    
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                      <Typography variant="h3" fontWeight="bold" color="primary">
                        {data.score}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        out of {data.maxScore}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({((data.score / data.maxScore) * 100).toFixed(1)}%)
                      </Typography>
                    </Box>

                    <Chip
                      label={data.level}
                      sx={{
                        backgroundColor: getPerformanceColor(data.level),
                        color: 'white',
                        fontWeight: 'bold',
                        width: '100%',
                        mb: 2
                      }}
                    />

                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      {data.percentile}th percentile
                    </Typography>
                    <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                      {getPercentileMessage(data.percentile)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Performance Chart */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Performance Comparison Chart
          </Typography>
          <Box sx={{ height: 400 }}>
            <Bar data={performanceChartData} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>

      {/* Subject Rankings */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Subject Rankings
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="primary" fontWeight="bold">Mathematics</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                  #{performance.mathRank}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Math Ranking
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="primary" fontWeight="bold">English</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                  #{performance.englishRank}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  English Ranking
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h6" color="primary" fontWeight="bold">Overall</Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ my: 1 }}>
                  #{performance.overallRank}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall Ranking
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Class Statistics */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Class Statistics
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {summary.highestScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">Highest Score</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {summary.averageScore?.toFixed(1)}
                </Typography>
                <Typography variant="body2" color="text.secondary">Average Score</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="error.main">
                  {summary.lowestScore}
                </Typography>
                <Typography variant="body2" color="text.secondary">Lowest Score</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {summary.totalGirls}
                </Typography>
                <Typography variant="body2" color="text.secondary">Total Girls</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* All Participants Table (Collapsible) */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 1 }}>
            <Button
              onClick={() => setOpenParticipants(!openParticipants)}
              endIcon={openParticipants ? <ExpandLess /> : <ExpandMore />}
              sx={{ mb: 2 }}
              variant="outlined"
              fullWidth
            >
              View All Participants ({allParticipants.length})
            </Button>
          </Box>
          
          <Collapse in={openParticipants}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>Rank</strong></TableCell>
                    <TableCell><strong>Name</strong></TableCell>
                    <TableCell align="center"><strong>Math Score</strong></TableCell>
                    <TableCell align="center"><strong>English Score</strong></TableCell>
                    <TableCell align="center"><strong>Total Score</strong></TableCell>
                    <TableCell align="center"><strong>Gender Rank</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allParticipants.map((participant, index) => (
                    <TableRow 
                      key={participant.childId}
                      sx={{
                        bgcolor: participant.isCurrentChild ? '#e3f2fd' : 'inherit',
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={`#${participant.overallRank}`}
                          size="small"
                          color={participant.isCurrentChild ? "primary" : "default"}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {participant.isCurrentChild && (
                            <Stars sx={{ color: '#ffd700', mr: 1, fontSize: 20 }} />
                          )}
                          <Typography 
                            fontWeight={participant.isCurrentChild ? 'bold' : 'normal'}
                            color={participant.isCurrentChild ? 'primary' : 'inherit'}
                          >
                            {participant.displayName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        {Object.values(participant.scores).slice(0, 5).reduce((sum, score) => sum + score, 0)}
                      </TableCell>
                      <TableCell align="center">
                        {Object.values(participant.scores).slice(5, 10).reduce((sum, score) => sum + score, 0)}
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="bold" color="primary">
                          {participant.totalScore}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`#${participant.genderRank}`}
                          size="small"
                          color={participant.gender === 'Girl' ? 'secondary' : 'info'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Collapse>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FsceMainCom; 