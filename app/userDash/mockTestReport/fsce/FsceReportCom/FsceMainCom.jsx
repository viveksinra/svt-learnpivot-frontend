"use client"
import React from 'react';
import {
  Paper, Grid, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, Card, CardContent, Divider
} from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const FsceMainCom = ({ reportData }) => {
  const {
    mockTestId,
    childScore,
    paperSections,
    englishMean,
    englishStdDev,
    mathsMean,
    mathsStdDev,
    performanceBoundaries,
    boysScoreThresholds,
    girlsScoreThresholds,
    hideStandardisedScore
  } = reportData;

  const { sectionScores } = childScore;

  const getSectionScore = (sectionId) => sectionScores[sectionId] || 0;

  const mathTotal = paperSections
    .flatMap(p => p.sections)
    .filter(s => s.subject === 'Maths')
    .reduce((acc, s) => acc + getSectionScore(s.sectionId), 0);

  const englishTotal = paperSections
    .flatMap(p => p.sections)
    .filter(s => s.subject === 'English')
    .reduce((acc, s) => acc + getSectionScore(s.sectionId), 0);

  const creativeWritingTotal = paperSections
    .flatMap(p => p.sections)
    .filter(s => s.subject === 'Creative Writing')
    .reduce((acc, s) => acc + getSectionScore(s.sectionId), 0);
  
  const overallTotal = mathTotal + englishTotal;

  const standardisedMaths = 100 + ((mathTotal - mathsMean) / mathsStdDev) * 15;
  const standardisedEnglish = 100 + ((englishTotal - englishStdDev) / englishStdDev) * 15;
  const totalStandardisedScore = standardisedMaths + standardisedEnglish;

  const performanceChartData = {
    labels: ['Maths', 'English', 'Creative Writing'],
    datasets: [
      {
        label: 'Your Score',
        data: [mathTotal, englishTotal, creativeWritingTotal],
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Average Score',
        data: [performanceBoundaries.math.average, performanceBoundaries.english.average, performanceBoundaries.creativeWriting.average],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const getSchoolStatus = (score, thresholds) => {
    if (!thresholds) return { text: "N/A", color: "text.secondary" };
    if (score >= thresholds.safe) return { text: "Safe", color: "success.main" };
    if (score >= thresholds.borderline) return { text: "Borderline", color: "warning.main" };
    return { text: "Below Expected", color: "error.main" };
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        FSCE Mock Test Result: {mockTestId.testName}
      </Typography>
      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        {/* Score Tables */}
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>Score Breakdown</Typography>
          <Grid container spacing={2}>
            {paperSections.map(paper => (
              <Grid item xs={12} md={6} key={paper.paperId}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{paper.paperName}</Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Section</TableCell>
                            <TableCell align="right">Your Score</TableCell>
                            <TableCell align="right">Max Score</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {paper.sections.map(section => (
                            <TableRow key={section.sectionId}>
                              <TableCell>{section.sectionName}</TableCell>
                              <TableCell align="right">{getSectionScore(section.sectionId)}</TableCell>
                              <TableCell align="right">{section.maxScore}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
        
        {/* Summary and Ranks */}
        <Grid item xs={12} md={6}>
            <Card>
                <CardContent>
                    <Typography variant="h6">Summary</Typography>
                     <TableContainer>
                        <Table size="small">
                            <TableBody>
                                <TableRow>
                                    <TableCell>Total Maths Score</TableCell>
                                    <TableCell align="right">{mathTotal}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total English Score</TableCell>
                                    <TableCell align="right">{englishTotal}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Creative Writing Score</TableCell>
                                    <TableCell align="right">{creativeWritingTotal}</TableCell>
                                </TableRow>
                                 <TableRow>
                                    <TableCell><strong>Overall Total (Maths + English)</strong></TableCell>
                                    <TableCell align="right"><strong>{overallTotal}</strong></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                     </TableContainer>
                </CardContent>
            </Card>
        </Grid>
        <Grid item xs={12} md={6}>
            <Card>
                <CardContent>
                    <Typography variant="h6">Your Ranks</Typography>
                     <TableContainer>
                        <Table size="small">
                             <TableBody>
                                <TableRow>
                                    <TableCell>Maths Rank</TableCell>
                                    <TableCell align="right">{childScore.mathRank}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>English Rank</TableCell>
                                    <TableCell align="right">{childScore.englishRank}</TableCell>
                                </TableRow>
                                 <TableRow>
                                    <TableCell><strong>Overall Rank</strong></TableCell>
                                    <TableCell align="right"><strong>{childScore.overallRank}</strong></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                     </TableContainer>
                </CardContent>
            </Card>
        </Grid>

        {/* Performance Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Performance Overview</Typography>
              <Bar data={performanceChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Your Score vs Average' } } }} />
            </CardContent>
          </Card>
        </Grid>

        {/* Standardised Score */}
        {!hideStandardisedScore && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Standardised Score</Typography>
                <Typography>Standardised scores are used by grammar schools for admissions. A score of 100 is considered average.</Typography>
                <TableContainer sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Standardised Maths Score</TableCell>
                        <TableCell align="right">{standardisedMaths.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Standardised English Score</TableCell>
                        <TableCell align="right">{standardisedEnglish.toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Total Standardised Score</strong></TableCell>
                        <TableCell align="right"><strong>{totalStandardisedScore.toFixed(2)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Grammar School Recommendations */}
        {!hideStandardisedScore && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Grammar School Analysis</Typography>
                <Typography variant="subtitle2">Based on your total standardised score ({totalStandardisedScore.toFixed(2)})</Typography>
                
                <Grid container spacing={2} sx={{mt: 1}}>
                    {/* Boys Schools */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>Boys' Schools</Typography>
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>School</TableCell>
                                        <TableCell>In Catchment</TableCell>
                                        <TableCell>Out of Catchment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(boysScoreThresholds).map(([school, data]) => (
                                        <TableRow key={school}>
                                            <TableCell sx={{textTransform: 'capitalize'}}>{school}</TableCell>
                                            <TableCell>
                                                <Typography color={getSchoolStatus(totalStandardisedScore, data.inside).color}>
                                                    {getSchoolStatus(totalStandardisedScore, data.inside).text}
                                                </Typography>
                                            </TableCell>
                                             <TableCell>
                                                <Typography color={getSchoolStatus(totalStandardisedScore, data.outside).color}>
                                                    {getSchoolStatus(totalStandardisedScore, data.outside).text}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    {/* Girls Schools */}
                     <Grid item xs={12} md={6}>
                        <Typography variant="subtitle1" gutterBottom>Girls' Schools</Typography>
                         <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>School</TableCell>
                                        <TableCell>In Catchment</TableCell>
                                        <TableCell>Out of Catchment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                     {Object.entries(girlsScoreThresholds).map(([school, data]) => (
                                        <TableRow key={school}>
                                            <TableCell sx={{textTransform: 'capitalize'}}>{school}</TableCell>
                                            <TableCell>
                                                <Typography color={getSchoolStatus(totalStandardisedScore, data.inside).color}>
                                                    {getSchoolStatus(totalStandardisedScore, data.inside).text}
                                                </Typography>
                                            </TableCell>
                                             <TableCell>
                                                <Typography color={getSchoolStatus(totalStandardisedScore, data.outside).color}>
                                                    {getSchoolStatus(totalStandardisedScore, data.outside).text}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

      </Grid>
    </Paper>
  );
};

export default FsceMainCom; 