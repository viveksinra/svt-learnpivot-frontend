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
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  Button
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

  // State for showing more students on mobile
  const [showCount, setShowCount] = React.useState(10);

  const handleShowMore = () => {
    setShowCount(prev => Math.min(prev + 10, data.length));
  };

  const handleShowLess = () => {
    setShowCount(10);
  };

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

  const getStatusChipProps = (status) => {
    if (status === 'Safe') return { 
      color: 'success', 
      size: 'small'
    };
    if (status === 'Borderline') return { 
      color: 'warning', 
      size: 'small'
    };
    if (status === 'Concern') return { 
      color: 'error', 
      size: 'small'
    };
    return { 
      color: 'default', 
      size: 'small'
    };
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

  const getDisplayName = (student, index) => {
    // If this is the current child, show their actual name
    if (student.childId?.toString() === currentChildId) {
      return currentChildName || student.childName || `${isBoysTable ? 'Boy' : 'Girl'} ${index + 1}`;
    }
    // For other students, show Boy/Girl with number
    return `${isBoysTable ? 'Boy' : 'Girl'} ${index + 1}`;
  };

  // Mobile Card Layout
  const MobileLayout = () => {
    return (
      <Box sx={{ width: '100%' }}>
        {data.slice(0, showCount).map((student, index) => {
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
          const isCurrentChild = student.childId?.toString() === currentChildId;

          return (
            <Card 
              key={student.childId || index} 
              sx={{ 
                mb: 2, 
                border: isCurrentChild ? '2px solid #1976d2' : '1px solid #e0e0e0',
                backgroundColor: isCurrentChild ? '#e3f2fd' : 'white'
              }}
            >
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                {/* Header with Rank and Name */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: isCurrentChild ? '#1976d2' : 'text.primary'
                      }}
                    >
                      #{index + 1}
                    </Typography>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: isCurrentChild ? 'bold' : 'medium',
                        color: isCurrentChild ? '#1976d2' : 'text.primary'
                      }}
                    >
                      {getDisplayName(student, index)}
                    </Typography>
                  </Box>
                </Box>

                {/* Scores */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">English</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {student.englishScore}/{englishMaxScore}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Maths</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {student.mathsScore}/{mathsMaxScore}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Total</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {totalScore}/{totalMaxScore}
                    </Typography>
                  </Grid>
                </Grid>

                {!hideStandardisedScore && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" color="text.secondary">
                      Standardized Score: <strong>{standardizedScore.toFixed(1)}</strong>
                    </Typography>
                  </>
                )}

                {/* School Selection Status */}
                <Divider sx={{ my: 1 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  Selection Chances:
                </Typography>
                <Grid container spacing={1}>
                  {relevantSchools.map(school => {
                    const insideStatus = getSelectionStatus(standardizedScore, school, 'inside');
                    const outsideStatus = getSelectionStatus(standardizedScore, school, 'outside');
                    
                    return (
                      <Grid item xs={6} key={school}>
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ fontWeight: 'medium', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                            {school}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                            <Chip 
                              label={`In: ${insideStatus}`} 
                              {...getStatusChipProps(insideStatus)}
                              sx={{
                                ...getStatusChipProps(insideStatus).sx,
                                fontSize: '0.65rem',
                                height: '18px',
                                '& .MuiChip-label': {
                                  padding: '0 6px'
                                }
                              }}
                            />
                            <Chip 
                              label={`Out: ${outsideStatus}`} 
                              {...getStatusChipProps(outsideStatus)}
                              sx={{
                                ...getStatusChipProps(outsideStatus).sx,
                                fontSize: '0.65rem',
                                height: '18px',
                                '& .MuiChip-label': {
                                  padding: '0 6px'
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          );
        })}
        
        {showCount < data.length && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleShowMore}
              sx={{ mr: 1 }}
            >
              Show More ({data.length - showCount} remaining)
            </Button>
            {showCount > 10 && (
              <Button 
                variant="text" 
                onClick={handleShowLess}
                size="small"
              >
                Show Less
              </Button>
            )}
          </Box>
        )}
        
        {showCount >= data.length && data.length > 10 && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Showing all {data.length} students
            </Typography>
            <Button 
              variant="text" 
              onClick={handleShowLess}
              size="small"
            >
              Show Less
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  // Desktop Table Layout (existing code)
  const DesktopLayout = () => {
    return (
      <TableContainer 
        component={Paper} 
        elevation={0}
        sx={{
          border: '1px solid #f0f0f0',
          maxHeight: 600,
          width: '100%',
          overflowX: 'auto',
          // Add horizontal padding on mobile so the table can scroll flush to the edges
          px: { xs: 0, sm: 0 }
        }}
      >
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

  return (
    <Box sx={{ width: '100%' }}>
      {/* Mobile view */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <MobileLayout />
      </Box>

      {/* Desktop view */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <DesktopLayout />
      </Box>
    </Box>
  );
};

export default RankingTable; 