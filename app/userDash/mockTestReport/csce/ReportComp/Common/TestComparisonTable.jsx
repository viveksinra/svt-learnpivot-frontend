import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { formatDateToShortMonth } from '@/app/utils/dateFormat';
import { RankBadge } from './index';

const TestComparisonTable = ({ mockTestReports, onViewDetail }) => {
  if (mockTestReports.length <= 1) {
    return null; // Don't show comparison table if there's only one or no reports
  }

  return (
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
        Test Comparison
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockTestReports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>
                    {report.batchDetails?.date ? formatDateToShortMonth(report.batchDetails.date) : 'N/A'}
                  </TableCell>
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
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onViewDetail && onViewDetail(report.mockTestDetails?._id, report.batchDetails?._id)}
                      sx={{
                        borderRadius: 1,
                        textTransform: 'none',
                        fontSize: '0.75rem',
                        px: 1.5
                      }}
                    >
                      View Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      
      {/* Mobile card view - only shown on xs screens */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <Stack spacing={2}>
          {mockTestReports.map((report) => (
            <Paper 
              key={report._id} 
              elevation={2} 
              sx={{ p: 2, borderRadius: 2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {report.batchDetails?.date ? formatDateToShortMonth(report.batchDetails.date) : 'N/A'}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onViewDetail && onViewDetail(report.mockTestDetails?._id, report.batchDetails?._id)}
                  sx={{
                    borderRadius: 1,
                    textTransform: 'none',
                    fontSize: '0.7rem',
                    px: 1
                  }}
                >
                  View Detail
                </Button>
              </Box>
              
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
                    <RankBadge rank={report.childScore?.overallTotalRank} label="Overall" /> 
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
  );
};

export default TestComparisonTable; 