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
  Tab
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
    
    // Sort students by math total (descending)
    const mathRankList = [...studentsWithTotals]
      .sort((a, b) => b.mathTotal - a.mathTotal)
      .map((student, index) => ({ 
        id: student.id, 
        rank: index > 0 && student.mathTotal === studentsWithTotals[index - 1].mathTotal 
          ? mathRankList[index - 1].rank 
          : index + 1 
      }));
    
    // Sort students by english total (descending)
    const englishRankList = [...studentsWithTotals]
      .sort((a, b) => b.englishTotal - a.englishTotal)
      .map((student, index) => ({ 
        id: student.id, 
        rank: index > 0 && student.englishTotal === studentsWithTotals[index - 1].englishTotal 
          ? englishRankList[index - 1].rank 
          : index + 1 
      }));
    
    // Sort students by overall total (descending)
    const overallRankList = [...studentsWithTotals]
      .sort((a, b) => b.overallTotal - a.overallTotal)
      .map((student, index) => ({ 
        id: student.id, 
        rank: index > 0 && student.overallTotal === studentsWithTotals[index - 1].overallTotal 
          ? overallRankList[index - 1].rank 
          : index + 1 
      }));
    
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
      <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
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
    <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
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
            fontSize: '0.9rem'
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
            boxShadow: 1,
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
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText, minWidth: { xs: 120, sm: 150 } }}>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Student Info
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText, minWidth: { xs: 150, sm: 180 } }}>
                    Parent Info
                  </TableCell>
                  
                  {/* Dynamic section columns for current paper */}
                  {currentPaper.sections.map(section => (
                    <TableCell 
                      key={section.sectionId}
                      sx={{ 
                        fontWeight: 'bold', 
                        color: theme.palette.primary.contrastText, 
                        minWidth: { xs: 100, sm: 120 },
                        backgroundColor: section.subject === 'math' 
                          ? theme.palette.info.dark 
                          : theme.palette.success.dark
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === `section_${section.sectionId}`}
                        direction={orderBy === `section_${section.sectionId}` ? order : 'asc'}
                        onClick={() => handleRequestSort(`section_${section.sectionId}`)}
                        sx={{ color: 'white' }}
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
                  ))}
                  
                  {/* Total column for current paper */}
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: theme.palette.primary.contrastText, 
                      minWidth: { xs: 80, sm: 100 },
                      backgroundColor: theme.palette.warning.dark
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold' }}>
                      {currentPaper.paperName}<br />Total
                    </Typography>
                  </TableCell>
                  
                  {/* Overall Ranks column */}
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: theme.palette.primary.contrastText, 
                      minWidth: { xs: 130, sm: 150 },
                      backgroundColor: theme.palette.secondary.dark
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === 'overallRank'}
                      direction={orderBy === 'overallRank' ? order : 'asc'}
                      onClick={() => handleRequestSort('overallRank')}
                      sx={{ color: 'white' }}
                    >
                      Overall Total
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortStudents(students).map((student) => {
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
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}
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
                                  sx: { borderRadius: 1.5, height: { xs: '35px', sm: '40px' } },
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
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                          <Typography sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
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
                                  bgcolor: theme.palette.info.main, 
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
                              sx={{ width: '100%', justifyContent: 'space-between', height: 'auto', py: 0.5 }}
                            />
                          </Grid>
                          
                          {/* English subject total */}
                          <Grid item xs={12}>
                            <Chip 
                              icon={
                                <Box sx={{ 
                                  bgcolor: theme.palette.success.main, 
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
                              sx={{ width: '100%', justifyContent: 'space-between', height: 'auto', py: 0.5 }}
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
                              sx={{ width: '100%', justifyContent: 'space-between', height: 'auto', py: 0.5 }}
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