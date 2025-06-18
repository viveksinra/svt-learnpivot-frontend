"use client";
import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Paper
} from '@mui/material';
import {
  EmojiEvents,
  BarChart as BarChartIcon,
  TrendingUp
} from '@mui/icons-material';

import {
  RankBadge,
  ScoreProgress,
  SchoolChances,
  TestHeader,
  ProgressCharts,
  TestComparisonTable,
} from '../../csce/ReportComp/Common';

const FsceAllInOneMain = ({
  selectedChild = '',
  allChildren = [],
  mockTestReports = [],
  loading = false,
  catchmentType = 'inside',
  onViewDetail,
}) => {
  const publishedReports = mockTestReports?.filter(r => r.isPublished);

  return (
    <>
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Loading report data...
          </Typography>
          <LinearProgress sx={{ mt: 2, maxWidth: 300, mx: 'auto' }} />
        </Box>
      ) : selectedChild && publishedReports && publishedReports?.length > 0 ? (
        <>
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
            <ProgressCharts mockTestReports={publishedReports} catchmentType={catchmentType} />
          </Paper>
          {/* Reports comparison table (for at-a-glance view) */}
          <TestComparisonTable mockTestReports={publishedReports} onViewDetail={onViewDetail} />
          {/* Individual test report cards */}
          <Typography variant="h5" sx={{ 
            mb: 3, 
            fontSize: { xs: '1.25rem', sm: '1.5rem' } 
          }}>
            Individual Test Reports
          </Typography>
          <Grid container spacing={3}>
            {publishedReports.map((report, index) => (
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
                  <TestHeader 
                    mockTestDetails={report.mockTestDetails}
                    batchDetails={report.batchDetails}
                    variant="compact"
                  />
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end',
                    p: { xs: 1, sm: 2 },
                    borderBottom: '1px solid #e0e0e0'
                  }}>
                    {onViewDetail && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onViewDetail(report.mockTestDetails?._id, report.batchDetails?._id)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 'medium',
                          fontSize: { xs: '0.7rem', sm: '0.8rem' },
                          px: { xs: 1, sm: 2 }
                        }}
                      >
                        View in Detail
                      </Button>
                    )}
                  </Box>

                  <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                    <Grid container spacing={3}>
                      {/* Subject Scores */}
                      <Grid item xs={12} md={4}>
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
                        <ScoreProgress
                          score={report.childScore?.englishScore}
                          maxScore={report.englishMaxScore}
                          subject="English"
                          performanceBoundaries={report.performanceBoundaries}
                        />

                        {/* Maths Score */}
                        <ScoreProgress
                          score={report.childScore?.mathsScore}
                          maxScore={report.mathsMaxScore}
                          subject="Mathematics"
                          performanceBoundaries={report.performanceBoundaries}
                        />

                        {/* Total Score */}
                        <ScoreProgress
                          score={(report.childScore?.englishScore || 0) + (report.childScore?.mathsScore || 0)}
                          maxScore={(report.englishMaxScore || 0) + (report.mathsMaxScore || 0)}
                          subject="Total Score"
                          performanceBoundaries={null} // No performance boundaries for total score, will use percentage-based
                        />
                      </Grid>

                      {/* Rankings */}
                      <Grid item xs={12} sm={6} md={4}>
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
                              <RankBadge rank={report.childScore?.genderTotalRank} label="Overall" />
                              <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>Overall</Typography>

                              <RankBadge rank={report.childScore?.genderMathRank} label="Maths" />
                              <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>Maths</Typography>

                              <RankBadge rank={report.childScore?.genderEnglishRank} label="English" />
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
                              <RankBadge rank={report.childScore?.overallTotalRank} label="Overall" />
                              <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>Overall</Typography>

                              <RankBadge rank={report.childScore?.overallMathRank} label="Maths" />
                              <Typography variant="body2" sx={{ mr: { xs: 1, sm: 2 } }}>Maths</Typography>

                              <RankBadge rank={report.childScore?.overallEnglishRank} label="English" />
                              <Typography variant="body2">English</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>

                      {/* School Selection Chances - New Component */}
                      <Grid item xs={12} sm={6} md={4}>
                        <SchoolChances report={report} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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
    </>
  );
};
export default FsceAllInOneMain;