import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip
} from '@mui/material';
import { calculateStandardizedScore, getSelectionChance } from './utils';

const ChancesOfSelectionTable = ({ 
  childScore, 
  isGirl, 
  schoolThresholds, 
  standardizedScore, 
  englishMean, 
  englishStdDev,
  mathsMean,
  mathsStdDev,
  hideStandardisedScore = false,
  englishMaxScore,
  mathsMaxScore
}) => {
  // Get relevant school types for the gender
  const schoolTypes = isGirl 
    ? ['Colchester Girls', 'Westcliff Girls', 'Southend Girls'] 
    : ['KEGS', 'Colchester Boys', 'Westcliff Boys', 'Southend Boys'];
  
  // Calculate total score for display when standardized score is hidden
  const totalScore = (childScore?.englishScore || 0) + (childScore?.mathsScore || 0);
  const totalMaxScore = (englishMaxScore || 0) + (mathsMaxScore || 0);

  // Get cell color based on status
  const getStatusCellStyle = (status) => {
    const baseStyle = {
      fontWeight: 'medium',
      fontSize: '0.875rem',
      padding: '8px 16px'
    };
    
    if (status === 'Safe') return { ...baseStyle, backgroundColor: '#e8f5e9', color: '#2e7d32' };
    if (status === 'Borderline') return { ...baseStyle, backgroundColor: '#fff3e0', color: '#ed6c02' };
    if (status === 'Concern') return { ...baseStyle, backgroundColor: '#ffebee', color: '#d32f2f' };
    return baseStyle;
  };

  // Get chip color and variant based on status for mobile cards
  const getStatusChipProps = (status) => {
    if (status === 'Safe') return { 
      color: 'success', 
      variant: 'filled',
      sx: { fontWeight: 'bold', fontSize: '0.75rem' }
    };
    if (status === 'Borderline') return { 
      color: 'warning', 
      variant: 'filled',
      sx: { fontWeight: 'bold', fontSize: '0.75rem' }
    };
    if (status === 'Concern') return { 
      color: 'error', 
      variant: 'filled',
      sx: { fontWeight: 'bold', fontSize: '0.75rem' }
    };
    return { 
      color: 'default', 
      variant: 'outlined',
      sx: { fontWeight: 'bold', fontSize: '0.75rem' }
    };
  };

  // Get standardized score styling based on performance
  const getStandardizedScoreStyle = () => {
    const baseStyle = {
      fontWeight: 'bold',
      border: `2px solid`,
    };
    
    // Use a more sophisticated grading based on standardized score ranges
    if (standardizedScore >= 400) return { 
      ...baseStyle,
      backgroundColor: '#e8f5e9', 
      color: '#2e7d32',
      borderColor: '#4caf50'
    };
    if (standardizedScore >= 300) return { 
      ...baseStyle,
      backgroundColor: '#e3f2fd', 
      color: '#1976d2',
      borderColor: '#2196f3'
    };
    if (standardizedScore >= 200) return { 
      ...baseStyle,
      backgroundColor: '#fff3e0', 
      color: '#ed6c02',
      borderColor: '#ff9800'
    };
    return { 
      ...baseStyle,
      backgroundColor: '#ffebee', 
      color: '#d32f2f',
      borderColor: '#f44336'
    };
  };

  // Mobile Card Layout
  const MobileLayout = () => {
    return (
      <Box sx={{ width: '100%' }}>
        {/* Score Display */}
        <Card sx={{ mb: 2, backgroundColor: '#f8f9fa' }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold', mb: 1, textAlign: 'center' }}>
              {hideStandardisedScore ? 'Total Score' : 'Standardized Score'}
            </Typography>
            <Box 
              sx={{
                ...getStandardizedScoreStyle(),
                textAlign: 'center',
                borderRadius: 2,
                fontSize: '1.2rem',
                py: 1
              }}
            >
              {hideStandardisedScore ? `${totalScore}/${totalMaxScore}` : standardizedScore.toFixed(1)}
            </Box>
          </CardContent>
        </Card>

        {/* School Cards */}
        <Grid container spacing={2}>
          {schoolTypes.map(school => {
            const schoolKey = school.toLowerCase().replace(/\s+/g, '').replace('girls', '').replace('boys', '');
            const schoolData = schoolThresholds[schoolKey] || schoolThresholds[school.toLowerCase()];
            
            const insideChance = getSelectionChance(standardizedScore, schoolData?.inside);
            const outsideChance = getSelectionChance(standardizedScore, schoolData?.outside);
            
            return (
              <Grid item xs={12} key={school}>
                <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'bold', 
                        mb: 1.5, 
                        fontSize: '0.9rem',
                        textAlign: 'center',
                        color: '#1976d2'
                      }}
                    >
                      {school}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'medium' }}>
                        Inside Catchment:
                      </Typography>
                      <Chip 
                        label={insideChance} 
                        size="small"
                        {...getStatusChipProps(insideChance)}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 'medium' }}>
                        Outside Catchment:
                      </Typography>
                      <Chip 
                        label={outsideChance} 
                        size="small"
                        {...getStatusChipProps(outsideChance)}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    );
  };

  // Desktop Table Layout
  const DesktopLayout = () => {
    return (
      <Box sx={{ 
        width: '100%', 
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: 6,
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: '#f1f1f1',
          borderRadius: 3,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#c1c1c1',
          borderRadius: 3,
          '&:hover': {
            backgroundColor: '#a8a8a8',
          },
        },
      }}>
        <TableContainer 
          component={Paper} 
          elevation={0} 
          sx={{ 
            border: '1px solid #f0f0f0', 
            mb: 2, 
            mt: 2
          }}
        >
          <Table size="medium">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell 
                  colSpan={schoolTypes.length * 2 + 1} 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold', 
                    fontSize: '1rem',
                    padding: '16px'
                  }}
                >
                  School Selection Chances (Based on {hideStandardisedScore ? 'Total Score' : 'Standardized Score'})
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 'bold', 
                  fontSize: '0.95rem',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  padding: '8px 16px'
                }}>
                  {hideStandardisedScore ? 'Total Score' : 'Standardized Score'}
                </TableCell>
                {schoolTypes.map(school => (
                  <TableCell 
                    colSpan={2} 
                    align="center" 
                    key={school} 
                    sx={{ 
                      fontWeight: 'medium',
                      fontSize: '0.875rem',
                      padding: '8px 16px'
                    }}
                  >
                    {school}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 'medium',
                  backgroundColor: '#f8f9fa',
                  color: '#495057',
                  fontSize: '0.8rem',
                  padding: '8px 16px'
                }}>
                  
                </TableCell>
                {schoolTypes.map(school => (
                  <React.Fragment key={school}>
                    <TableCell 
                      align="center" 
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 'medium',
                        padding: '8px 16px'
                      }}
                    >
                      Inside
                    </TableCell>
                    <TableCell 
                      align="center" 
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 'medium',
                        padding: '8px 16px'
                      }}
                    >
                      Outside
                    </TableCell>
                  </React.Fragment>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{...getStandardizedScoreStyle(), fontSize: '1.1rem', padding: '8px 16px'}}>
                  {hideStandardisedScore ? `${totalScore}/${totalMaxScore}` : standardizedScore.toFixed(1)}
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
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Mobile view */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <MobileLayout />
      </Box>

      {/* Desktop / tablet view */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <DesktopLayout />
      </Box>
    </Box>
  );
};

export default ChancesOfSelectionTable;