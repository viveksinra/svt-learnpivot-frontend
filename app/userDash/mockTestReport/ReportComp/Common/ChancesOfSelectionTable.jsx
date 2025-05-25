import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';
import { calculateStandardizedScore, getSelectionChance } from './utils';

const ChancesOfSelectionTable = ({ 
  childScore, 
  isGirl, 
  schoolThresholds, 
  standardizedScore, 
  totalFactor, 
  englishFactor 
}) => {
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

  // Get standardized score styling based on performance
  const getStandardizedScoreStyle = () => {
    // Use a more sophisticated grading based on standardized score ranges
    if (standardizedScore >= 400) return { 
      backgroundColor: '#e8f5e9', 
      color: '#2e7d32', 
      fontWeight: 'bold',
      fontSize: '1.1rem',
      border: '2px solid #4caf50'
    };
    if (standardizedScore >= 300) return { 
      backgroundColor: '#e3f2fd', 
      color: '#1976d2', 
      fontWeight: 'bold',
      fontSize: '1.1rem',
      border: '2px solid #2196f3'
    };
    if (standardizedScore >= 200) return { 
      backgroundColor: '#fff3e0', 
      color: '#ed6c02', 
      fontWeight: 'bold',
      fontSize: '1.1rem',
      border: '2px solid #ff9800'
    };
    return { 
      backgroundColor: '#ffebee', 
      color: '#d32f2f', 
      fontWeight: 'bold',
      fontSize: '1.1rem',
      border: '2px solid #f44336'
    };
  };

  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f0f0f0', mb: 2, mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell colSpan={9} align="center" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              School Selection Chances (Based on Standardized Score)
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ 
              fontWeight: 'bold', 
              fontSize: '0.95rem',
              backgroundColor: '#e3f2fd',
              color: '#1976d2'
            }}>
              Standardized Score
            </TableCell>
            {schoolTypes.map(school => (
              <TableCell colSpan={2} align="center" key={school} sx={{ fontWeight: 'medium' }}>
                {school}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell sx={{ 
              fontWeight: 'medium',
              backgroundColor: '#f8f9fa',
              color: '#495057',
              fontSize: '0.8rem'
            }}>
              {standardizedScore.toFixed(1)}
            </TableCell>
            {schoolTypes.map(school => (
              <React.Fragment key={school}>
                <TableCell align="center" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                  Inside
                </TableCell>
                <TableCell align="center" sx={{ fontSize: '0.75rem', fontWeight: 'medium' }}>
                  Outside
                </TableCell>
              </React.Fragment>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell sx={getStandardizedScoreStyle()}>
              {standardizedScore.toFixed(1)}
            </TableCell>
            {schoolTypes.map(school => {
              const schoolKey = school.toLowerCase().replace(/\s+/g, '').replace('girls', '').replace('boys', '');
              const schoolData = schoolThresholds[schoolKey] || schoolThresholds[school.toLowerCase()];
              
              const insideChance = getSelectionChance(standardizedScore, schoolData?.inside);
              const outsideChance = getSelectionChance(standardizedScore, schoolData?.outside);
              
              return (
                <React.Fragment key={school}>
                  <TableCell align="center" sx={getStatusCellStyle(insideChance)}>
                    {insideChance}
                  </TableCell>
                  <TableCell align="center" sx={getStatusCellStyle(outsideChance)}>
                    {outsideChance}
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

export default ChancesOfSelectionTable; 