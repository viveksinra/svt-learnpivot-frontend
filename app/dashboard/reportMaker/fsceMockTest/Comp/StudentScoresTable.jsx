import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  Divider, 
  Alert, 
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  TextField,
  Tooltip,
  Chip,
  useTheme,
  TableSortLabel,
  Button,
  Grid,
  Badge,
  Tabs,
  Tab,
  alpha
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import RefreshIcon from '@mui/icons-material/Refresh';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useState, useEffect } from 'react';

const StudentScoresTable = ({ 
  students, 
  paperSections, 
  actionLoading, 
  handleScoreChange,
  onReloadStudents
}) => {
  const theme = useTheme();
  
  // State for tab navigation between papers
  const [currentPaperIndex, setCurrentPaperIndex] = useState(0);
  
  // Add sorting state
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [isReloading, setIsReloading] = useState(false);
  
  // Update current paper index if papers change
  useEffect(() => {
    if (paperSections.length === 0) {
      setCurrentPaperIndex(0);
    } else if (currentPaperIndex >= paperSections.length) {
      setCurrentPaperIndex(paperSections.length - 1);
    }
  }, [paperSections, currentPaperIndex]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentPaperIndex(newValue);
  };
  
  // Handle reload button click
  const handleReload = () => {
    setIsReloading(true);
    if (onReloadStudents) {
      onReloadStudents();
      // Reset reloading state after 1.5 seconds to show the spinner for a bit
      setTimeout(() => {
        setIsReloading(false);
      }, 1500);
    } else {
      setIsReloading(false);
    }
  };
  
  // Calculate progress for a student in a specific section
  const calculateProgress = (score, maxScore) => {
    if (score === '' || maxScore === 0) return 0;
    
    const numericScore = Number(score);
    return (numericScore / maxScore) * 100;
  };

  // Calculate total score for a subject
  const calculateSubjectTotal = (student, subject) => {
    let total = 0;
    let maxTotal = 0;
    
    paperSections.forEach(paper => {
      paper.sections.forEach(section => {
        if (section.subject === subject) {
          const sectionId = section.sectionId;
          const score = student.scores?.[sectionId] || '';
          if (score !== '') {
            total += Number(score);
          }
          maxTotal += section.maxScore;
        }
      });
    });
    
    return { total, maxTotal };
  };
  
  // Calculate student's overall score
  const calculateOverallTotal = (student) => {
    let total = 0;
    let maxTotal = 0;
    
    paperSections.forEach(paper => {
      paper.sections.forEach(section => {
        const sectionId = section.sectionId;
        const score = student.scores?.[sectionId] || '';
        if (score !== '') {
          total += Number(score);
        }
        maxTotal += section.maxScore;
      });
    });
    
    return { total, maxTotal, percentage: maxTotal > 0 ? (total / maxTotal) * 100 : 0 };
  };

  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Get badge color based on rank
  const getRankBadgeColor = (rank) => {
    if (rank === 0) return 'default';
    if (rank === 1) return 'success';
    if (rank === 2) return 'primary';
    if (rank === 3) return 'secondary';
    return 'default';
  };

  // Calculate student ranks
  const calculateStudentRanks = () => {
    if (!students || students.length === 0) return [];
    
    // Create a copy of students with calculated totals
    const studentsWithTotals = students.map(student => {
      const { total: mathTotal } = calculateSubjectTotal(student, 'math');
      const { total: englishTotal } = calculateSubjectTotal(student, 'english');
      const { total: overallTotal } = calculateOverallTotal(student);
      
      return {
        ...student,
        mathTotal,
        englishTotal,
        overallTotal
      };
    });
    
    // Helper function to calculate ranks for a given score property
    const calculateRanks = (students, scoreProperty) => {
      const sorted = [...students].sort((a, b) => b[scoreProperty] - a[scoreProperty]);
      let currentRank = 1;
      let lastScore = null;
      
      return sorted.map((student, index) => {
        const score = student[scoreProperty];
        if (lastScore !== null && score !== lastScore) {
          currentRank = index + 1;
        }
        lastScore = score;
        
        return {
          id: student.id,
          rank: score > 0 ? currentRank : 0
        };
      });
    };
    
    // Calculate ranks for each subject
    const mathRankList = calculateRanks(studentsWithTotals, 'mathTotal');
    const englishRankList = calculateRanks(studentsWithTotals, 'englishTotal');
    const overallRankList = calculateRanks(studentsWithTotals, 'overallTotal');
    
    // Add ranks to students
    return studentsWithTotals.map(student => ({
      ...student,
      mathRank: mathRankList.find(r => r.id === student.id)?.rank || 0,
      englishRank: englishRankList.find(r => r.id === student.id)?.rank || 0,
      overallRank: overallRankList.find(r => r.id === student.id)?.rank || 0
    }));
  };

  // Sorting function for student data
  const sortStudents = (students) => {
    if (!students || students.length === 0) return [];
    
    // Calculate ranks and add them to students
    const studentsWithRanks = calculateStudentRanks();
    
    return [...studentsWithRanks].sort((a, b) => {
      let aValue, bValue;
      
      if (orderBy === 'name') {
        aValue = a.name;
        bValue = b.name;
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (orderBy === 'mathTotal') {
        aValue = a.mathTotal || 0;
        bValue = b.mathTotal || 0;
      } else if (orderBy === 'englishTotal') {
        aValue = a.englishTotal || 0;
        bValue = b.englishTotal || 0;
      } else if (orderBy === 'overallTotal') {
        aValue = a.overallTotal || 0;
        bValue = b.overallTotal || 0;
      } else if (orderBy === 'overallRank') {
        aValue = a.overallRank || 999;
        bValue = b.overallRank || 999;
      } else if (orderBy.startsWith('section_')) {
        // Sort by individual section score
        const sectionId = orderBy.replace('section_', '');
        aValue = Number(a.scores?.[sectionId] || 0);
        bValue = Number(b.scores?.[sectionId] || 0);
      }
      
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };
  
  if (paperSections.length === 0) {
    return (
      <Card elevation={3} sx={{ mb: 4, borderRadius: 2, p: { xs: 2, sm: 3 }, bgcolor: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Student Scores
          </Typography>
          <Tooltip title="Enter or edit scores for each student" placement="right">
            <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Alert severity="warning">
          Please define papers and sections in the Exam Structure section above before entering student scores.
        </Alert>
      </Card>
    );
  }
  
  // Get current paper sections
  const currentPaper = paperSections[currentPaperIndex] || { sections: [] };
  
  return (
    <Card elevation={3} sx={{ 
      mb: 4, 
      borderRadius: 2, 
      p: { xs: 2, sm: 3 }, 
      background: 'linear-gradient(to bottom, #ffffff, #f8fafc)',
      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Student Scores
        </Typography>
        <Tooltip title="Enter or edit scores for each student" placement="right">
          <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 2 }} />
      
      {/* Paper Tabs for navigation */}
      <Tabs 
        value={currentPaperIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 3,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            fontWeight: 'bold',
            fontSize: '0.9rem',
            transition: 'all 0.2s',
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '6px 6px 0 0'
            }
          }
        }}
      >
        {paperSections.map((paper, index) => (
          <Tab key={paper.paperId} label={paper.paperName} value={index} />
        ))}
      </Tabs>
      
      {/* Students Table */}
      {!students || students.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Alert
            severity="info"
            variant="outlined"
            icon={<InfoOutlinedIcon fontSize="inherit" />}
            sx={{ borderRadius: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}
          >
            No students found for this mock test and batch.
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={isReloading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
              onClick={handleReload}
              disabled={isReloading || actionLoading}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 'medium'
              }}
            >
              {isReloading ? 'Reloading...' : 'Reload Students'}
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
            If students should be available, try reloading or check if the student data is correctly uploaded.
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            '& .MuiTableCell-root': { 
              py: 2,
              px: { xs: 1, sm: 2 }
            },
            width: '100%',
            maxWidth: '100vw'
          }}
        >
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Table>
              <TableHead sx={{ 
                background: 'linear-gradient(135deg, #3949ab 0%, #303f9f 100%)'
              }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', minWidth: { xs: 120, sm: 150 } }}>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                      sx={{ color: 'white', '&.MuiTableSortLabel-active': { color: 'white' } }}
                    >
                      Student Info
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: 'white', minWidth: { xs: 150, sm: 180 } }}>
                    Parent Info
                  </TableCell>
                  
                  {/* Dynamic section columns for current paper */}
                  {currentPaper.sections.map(section => {
                    // Get appropriate colors for subject
                    const sectionColor = section.subject === 'math' 
                      ? 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' 
                      : 'linear-gradient(135deg, #00897B 0%, #00695C 100%)';
                    
                    return (
                      <TableCell 
                        key={section.sectionId}
                        sx={{ 
                          fontWeight: 'bold', 
                          color: 'white', 
                          minWidth: { xs: 100, sm: 120 },
                          background: sectionColor
                        }}
                      >
                        <TableSortLabel
                          active={orderBy === `section_${section.sectionId}`}
                          direction={orderBy === `section_${section.sectionId}` ? order : 'asc'}
                          onClick={() => handleRequestSort(`section_${section.sectionId}`)}
                          sx={{ color: 'white', '&.MuiTableSortLabel-active': { color: 'white' } }}
                        >
                          {section.sectionName || 'Unnamed Section'}
                        </TableSortLabel> <br />
                        <Chip 
                          label={`Max: ${section.maxScore}`} 
                          size="small" 
                          sx={{ mt: 0.5, color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }} 
                        />
                        <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.7)', mt: 0.5 }}>
                          {section.subject === 'math' ? 'Mathematics' : 'English'}
                        </Typography>
                      </TableCell>
                    );
                  })}
                  
                  {/* Total column for current paper */}
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: 'white', 
                      minWidth: { xs: 80, sm: 100 },
                      background: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)'
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold', color: 'white' }}>
                      {currentPaper.paperName}<br />Total
                    </Typography>
                  </TableCell>
                  
                  {/* Overall Ranks column */}
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: 'white', 
                      minWidth: { xs: 130, sm: 150 },
                      background: 'linear-gradient(135deg, #7B1FA2 0%, #6A1B9A 100%)'
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === 'overallRank'}
                      direction={orderBy === 'overallRank' ? order : 'asc'}
                      onClick={() => handleRequestSort('overallRank')}
                      sx={{ color: 'white', '&.MuiTableSortLabel-active': { color: 'white' } }}
                    >
                      Overall Total
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortStudents(students).map((student, index) => {
                  // Calculate totals for the current paper
                  let paperTotal = 0;
                  let paperMaxTotal = 0;
                  
                  currentPaper.sections.forEach(section => {
                    const score = student.scores?.[section.sectionId] || '';
                    if (score !== '') {
                      paperTotal += Number(score);
                    }
                    paperMaxTotal += section.maxScore;
                  });
                  
                  // Calculate subject and overall totals
                  const { total: mathTotal, maxTotal: mathMaxTotal } = calculateSubjectTotal(student, 'math');
                  const { total: englishTotal, maxTotal: englishMaxTotal } = calculateSubjectTotal(student, 'english');
                  const { total: overallTotal, maxTotal: overallMaxTotal, percentage: overallPercentage } = calculateOverallTotal(student);

                  return (
                    <TableRow
                      key={student.id}
                      hover
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.primary.light, 0.05) },
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.light, 0.1),
                        } 
                      }}
                    >
                      <TableCell>
                        <Typography fontWeight="medium">{student.name}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {student.year}
                        </Typography>
                        <Chip 
                          label={`Rank: ${student.overallRank || '-'}`} 
                          color={getRankBadgeColor(student.overallRank)}
                          size="small" 
                          sx={{ mt: 0.5 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>{student.parentName}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ wordBreak: 'break-word' }}>
                          {student.parentEmail}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {student.parentMobile}
                        </Typography>
                      </TableCell>
                      
                      {/* Render section score inputs for current paper */}
                      {currentPaper.sections.map(section => (
                        <TableCell key={section.sectionId}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Tooltip title={`Enter ${section.sectionName} score (max ${section.maxScore})`}>
                              <TextField
                                type="number"
                                value={student.scores?.[section.sectionId] || ''}
                                onChange={(e) => handleScoreChange(student.id, section.sectionId, e.target.value)}
                                InputProps={{
                                  inputProps: {
                                    min: 0,
                                    max: section.maxScore,
                                    style: { textAlign: 'center' },
                                  },
                                  sx: { 
                                    borderRadius: 1.5, 
                                    height: { xs: '35px', sm: '40px' },
                                    backgroundColor: 'white'
                                  },
                                }}
                                size="small"
                                disabled={actionLoading}
                                sx={{ width: { xs: '70px', sm: '90px' } }}
                              />
                            </Tooltip>
                            {student.scores?.[section.sectionId] === String(section.maxScore) && section.maxScore > 0 && (
                              <Tooltip title="Max Score!">
                                <StarIcon sx={{ color: theme.palette.warning.main, fontSize: '1.2rem' }} />
                              </Tooltip>
                            )}
                          </Box>
                          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={`${Math.round(calculateProgress(student.scores?.[section.sectionId] || 0, section.maxScore))}% of maximum score`}>
                              <CircularProgress
                                variant="determinate"
                                value={calculateProgress(student.scores?.[section.sectionId] || 0, section.maxScore)}
                                size={{ xs: 16, sm: 20 }}
                                color={
                                  calculateProgress(student.scores?.[section.sectionId] || 0, section.maxScore) > 70 
                                    ? 'success' 
                                    : calculateProgress(student.scores?.[section.sectionId] || 0, section.maxScore) > 40 
                                      ? 'warning' 
                                      : 'error'
                                }
                                sx={{ mr: 1 }}
                              />
                            </Tooltip>
                            <Typography variant="caption">
                              {Math.round(calculateProgress(student.scores?.[section.sectionId] || 0, section.maxScore))}%
                            </Typography>
                          </Box>
                        </TableCell>
                      ))}
                      
                      {/* Paper total column */}
                      <TableCell sx={{ background: alpha(theme.palette.secondary.light, 0.1) }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' }, color: theme.palette.text.primary }}>
                            {paperTotal}/{paperMaxTotal}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <CircularProgress
                              variant="determinate"
                              value={paperMaxTotal > 0 ? (paperTotal / paperMaxTotal) * 100 : 0}
                              size={{ xs: 20, sm: 24 }}
                              color={
                                paperMaxTotal > 0 && (paperTotal / paperMaxTotal) > 0.7 
                                  ? 'success' 
                                  : paperMaxTotal > 0 && (paperTotal / paperMaxTotal) > 0.4 
                                    ? 'warning' 
                                    : 'error'
                              }
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="caption">
                              {paperMaxTotal > 0 ? Math.round((paperTotal / paperMaxTotal) * 100) : 0}%
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      
                      {/* Overall totals column */}
                      <TableCell>
                        <Grid container spacing={1}>
                          {/* Math subject total */}
                          <Grid item xs={12}>
                            <Chip 
                              icon={
                                <Box sx={{ 
                                  background: 'linear-gradient(135deg, #4776E6 0%, #2756c4 100%)',
                                  color: 'white',
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold'
                                }}>
                                  M
                                </Box>
                              } 
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                  <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                                    <strong>Math:</strong> {mathTotal}/{mathMaxTotal}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label={`#${student.mathRank || '-'}`}
                                    color={getRankBadgeColor(student.mathRank)}
                                    sx={{ 
                                      height: '18px',
                                      '& .MuiChip-label': { 
                                        px: 0.5,
                                        fontSize: '0.6rem',
                                        fontWeight: 'bold'
                                      }
                                    }}
                                  />
                                </Box>
                              }
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                width: '100%', 
                                justifyContent: 'space-between', 
                                height: 'auto', 
                                py: 0.5,
                                borderColor: alpha(theme.palette.info.main, 0.5),
                                '&:hover': {
                                  borderColor: theme.palette.info.main,
                                  backgroundColor: alpha(theme.palette.info.main, 0.05)
                                }
                              }}
                            />
                          </Grid>
                          
                          {/* English subject total */}
                          <Grid item xs={12}>
                            <Chip 
                              icon={
                                <Box sx={{ 
                                  background: 'linear-gradient(135deg, #1D976C 0%, #157252 100%)',
                                  color: 'white',
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold'
                                }}>
                                  E
                                </Box>
                              } 
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                  <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                                    <strong>Eng:</strong> {englishTotal}/{englishMaxTotal}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label={`#${student.englishRank || '-'}`}
                                    color={getRankBadgeColor(student.englishRank)}
                                    sx={{ 
                                      height: '18px',
                                      '& .MuiChip-label': { 
                                        px: 0.5,
                                        fontSize: '0.6rem',
                                        fontWeight: 'bold'
                                      }
                                    }}
                                  />
                                </Box>
                              }
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                width: '100%', 
                                justifyContent: 'space-between', 
                                height: 'auto', 
                                py: 0.5,
                                borderColor: alpha(theme.palette.success.main, 0.5),
                                '&:hover': {
                                  borderColor: theme.palette.success.main,
                                  backgroundColor: alpha(theme.palette.success.main, 0.05)
                                }
                              }}
                            />
                          </Grid>
                          
                          {/* Grand total */}
                          <Grid item xs={12}>
                            <Chip 
                              icon={<EmojiEventsIcon fontSize="small" />}
                              label={
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.75rem' }}>
                                    {overallTotal}/{overallMaxTotal} ({Math.round(overallPercentage)}%)
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label={`#${student.overallRank || '-'}`}
                                    color={getRankBadgeColor(student.overallRank)}
                                    sx={{ 
                                      height: '20px',
                                      '& .MuiChip-label': { 
                                        px: 0.5,
                                        fontSize: '0.7rem',
                                        fontWeight: 'bold'
                                      }
                                    }}
                                  />
                                </Box>
                              }
                              size="small" 
                              variant="filled"
                              color="secondary"
                              sx={{ 
                                width: '100%', 
                                justifyContent: 'space-between', 
                                height: 'auto', 
                                py: 0.5,
                                background: 'linear-gradient(135deg, #7B1FA2 0%, #6A1B9A 100%)'
                              }}
                            />
                          </Grid>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </TableContainer>
      )}
    </Card>
  );
};

export default StudentScoresTable; 