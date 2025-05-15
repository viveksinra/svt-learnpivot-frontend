"use client";
import React, { useEffect, useState, useRef } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Grid, 
  Button, 
  Card, 
  CardContent, 
  Divider,
  LinearProgress,
  Chip,
  Paper,
  Tooltip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { useRouter } from "next/navigation";
import { 
  PersonOutline, 
  CalendarMonth, 
  LocationOn, 
  School, 
  EmojiEvents,
  BarChart as BarChartIcon,
  ArrowUpward,
  MilitaryTech,
  AccessTime,
  TrendingUp,
  CompareArrows
} from '@mui/icons-material';
import MySnackbar from '../../Components/MySnackbar/MySnackbar';
import { childService, mockTestService } from '@/app/services';
import { formatDate } from '@/app/utils/dateUtils';
// Import chart components
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
const Dashboard = () => {
  const [selectedChild, setSelectedChild] = useState('');
  const router = useRouter();
  const [allChildren, setAllChildren] = useState([]);
  const snackRef = useRef();
  const [mockTestReport, setMockTestReport] = useState([]);
  const [loading, setLoading] = useState(false);
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
      handleGetMockTestReport();
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
  const handleChildSelect = (childId) => {
    setMockTestReport([]);
    setSelectedChild(childId);
  };
  const handleGetMockTestReport = async () => {
    try {
      setLoading(true);
      console.log('Fetching mock test report for child:', selectedChild);
      const response = await mockTestService.getMyPastCsseMockTest({childId: selectedChild});
      console.log('Mock test report response:', response);
      if (response.data) {
        // Sort reports by date for chronological display
        const sortedReports = [...response.data].sort((a, b) => 
          new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
        );
        setMockTestReport(sortedReports);
      } else {
        if(response.message){
          snackRef.current.handleSnack({ message: response.message, variant: 'error' });
        }else{
          throw new Error('No data received');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      snackRef.current.handleSnack({ message: 'Failed to fetch mock test report.', variant: 'error' });
    } finally {
      setLoading(false);
    }
  };
  // Function to render rank badge
  const renderRankBadge = (rank, label) => {
    const badgeColors = {
      1: { bg: '#4caf50', text: '#fff' },  // Green for 1st place
      2: { bg: '#2196f3', text: '#fff' },  // Blue for 2nd place
      3: { bg: '#9c27b0', text: '#fff' },  // Purple for 3rd place
      default: { bg: '#e0e0e0', text: '#555' }
    };

    const color = badgeColors[rank] || badgeColors.default;

    return (
      <Tooltip title={`${label}: ${rank}`}>
        <Chip
          icon={<MilitaryTech sx={{ color: color.text }} />}
          label={`${rank}`}
          size="small"
          sx={{
            backgroundColor: color.bg,
            color: color.text,
            fontWeight: 'bold',
            mr: 1,
            '& .MuiChip-icon': {
              color: 'inherit'
            }
          }}
        />
      </Tooltip>
    );
  };
  // Function to render score progress
  const renderScoreProgress = (score, maxScore, subject) => {
    const percentage = (score / maxScore) * 100;
    
    const getColor = () => {
      if (percentage >= 80) return '#4caf50';  // Green for excellent
      if (percentage >= 60) return '#2196f3';  // Blue for good
      if (percentage >= 40) return '#ff9800';  // Orange for average
      return '#f44336';  // Red for needs improvement
    };
    
    const getGradeLabel = () => {
      if (percentage >= 80) return 'Excellent';
      if (percentage >= 60) return 'Good';
      if (percentage >= 40) return 'Average';
      return 'Needs Improvement';
    };
    
    return (
      <Box sx={{ mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          mb: 0.5,
          gap: { xs: 0.5, sm: 0 }
        }}>
          <Typography variant="body2" fontWeight="medium">{subject}</Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Typography variant="body2" fontWeight="bold">
              {score} / {maxScore} ({percentage.toFixed(1)}%)
            </Typography>
            <Chip 
              label={getGradeLabel()} 
              size="small"
              sx={{ 
                height: 20, 
                fontSize: '0.7rem',
                backgroundColor: getColor(),
                color: '#fff',
                fontWeight: 'bold'
              }} 
            />
          </Box>
        </Box>
        <Box sx={{ position: 'relative', height: 10, borderRadius: 5, bgcolor: '#f0f0f0', overflow: 'hidden' }}>
          <Box 
            sx={{ 
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${percentage}%`,
              borderRadius: 5,
              backgroundImage: `linear-gradient(to right, ${getColor()}80, ${getColor()})`,
              transition: 'width 1s ease-in-out'
            }}
          />
        </Box>
      </Box>
    );
  };
  // Function to prepare chart data from reports
  const prepareProgressChartData = () => {
    if (mockTestReport.length <= 0) return [];

    return mockTestReport.map(report => {
      const totalScore = (report.childScore?.englishScore || 0) + (report.childScore?.mathsScore || 0);
      const maxTotalScore = (report.englishMaxScore || 0) + (report.mathsMaxScore || 0);
      const totalPercentage = maxTotalScore > 0 ? (totalScore / maxTotalScore) * 100 : 0;
      const englishPercentage = report.englishMaxScore > 0 
        ? ((report.childScore?.englishScore || 0) / report.englishMaxScore) * 100 
        : 0;
      const mathsPercentage = report.mathsMaxScore > 0 
        ? ((report.childScore?.mathsScore || 0) / report.mathsMaxScore) * 100 
        : 0;

      return {
        name: formatDate(report.date || report.createdAt),
        englishScore: report.childScore?.englishScore || 0,
        mathsScore: report.childScore?.mathsScore || 0,
        totalScore: totalScore,
        englishPercentage: parseFloat(englishPercentage.toFixed(1)),
        mathsPercentage: parseFloat(mathsPercentage.toFixed(1)),
        totalPercentage: parseFloat(totalPercentage.toFixed(1)),
        englishMaxScore: report.englishMaxScore || 0,
        mathsMaxScore: report.mathsMaxScore || 0,
        totalMaxScore: maxTotalScore,
        // Gender-based ranks
        genderMathRank: report.childScore?.genderMathRank || 0,
        genderEnglishRank: report.childScore?.genderEnglishRank || 0,
        genderTotalRank: report.childScore?.genderTotalRank || 0,
        // Overall ranks
        overallMathRank: report.childScore?.overallMathRank || 0,
        overallEnglishRank: report.childScore?.overallEnglishRank || 0,
        overallTotalRank: report.childScore?.overallTotalRank || 0,
      };
    });
  };
  // Function to render progress charts
  const renderProgressCharts = () => {
    const chartData = prepareProgressChartData();

    if (chartData.length < 2) {
      return (
        <Typography variant="body1" sx={{ textAlign: 'center', my: 2 }}>
          At least two test results are needed to show progress charts.
        </Typography>
      );
    }
    
    // Added custom chart aspect ratio for mobile
    const getChartAspectRatio = () => {
      return { aspectRatio: { xs: 0.8, sm: 1.2, md: 1.8, lg: 2 } };
    };
    
    return (
      <Grid container spacing={3}>
        {/* Score Progress Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Score Progress</Typography>
          <Paper elevation={1} sx={{ 
            p: { xs: 1, sm: 2 },
            height: { xs: 250, sm: 300 }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: { xs: 10, sm: 12 } }}
                  height={40}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left"
                  tick={{ fontSize: { xs: 10, sm: 12 } }}
                  width={35}
                />
                <RechartsTooltip contentStyle={{ fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="englishScore"
                  name="English"
                  stroke="#1976d2"
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="mathsScore"
                  name="Maths"
                  stroke="#2e7d32"
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalScore"
                  name="Total"
                  stroke="#9c27b0"
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        {/* Percentage Progress Chart */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Performance Percentage</Typography>
          <Paper elevation={1} sx={{ 
            p: { xs: 1, sm: 2 },
            height: { xs: 250, sm: 300 }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: { xs: 10, sm: 12 } }}
                  height={40}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left"
                  domain={[0, 100]}
                  tick={{ fontSize: { xs: 10, sm: 12 } }}
                  width={35}
                />
                <RechartsTooltip contentStyle={{ fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="englishPercentage"
                  name="English %"
                  stroke="#1976d2"
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="mathsPercentage"
                  name="Maths %"
                  stroke="#2e7d32"
                  activeDot={{ r: 6 }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="totalPercentage"
                  name="Total %"
                  stroke="#9c27b0"
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        {/* Ranking Progress Chart */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>Ranking Progress</Typography>
          <Paper elevation={1} sx={{ 
            p: { xs: 1, sm: 2 },
            height: { xs: 300, sm: 350, md: 400 }
          }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: { xs: 10, sm: 12 } }}
                  height={40}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis 
                  reversed 
                  domain={[1, dataMax => Math.max(20, Math.ceil(dataMax * 1.2))]}
                  tick={{ fontSize: { xs: 10, sm: 12 } }}
                  width={30}
                  label={{ 
                    value: 'Rank', 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { fontSize: '12px', textAnchor: 'middle' },
                    offset: -20
                  }}
                />
                <RechartsTooltip 
                  contentStyle={{ fontSize: '12px' }}
                  formatter={(value, name) => {
                    const subjectMap = {
                      'genderMathRank': 'Gender Math Rank',
                      'genderEnglishRank': 'Gender English Rank',
                      'genderTotalRank': 'Gender Total Rank',
                      'overallMathRank': 'Overall Math Rank',
                      'overallEnglishRank': 'Overall English Rank',
                      'overallTotalRank': 'Overall Total Rank'
                    };
                    return [`Rank: ${value}`, subjectMap[name] || name];
                  }}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: '12px', marginTop: '10px' }} />
                {/* Gender ranks */}
                <Line 
                  type="monotone" 
                  dataKey="genderMathRank" 
                  name="Gender Math" 
                  stroke="#6a1b9a" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  strokeDasharray="3 3"
                />
                <Line 
                  type="monotone" 
                  dataKey="genderEnglishRank" 
                  name="Gender English" 
                  stroke="#9c27b0" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  strokeDasharray="3 3"
                />
                <Line 
                  type="monotone" 
                  dataKey="genderTotalRank" 
                  name="Gender Total" 
                  stroke="#673ab7" 
                  strokeWidth={2.5}
                  dot={{ r: 5, strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
                
                {/* Overall ranks */}
                <Line 
                  type="monotone" 
                  dataKey="overallMathRank" 
                  name="Overall Math" 
                  stroke="#0288d1" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  strokeDasharray="3 3"
                />
                <Line 
                  type="monotone" 
                  dataKey="overallEnglishRank" 
                  name="Overall English" 
                  stroke="#2196f3" 
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                  strokeDasharray="3 3"
                />
                <Line 
                  type="monotone" 
                  dataKey="overallTotalRank" 
                  name="Overall Total" 
                  stroke="#0277bd" 
                  strokeWidth={2.5}
                  dot={{ r: 5, strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    );
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
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              Loading report data...
            </Typography>
            <LinearProgress sx={{ mt: 2, maxWidth: 300, mx: 'auto' }} />
          </Box>
        ) : selectedChild && mockTestReport.length > 0 ? (
          <>
 
            {/* Individual test report cards */}
            <Typography variant="h5" sx={{ 
              mb: 3, 
              fontSize: { xs: '1.25rem', sm: '1.5rem' } 
            }}>
              Individual Test Reports
            </Typography>
            <Grid container spacing={3}>
              {mockTestReport.map((report, index) => (
                <Grid item xs={12} key={report._id || index}>
                  <Card 
                    sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: { xs: 'none', sm: 'translateY(-4px)' },
                        boxShadow: { xs: '0 4px 20px rgba(0,0,0,0.08)', sm: '0 8px 30px rgba(0,0,0,0.12)' }
                      }
                    }}
                  >
                    <Box sx={{ 
                      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)', 
                      p: { xs: 2, sm: 3 },
                      borderBottom: '1px solid #e0e0e0'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between', 
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: { xs: 1, sm: 0 }
                      }}>
                        <Typography variant="h5" fontWeight="bold" sx={{ 
                          color: '#1e3a8a',
                          fontSize: { xs: '1.1rem', sm: '1.25rem' }
                        }}>
                          {report.mockTestDetails?.title || 'Test Name Not Available'}
                        </Typography>
                        <Chip 
                          label={report.mockTestDetails?.testType?.label || 'Type Not Available'} 
                          color="primary"
                          icon={<School />}
                          sx={{ fontWeight: 'medium' }}
                        />
                      </Box>

                      {/* Enhanced batch details */}
                      <Box sx={{ 
                        mt: 2,
                        p: { xs: 1.5, sm: 2 },
                        bgcolor: 'rgba(255,255,255,0.85)',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0',
                        backdropFilter: 'blur(4px)'
                      }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CalendarMonth sx={{ color: 'primary.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary">Test Date</Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {report.batchDetails?.date || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6} md={4}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AccessTime sx={{ color: 'primary.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                              <Box>
                                <Typography variant="caption" color="text.secondary">Time</Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {report.batchDetails?.startTime || 'N/A'} - {report.batchDetails?.endTime || 'N/A'}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                          {report.mockTestDetails?.location && (
                            <Grid item xs={12} sm={6} md={4}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LocationOn sx={{ color: 'primary.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">Location</Typography>
                                  <Typography variant="body2" fontWeight="medium">
                                    {report.mockTestDetails.location.label}
                                  </Typography>
                                </Box>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </Box>
                    </Box>

                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Grid container spacing={3}>
                        {/* Subject Scores */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ 
                            mb: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            color: '#1e3a8a',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}>
                            <BarChartIcon sx={{ mr: 1, fontSize: { xs: 18, sm: 20 } }} /> Performance Analysis
                          </Typography>

                          {/* English Score */}
                          {renderScoreProgress(
                            report.childScore?.englishScore, 
                            report.englishMaxScore, 
                            'English'
                          )}

                          {/* Maths Score */}
                          {renderScoreProgress(
                            report.childScore?.mathsScore, 
                            report.mathsMaxScore, 
                            'Mathematics'
                          )}

                          {/* Total Score */}
                          {renderScoreProgress(
                            (report.childScore?.englishScore || 0) + (report.childScore?.mathsScore || 0),
                            (report.englishMaxScore || 0) + (report.mathsMaxScore || 0),
                            'Total Score'
                          )}
                        </Grid>

                        {/* Rankings */}
                        <Grid item xs={12} md={6}>
                          <Typography variant="h6" sx={{ 
                            mb: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            color: '#1e3a8a',
                            fontSize: { xs: '1rem', sm: '1.25rem' }
                          }}>
                            <EmojiEvents sx={{ mr: 1, fontSize: { xs: 18, sm: 20 } }} /> Rankings
                          </Typography>

                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            gap: 2,
                            p: { xs: 1.5, sm: 2 },
                            borderRadius: 2,
                            background: 'linear-gradient(145deg, #f8faff 0%, #f0f4ff 100%)',
                            border: '1px solid #e0e0e0',
                            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
                          }}>
                            {/* Gender Rankings */}
                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1, color: '#444' }}>
                                {report.childScore?.childGender} Rankings
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: { xs: 0.5, sm: 1 }, 
                                alignItems: 'center' 
                              }}>
                                {renderRankBadge(report.childScore?.genderTotalRank, 'Overall')}
                                <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>Overall</Typography>

                                {renderRankBadge(report.childScore?.genderMathRank, 'Maths')}
                                <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>Maths</Typography>

                                {renderRankBadge(report.childScore?.genderEnglishRank, 'English')}
                                <Typography variant="body2">English</Typography>
                              </Box>
                            </Box>

                            <Divider sx={{ opacity: 0.6 }} />

                            {/* Overall Rankings */}
                            <Box>
                              <Typography variant="subtitle2" sx={{ mb: 1, color: '#444' }}>
                                Overall Rankings
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: { xs: 0.5, sm: 1 }, 
                                alignItems: 'center' 
                              }}>
                                {renderRankBadge(report.childScore?.overallTotalRank, 'Overall')}
                                <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>Overall</Typography>

                                {renderRankBadge(report.childScore?.overallMathRank, 'Maths')}
                                <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>Maths</Typography>

                                {renderRankBadge(report.childScore?.overallEnglishRank, 'English')}
                                <Typography variant="body2">English</Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
                       {/* Progress visualization section */}
                       <Paper 
              elevation={0} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                mb: 4, 
                borderRadius: 2, 
                border: '1px solid #e0e0e0',
                bgcolor: '#fafafa' 
              }}
            >
              <Typography variant="h5" sx={{ 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}>
                <TrendingUp sx={{ mr: 1 }} /> Performance Progress
              </Typography>
              {renderProgressCharts()}
            </Paper>
            {/* Reports comparison table (for at-a-glance view) */}
            {mockTestReport.length > 1 && (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: { xs: 2, sm: 3 }, 
                  mb: 4, 
                  borderRadius: 2, 
                  border: '1px solid #e0e0e0' 
                }}
              >
                <Typography variant="h5" sx={{ 
                  mb: 3, 
                  display: 'flex', 
                  alignItems: 'center',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' }
                }}>
                  <CompareArrows sx={{ mr: 1 }} /> Test Comparison
                </Typography>
                
                {/* Desktop table view - hidden on xs screens */}
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Batch Date</TableCell>
                          <TableCell>Time</TableCell>
                          <TableCell>English</TableCell>
                          <TableCell>Maths</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Overall Rank</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mockTestReport.map((report) => (
                          <TableRow key={report._id}>
                            <TableCell>{report.batchDetails?.date}</TableCell>
                            <TableCell>
                              {report.batchDetails?.startTime} - {report.batchDetails?.endTime}
                            </TableCell>
                            <TableCell>
                              {report.childScore?.englishScore}/{report.englishMaxScore} 
                              ({((report.childScore?.englishScore / report.englishMaxScore) * 100).toFixed(1)}%)
                            </TableCell>
                            <TableCell>
                              {report.childScore?.mathsScore}/{report.mathsMaxScore}
                              ({((report.childScore?.mathsScore / report.mathsMaxScore) * 100).toFixed(1)}%)
                            </TableCell>
                            <TableCell>
                              {(report.childScore?.englishScore || 0) + (report.childScore?.mathsScore || 0)}/
                              {(report.englishMaxScore || 0) + (report.mathsMaxScore || 0)}
                              ({(((report.childScore?.englishScore || 0) + (report.childScore?.mathsScore || 0)) / 
                                ((report.englishMaxScore || 0) + (report.mathsMaxScore || 0)) * 100).toFixed(1)}%)
                            </TableCell>
                            <TableCell>{report.childScore?.overallTotalRank}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                
                {/* Mobile card view - only shown on xs screens */}
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <Stack spacing={2}>
                    {mockTestReport.map((report) => (
                      <Paper 
                        key={report._id} 
                        elevation={2} 
                        sx={{ p: 2, borderRadius: 2 }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                          {report.batchDetails?.date}
                        </Typography>
                        
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">Time</Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {report.batchDetails?.startTime} - {report.batchDetails?.endTime}
                            </Typography>
                          </Grid>
                          <Grid item xs={8}>
                            <Typography variant="caption" color="text.secondary">Overall Rank</Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {renderRankBadge(report.childScore?.overallTotalRank, 'Overall')} 
                              {report.childScore?.overallTotalRank}
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                          </Grid>
                          
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">English</Typography>
                            <Typography variant="body2">
                              {report.childScore?.englishScore}/{report.englishMaxScore}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ({((report.childScore?.englishScore / report.englishMaxScore) * 100).toFixed(1)}%)
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">Maths</Typography>
                            <Typography variant="body2">
                              {report.childScore?.mathsScore}/{report.mathsMaxScore}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ({((report.childScore?.mathsScore / report.mathsMaxScore) * 100).toFixed(1)}%)
                            </Typography>
                          </Grid>
                          
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">Total</Typography>
                            <Typography variant="body2">
                              {(report.childScore?.englishScore || 0) + (report.childScore?.mathsScore || 0)}/
                              {(report.englishMaxScore || 0) + (report.mathsMaxScore || 0)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ({(((report.childScore?.englishScore || 0) + (report.childScore?.mathsScore || 0)) / 
                                ((report.englishMaxScore || 0) + (report.mathsMaxScore || 0)) * 100).toFixed(1)}%)
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            )}
          </>
        ) : selectedChild ? (
          <Paper sx={{ 
            p: { xs: 3, sm: 4 }, 
            textAlign: 'center', 
            borderRadius: 2,
            mx: { xs: 1, sm: 0 }
          }}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              No mock test reports available for this child.
            </Typography>
            <Typography color="text.secondary" sx={{ 
              mt: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              Once your child completes a mock test, the results will appear here.
            </Typography>
          </Paper>
        ) : allChildren.length === 0 ? (
          <Paper sx={{ 
            p: { xs: 3, sm: 4 }, 
            textAlign: 'center', 
            borderRadius: 2,
            mx: { xs: 1, sm: 0 }  
          }}>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
              No children found.
            </Typography>
            <Typography color="text.secondary" sx={{ 
              mt: 1,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}>
              Please add a child to view mock test reports.
            </Typography>
          </Paper>
        ) : null}
        <MySnackbar ref={snackRef} />
      </Container>
    </Box>
  );
};
export default Dashboard;