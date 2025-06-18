"use client";
import React, { useState } from 'react';
import {
  Box, Typography, Grid, Button, Card, CardContent, Divider, LinearProgress, 
  Paper, Chip, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, 
  TableRow, Collapse, IconButton
} from '@mui/material';
import {
  EmojiEvents, BarChart as BarChartIcon, TrendingUp, Timeline, Assessment,
  Person, ExpandMore, ExpandLess, CalendarToday, School, Star, 
  TrendingDown, ShowChart
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FsceAllInOneMain = ({
  selectedChild = '',
  allChildren = [],
  mockTestReports = {},
  loading = false,
  onViewDetail,
}) => {
  const [expandedCards, setExpandedCards] = useState({});

  // Extract test reports from the new API response structure
  const testReports = mockTestReports?.testReports || [];
  const childDetails = mockTestReports?.childDetails;
  const overallSummary = mockTestReports?.overallSummary;
  const comparisonAnalysis = mockTestReports?.comparisonAnalysis;

  const toggleCardExpansion = (reportId) => {
    setExpandedCards(prev => ({
      ...prev,
      [reportId]: !prev[reportId]
    }));
  };

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Helper function to safely format numbers
  const formatNumber = (value, decimals = 1) => {
    return typeof value === 'number' && !isNaN(value) ? value.toFixed(decimals) : 'N/A';
  };

  // Generate progress chart data
  const generateProgressChart = () => {
    if (!testReports.length) return null;

    const sortedReports = [...testReports].sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
    
    const chartData = {
      labels: sortedReports.map(report => formatDate(report.testDate)),
      datasets: [
        {
          label: 'Total Score',
          data: sortedReports.map(report => report.scores?.totalScore || 0),
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Math Score',
          data: sortedReports.map(report => report.scores?.subjectScores?.math || 0),
          borderColor: '#4caf50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          fill: false,
          tension: 0.4,
        },
        {
          label: 'English Score',
          data: sortedReports.map(report => report.scores?.subjectScores?.english || 0),
          borderColor: '#ff9800',
          backgroundColor: 'rgba(255, 152, 0, 0.1)',
          fill: false,
          tension: 0.4,
        }
      ]
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Performance Progress Over Time',
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

    return { data: chartData, options: chartOptions };
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 5 }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Loading report data...
        </Typography>
        <LinearProgress sx={{ mt: 2, maxWidth: 300, mx: 'auto' }} />
      </Box>
    );
  }

  if (!selectedChild) {
    return (
      <Paper sx={{ 
        p: { xs: 3, sm: 4 }, 
        textAlign: 'center', 
        borderRadius: 2,
        mx: { xs: 1, sm: 0 }  
      }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Please select a child to view their FSCE mock test reports.
        </Typography>
      </Paper>
    );
  }

  if (!testReports.length) {
    return (
      <Paper sx={{ 
        p: { xs: 3, sm: 4 }, 
        textAlign: 'center', 
        borderRadius: 2,
        mx: { xs: 1, sm: 0 }  
      }}>
        <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          No FSCE mock test reports available for this child.
        </Typography>
        <Typography color="text.secondary" sx={{ 
          mt: 1,
          fontSize: { xs: '0.875rem', sm: '1rem' }
        }}>
          Reports will appear here once the child has taken FSCE mock tests.
        </Typography>
      </Paper>
    );
  }

  const progressChart = generateProgressChart();
  const latestReport = testReports[0]; // Assuming reports are sorted by date descending

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
      {/* Header with Child Info */}
      <Paper elevation={3} sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ 
              width: 64, 
              height: 64, 
              mr: 3,
              bgcolor: 'rgba(255,255,255,0.2)'
            }}>
              <Person sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h3" fontWeight="bold">
                {childDetails?.name || 'Student'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {childDetails?.year} • {childDetails?.gender}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            FSCE Mock Test Performance Overview
          </Typography>
        </Box>
      </Paper>

      {/* Key Metrics Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, height: '100%' }}>
            <Assessment sx={{ fontSize: 48, color: '#2196f3', mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
              {testReports.length}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Tests Taken
            </Typography>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, height: '100%' }}>
            <TrendingUp sx={{ fontSize: 48, color: '#4caf50', mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
              {latestReport?.scores?.totalScore || 0}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Latest Score
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(latestReport?.testDate)}
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, height: '100%' }}>
            <EmojiEvents sx={{ 
              fontSize: 48, 
              color: getRankBadgeColor(latestReport?.rankings?.overallRank), 
              mb: 2 
            }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
              #{latestReport?.rankings?.overallRank || 'N/A'}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Best Rank
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Latest Test
            </Typography>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, height: '100%' }}>
            <ShowChart sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
            <Typography variant="h3" fontWeight="bold" color="primary">
              {formatNumber(overallSummary?.averageScore)}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Average Score
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Across all tests
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Progress Chart */}
      {progressChart && (
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
              display: 'flex', 
              alignItems: 'center',
              mb: 3
            }}>
              <Timeline sx={{ mr: 2 }} />
              Performance Progress
            </Typography>
            <Box sx={{ height: 400 }}>
              <Line data={progressChart.data} options={progressChart.options} />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Individual Test Reports */}
      <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ 
        mb: 3,
        display: 'flex',
        alignItems: 'center'
      }}>
        <BarChartIcon sx={{ mr: 2 }} />
        Individual Test Reports ({testReports.length})
      </Typography>

      <Grid container spacing={3}>
        {testReports.map((report, index) => (
          <Grid item xs={12} key={report.reportId || index}>
            <Card sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'all 0.3s',
              '&:hover': {
                transform: { xs: 'none', sm: 'translateY(-2px)' },
                boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', sm: '0 8px 30px rgba(0,0,0,0.12)' }
              }
            }}>
              {/* Test Header */}
              <Box sx={{ 
                background: index === 0 ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)' : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                color: 'white',
                p: 3
              }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ mr: 1 }} />
                      <Typography variant="h6">{formatDate(report.testDate)}</Typography>
                      {index === 0 && (
                        <Chip 
                          label="Latest" 
                          size="small" 
                          sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                        />
                      )}
                    </Box>
                    <Typography variant="h5" fontWeight="bold">
                      {report.mockTestDetails?.title || 'FSCE Mock Test'}
                    </Typography>
                    <Typography sx={{ opacity: 0.9 }}>
                      Test #{report.testNumber || testReports.length - index}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                      <Typography variant="h3" fontWeight="bold">
                        {report.scores?.totalScore || 0}
                      </Typography>
                      <Typography>
                        Total Score
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Max: {report.scores?.maxPossibleScore || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3}>
                  {/* Subject Performance */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <BarChartIcon sx={{ mr: 1 }} />
                      Subject Performance
                    </Typography>
                    
                    {report.performanceAnalysis && Object.entries(report.performanceAnalysis).map(([subject, data]) => (
                      <Box key={subject} sx={{ mb: 2 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 1
                        }}>
                          <Typography variant="body1" fontWeight="medium" sx={{ textTransform: 'capitalize' }}>
                            {subject === 'creativeWriting' ? 'Creative Writing' : subject}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              {data.score}/{data.maxScore}
                            </Typography>
                            <Chip 
                              label={data.level} 
                              size="small"
                              sx={{ 
                                backgroundColor: getPerformanceColor(data.level),
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.7rem'
                              }} 
                            />
                          </Box>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(data.score / data.maxScore) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: getPerformanceColor(data.level),
                              borderRadius: 4
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {data.percentile}th percentile
                        </Typography>
                      </Box>
                    ))}
                  </Grid>

                  {/* Rankings */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <EmojiEvents sx={{ mr: 1 }} />
                      Rankings
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary">Overall</Typography>
                          <Typography variant="h4" fontWeight="bold" color="primary">
                            #{report.rankings?.overallRank || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary">Math</Typography>
                          <Typography variant="h4" fontWeight="bold" color="primary">
                            #{report.rankings?.mathRank || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                          <Typography variant="body2" color="text.secondary">English</Typography>
                          <Typography variant="h4" fontWeight="bold" color="primary">
                            #{report.rankings?.englishRank || 'N/A'}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                      <Typography variant="body2" color="text.secondary">Test Context</Typography>
                      <Typography variant="body1">
                        <strong>{report.testContext?.totalParticipants || 'N/A'}</strong> total participants
                      </Typography>
                      {report.testContext?.isLatestTest && (
                        <Chip 
                          label="Latest Test" 
                          size="small" 
                          color="primary" 
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 3,
                  pt: 2,
                  borderTop: '1px solid #e0e0e0'
                }}>
                  <Button
                    onClick={() => toggleCardExpansion(report.reportId)}
                    endIcon={expandedCards[report.reportId] ? <ExpandLess /> : <ExpandMore />}
                    variant="outlined"
                    size="small"
                  >
                    {expandedCards[report.reportId] ? 'Show Less' : 'Show More Details'}
                  </Button>
                  
                  {onViewDetail && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onViewDetail(report.mockTestId, report.batchId)}
                      sx={{ borderRadius: 2 }}
                    >
                      View Full Report
                    </Button>
                  )}
                </Box>

                {/* Expanded Details */}
                <Collapse in={expandedCards[report.reportId]}>
                  <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Additional Details
                    </Typography>
                    
                    {/* Standardized Scores if available */}
                    {report.standardizedScores && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          Standardized Scores
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">Math</Typography>
                            <Typography variant="h6">
                              {formatNumber(report.standardizedScores.math)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">English</Typography>
                            <Typography variant="h6">
                              {formatNumber(report.standardizedScores.english)}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography variant="body2" color="text.secondary">Total</Typography>
                            <Typography variant="h6">
                              {formatNumber(report.standardizedScores.total)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Entrance Analysis if available */}
                    {report.entranceAnalysis && Object.keys(report.entranceAnalysis).length > 0 && (
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                          School Selection Analysis
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Analysis based on current performance and school requirements
                        </Typography>
                        {/* Add specific entrance analysis details here */}
                      </Box>
                    )}
                  </Box>
                </Collapse>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Overall Summary if available */}
      {overallSummary && (
        <Card sx={{ mt: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Overall Performance Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Performance Trends</Typography>
                {overallSummary.trends && (
                  <Box>
                    <Typography variant="body1">
                      Math: {overallSummary.trends.math || 'Stable'}
                    </Typography>
                    <Typography variant="body1">
                      English: {overallSummary.trends.english || 'Stable'}
                    </Typography>
                    <Typography variant="body1">
                      Overall: {overallSummary.trends.overall || 'Stable'}
                    </Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Key Statistics</Typography>
                <Typography variant="body1">
                  Average Score: {formatNumber(overallSummary.averageScore)}
                </Typography>
                <Typography variant="body1">
                  Best Score: {overallSummary.bestScore || 'N/A'}
                </Typography>
                <Typography variant="body1">
                  Most Recent: {overallSummary.mostRecentScore || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default FsceAllInOneMain;