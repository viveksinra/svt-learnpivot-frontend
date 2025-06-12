import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Typography,
  Box
} from '@mui/material';
import { calculateStandardizedScore, getSelectionChance } from './utils';

const RankingTable = ({ 
  data, 
  isBoysTable, 
  currentChildId, 
  currentChildName,
  englishMaxScore, 
  mathsMaxScore, 
  schoolThresholds, 
  englishMean, 
  englishStdDev,
  mathsMean,
  mathsStdDev,
  hideStandardisedScore = false
}) => {
  // Get relevant schools for the gender
  const relevantSchools = isBoysTable 
    ? ['kegs', 'colchester', 'westcliff', 'southend']
    : ['colchester', 'westcliff', 'southend'];

  const getRowStyle = (childId) => {
    if (childId?.toString() === currentChildId) {
      return {
        backgroundColor: '#e3f2fd',
        fontWeight: 'bold',
        '& td': {
          fontWeight: 'bold',
          color: '#1976d2'
        }
      };
    }
    return {};
  };

  const getSelectionStatus = (standardizedScore, school, catchmentType) => {
    const schoolData = schoolThresholds[school];
    if (!schoolData || !schoolData[catchmentType]) return 'N/A';
    
    return getSelectionChance(standardizedScore, schoolData[catchmentType]);
  };

  const getStatusCellStyle = (status) => {
    if (status === 'Safe') return { backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.75rem' };
    if (status === 'Borderline') return { backgroundColor: '#fff3e0', color: '#ed6c02', fontSize: '0.75rem' };
    if (status === 'Concern') return { backgroundColor: '#ffebee', color: '#d32f2f', fontSize: '0.75rem' };
    return { fontSize: '0.75rem' };
  };

  if (!data || data.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 3 }}>
        <Typography variant="body1" color="text.secondary">
          No ranking data available
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', maxHeight: 600 }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Rank</TableCell>
            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>English</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Maths</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Total</TableCell>
            {!hideStandardisedScore && (
              <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                Std Score
              </TableCell>
            )}
            {relevantSchools.map(school => (
              <React.Fragment key={school}>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f5f5f5',
                    fontSize: '0.75rem',
                    minWidth: 60,
                    padding: '8px 4px'
                  }}
                >
                  {school.toUpperCase()}
                  <br />
                  <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                    In
                  </Typography>
                </TableCell>
                <TableCell 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold', 
                    backgroundColor: '#f5f5f5',
                    fontSize: '0.75rem',
                    minWidth: 60,
                    padding: '8px 4px'
                  }}
                >
                  {school.toUpperCase()}
                  <br />
                  <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                    Out
                  </Typography>
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((student, index) => {
            const standardizedScore = calculateStandardizedScore(
              student.mathsScore, 
              student.englishScore, 
              englishMean, 
              englishStdDev,
              mathsMean,
              mathsStdDev
            );
            
            const totalScore = student.englishScore + student.mathsScore;
            const totalMaxScore = englishMaxScore + mathsMaxScore;
            
            const getDisplayName = (student, index) => {
              // If this is the current child, show their actual name
              if (student.childId?.toString() === currentChildId) {
                return currentChildName || student.childName || `${isBoysTable ? 'Boy' : 'Girl'} ${index + 1}`;
              }
              // For other students, show Boy/Girl with number
              return `${isBoysTable ? 'Boy' : 'Girl'} ${index + 1}`;
            };

            return (
              <TableRow key={student.childId || index} sx={getRowStyle(student.childId)}>
                <TableCell>{index + 1}</TableCell>
                <TableCell sx={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {getDisplayName(student, index)}
                </TableCell>
                <TableCell align="center">
                  {student.englishScore}/{englishMaxScore}
                </TableCell>
                <TableCell align="center">
                  {student.mathsScore}/{mathsMaxScore}
                </TableCell>
                <TableCell align="center">
                  {student.englishScore + student.mathsScore}/{englishMaxScore + mathsMaxScore}
                </TableCell>
                {!hideStandardisedScore && (
                  <TableCell align="center" sx={{ fontWeight: 'medium' }}>
                    {standardizedScore.toFixed(1)}
                  </TableCell>
                )}
                {relevantSchools.map(school => {
                  const insideStatus = getSelectionStatus(standardizedScore, school, 'inside');
                  const outsideStatus = getSelectionStatus(standardizedScore, school, 'outside');
                  
                  return (
                    <React.Fragment key={school}>
                      <TableCell align="center" sx={{ padding: '4px' }}>
                        <Box sx={{ 
                          ...getStatusCellStyle(insideStatus),
                          padding: '4px 8px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          minHeight: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {insideStatus}
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ padding: '4px' }}>
                        <Box sx={{ 
                          ...getStatusCellStyle(outsideStatus),
                          padding: '4px 8px',
                          borderRadius: '4px',
                          textAlign: 'center',
                          minHeight: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {outsideStatus}
                        </Box>
                      </TableCell>
                    </React.Fragment>
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

export default RankingTable; 