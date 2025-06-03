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
  mathsStdDev 
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
    if (status === 'Safe') return { backgroundColor: '#e8f5e9', color: '#2e7d32', fontSize: '0.7rem' };
    if (status === 'Borderline') return { backgroundColor: '#fff3e0', color: '#ed6c02', fontSize: '0.7rem' };
    if (status === 'Concern') return { backgroundColor: '#ffebee', color: '#d32f2f', fontSize: '0.7rem' };
    return { fontSize: '0.7rem' };
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
            <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Std Score</TableCell>
            {relevantSchools.map(school => (
              <TableCell 
                key={school} 
                align="center" 
                sx={{ 
                  fontWeight: 'bold', 
                  backgroundColor: '#f5f5f5',
                  fontSize: '0.75rem',
                  minWidth: 80
                }}
              >
                {school.toUpperCase()}
                <br />
                <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                  In/Out
                </Typography>
              </TableCell>
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
                <TableCell align="center" sx={{ fontWeight: 'medium' }}>
                  {standardizedScore.toFixed(1)}
                </TableCell>
                {relevantSchools.map(school => {
                  const insideStatus = getSelectionStatus(standardizedScore, school, 'inside');
                  const outsideStatus = getSelectionStatus(standardizedScore, school, 'outside');
                  
                  return (
                    <TableCell key={school} align="center" sx={{ padding: '4px' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                        <Box sx={{ 
                          ...getStatusCellStyle(insideStatus),
                          padding: '2px 4px',
                          borderRadius: '4px',
                          textAlign: 'center'
                        }}>
                          {insideStatus}
                        </Box>
                        <Box sx={{ 
                          ...getStatusCellStyle(outsideStatus),
                          padding: '2px 4px',
                          borderRadius: '4px',
                          textAlign: 'center'
                        }}>
                          {outsideStatus}
                        </Box>
                      </Box>
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

export default RankingTable; 