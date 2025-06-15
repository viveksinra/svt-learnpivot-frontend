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
  alpha,
  Fade
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
  
  // Handle tab change with smooth transition
  const handleTabChange = (event, newValue) => {
    if (newValue !== currentPaperIndex) {
      setCurrentPaperIndex(newValue);
    }
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

  // Sorting function for student data
  const sortStudents = (students) => {
    if (!students || students.length === 0) return [];
    
    // Add display totals for sorting, but use ranks from props
    const studentsWithDisplayTotals = students.map(student => {
      const { total: mathTotal } = calculateSubjectTotal(student, 'math');
      const { total: englishTotal } = calculateSubjectTotal(student, 'english');
      const { total: overallTotal } = calculateOverallTotal(student);
      return { ...student, mathTotal, englishTotal, overallTotal };
    });
    
    return [...studentsWithDisplayTotals].sort((a, b) => {
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
        // Use a large number for unranked students to push them to the bottom
        aValue = a.overallRank || 9999;
        bValue = b.overallRank || 9999;
        // For ranks, ascending order is what's usually wanted (1, 2, 3...)
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (orderBy.startsWith('section_')) {
        // Sort by individual section score
        const sectionId = orderBy.replace('section_', '');
        aValue = Number(a.scores?.[sectionId] || 0);
        bValue = Number(b.scores?.[sectionId] || 0);
      }
      
      // Default score sorting (higher is better)
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };
  
  if (paperSections.length === 0) {
    return (
      <Card elevation={0} sx={{ mb: 2, borderRadius: 2, p: 2, bgcolor: 'transparent' }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Please define papers and sections in the Exam Structure section above before entering student scores.
        </Alert>
      </Card>
    );
  }
  
  // Get current paper sections
  const currentPaper = paperSections[currentPaperIndex] || { sections: [] };
  
  return (
    <Card elevation={0} sx={{ 
      mb: 2, 
      borderRadius: 2, 
      p: 2, 
      bgcolor: 'transparent'
    }}>
      {/* Enhanced Paper Tabs for navigation */}
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        mb: 2,
        backgroundColor: 'white',
        borderRadius: '8px 8px 0 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Tabs 
          value={currentPaperIndex}
          onChange={handleTabChange}
          variant="fullWidth"
          scrollButtons="auto"
          allowScrollButtonsMobile
          TabIndicatorProps={{
            style: {
              height: 3,
              borderRadius: '3px 3px 0 0',
              backgroundColor: theme.palette.primary.main,
            }
          }}
          sx={{ 
            '& .MuiTab-root': {
              fontWeight: 'bold',
              fontSize: '0.85rem',
              minHeight: 48,
              py: 1.5,
              px: 2,
              transition: 'all 0.3s ease',
              textTransform: 'none',
              '&.Mui-selected': {
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                fontWeight: 'bold'
              },
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                color: theme.palette.primary.main,
              }
            }
          }}
        >
          {paperSections.map((paper, index) => (
            <Tab 
              key={paper.paperId} 
              label={
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" fontWeight="inherit">
                    {paper.paperName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {paper.sections.length} sections
                  </Typography>
                </Box>
              } 
              value={index} 
            />
          ))}
        </Tabs>
      </Box>
      
      {/* Students Table with Smooth Transitions */}
      {!students || students.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Alert
            severity="info"
            variant="outlined"
            icon={<InfoOutlinedIcon fontSize="inherit" />}
            sx={{ borderRadius: 2, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}
          >
            No students found for this mock test and batch.
          </Alert>
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={isReloading ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
              onClick={handleReload}
              disabled={isReloading || actionLoading}
              size="small"
              sx={{ 
                borderRadius: 2,
                px: 2,
                py: 1
              }}
            >
              {isReloading ? 'Reloading...' : 'Reload Students'}
            </Button>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            If students should be available, try reloading or check if the student data is correctly uploaded.
          </Typography>
        </Box>
      ) : (
        <Fade in={true} timeout={300}>
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
              '& .MuiTableCell-root': { 
                py: 1,
                px: 1,
                fontSize: '0.8rem'
              },
              width: '100%',
              maxWidth: '100vw'
            }}
          >
            <Box sx={{ overflowX: 'auto', width: '100%' }}>
              <Table size="small">
                <TableHead sx={{ 
                  background: 'linear-gradient(135deg, #3949ab 0%, #303f9f 100%)'
                }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', minWidth: 120, width: 120 }}>
                      <TableSortLabel
                        active={orderBy === 'name'}
                        direction={orderBy === 'name' ? order : 'asc'}
                        onClick={() => handleRequestSort('name')}
                        sx={{ color: 'white', '&.MuiTableSortLabel-active': { color: 'white' } }}
                      >
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem', lineHeight: 1.2 }}>
                          Student Info
                        </Typography>
                      </TableSortLabel>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white', minWidth: 130, width: 130 }}>
                      <Typography variant="body2" sx={{ color: 'white',   fontWeight: 'bold', fontSize: '0.8rem', lineHeight: 1.2 }}>
                        Parent Info
                      </Typography>
                    </TableCell>
                    
                    {/* Enhanced Dynamic section columns for current paper */}
                    {currentPaper.sections.map(section => {
                      // Get appropriate colors for subject
                      const sectionColor = section.subject === 'math' 
                        ? 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' 
                        : section.subject === 'english'
                        ? 'linear-gradient(135deg, #00897B 0%, #00695C 100%)'
                        : 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)';
                      
                      return (
                        <TableCell 
                          key={section.sectionId}
                          sx={{ 
                            fontWeight: 'bold', 
                            color: 'white', 
                            minWidth: 85,
                            width: 85,
                            background: sectionColor,
                            textAlign: 'center',
                            py: 1
                          }}
                        >
                          <TableSortLabel
                            active={orderBy === `section_${section.sectionId}`}
                            direction={orderBy === `section_${section.sectionId}` ? order : 'asc'}
                            onClick={() => handleRequestSort(`section_${section.sectionId}`)}
                            sx={{ color: 'white', '&.MuiTableSortLabel-active': { color: 'white' } }}
                          >
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 'bold', 
                                fontSize: '0.8rem', 
                                lineHeight: 1.1,
                                textAlign: 'center',
                                wordBreak: 'break-word',
                                color: 'white'
                              }}>
                                {section.sectionName || 'Unnamed'}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                fontSize: '0.7rem',
                                opacity: 0.9,
                                fontWeight: 'medium'
                              }}>
                                Max: {section.maxScore}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                fontSize: '0.65rem',
                                opacity: 0.8,
                                textTransform: 'capitalize'
                              }}>
                                {section.subject === 'math' ? 'Mathematics' : 
                                 section.subject === 'english' ? 'English' : 
                                 section.subject === 'creativeWriting' ? 'Creative Writing' : section.subject}
                              </Typography>
                            </Box>
                          </TableSortLabel>
                        </TableCell>
                      );
                    })}
                    
                    {/* Enhanced Paper total column */}
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'white', 
                        minWidth: 85,
                        width: 85,
                        background: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
                        textAlign: 'center'
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem', lineHeight: 1.1 }}>
                          {currentPaper.paperName}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                          Total Score
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    {/* Enhanced Overall Summary column */}
                    <TableCell 
                      sx={{ 
                        fontWeight: 'bold', 
                        color: 'white', 
                        minWidth: 140,
                        width: 140,
                        background: 'linear-gradient(135deg, #7B1FA2 0%, #6A1B9A 100%)',
                        textAlign: 'center'
                      }}
                    >
                      <TableSortLabel
                        active={orderBy === 'overallRank'}
                        direction={orderBy === 'overallRank' ? order : 'asc'}
                        onClick={() => handleRequestSort('overallRank')}
                        sx={{ color: 'white', '&.MuiTableSortLabel-active': { color: 'white' } }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.8rem', lineHeight: 1.1 }}>
                            Overall Summary
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.9 }}>
                            All Subjects & Rank
                          </Typography>
                        </Box>
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
                          '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.primary.light, 0.03) },
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.light, 0.08),
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          } 
                        }}
                      >
                        <TableCell sx={{ width: 120 }}>
                          <Typography variant="body2" fontWeight="medium" sx={{ fontSize: '0.8rem', lineHeight: 1.2 }}>
                            {student.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                            {student.year}
                          </Typography>
                          <Chip 
                            label={`#${student.overallRank || '-'}`} 
                            color={getRankBadgeColor(student.overallRank)}
                            size="small" 
                            sx={{ 
                              mt: 0.5, 
                              height: 18,
                              fontSize: '0.65rem',
                              '& .MuiChip-label': { px: 0.5 }
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ width: 130 }}>
                          <Typography variant="caption" sx={{ fontSize: '0.75rem', lineHeight: 1.2, fontWeight: 'medium' }}>
                            {student.parentName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', display: 'block', wordBreak: 'break-word' }}>
                            {student.parentEmail}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                            {student.parentMobile}
                          </Typography>
                        </TableCell>
                        
                        {/* Render section score inputs for current paper */}
                        {currentPaper.sections.map(section => (
                          <TableCell key={section.sectionId} sx={{ width: 85, textAlign: 'center' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <TextField
                                  type="number"
                                  value={student.scores?.[section.sectionId] || ''}
                                  onChange={(e) => handleScoreChange(student.id, section.sectionId, e.target.value)}
                                  InputProps={{
                                    inputProps: {
                                      min: 0,
                                      max: section.maxScore,
                                      style: { textAlign: 'center', fontSize: '0.8rem' },
                                    },
                                    sx: { 
                                      borderRadius: 1, 
                                      height: 32,
                                      backgroundColor: 'white',
                                      '& input': { py: 0.5, px: 0.5 }
                                    },
                                  }}
                                  size="small"
                                  disabled={actionLoading}
                                  sx={{ width: 55 }}
                                />
                                {student.scores?.[section.sectionId] === String(section.maxScore) && section.maxScore > 0 && (
                                  <StarIcon sx={{ color: theme.palette.warning.main, fontSize: '1rem' }} />
                                )}
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={calculateProgress(student.scores?.[section.sectionId] || 0, section.maxScore)}
                                  size={14}
                                  color={
                                    calculateProgress(student.scores?.[section.sectionId] || 0, section.maxScore) > 70 
                                      ? 'success' 
                                      : calculateProgress(student.scores?.[section.sectionId] || 0, section.maxScore) > 40 
                                        ? 'warning' 
                                        : 'error'
                                  }
                                />
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                                  {Math.round(calculateProgress(student.scores?.[section.sectionId] || 0, section.maxScore))}%
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                        ))}
                        
                        {/* Paper total column */}
                        <TableCell sx={{ background: alpha(theme.palette.secondary.light, 0.1), width: 85, textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: 0.5 }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: theme.palette.text.primary }}>
                              {paperTotal}/{paperMaxTotal}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <CircularProgress
                                variant="determinate"
                                value={paperMaxTotal > 0 ? (paperTotal / paperMaxTotal) * 100 : 0}
                                size={16}
                                color={
                                  paperMaxTotal > 0 && (paperTotal / paperMaxTotal) > 0.7 
                                    ? 'success' 
                                    : paperMaxTotal > 0 && (paperTotal / paperMaxTotal) > 0.4 
                                      ? 'warning' 
                                      : 'error'
                                }
                              />
                              <Typography variant="caption" sx={{ fontSize: '0.65rem' }}>
                                {paperMaxTotal > 0 ? Math.round((paperTotal / paperMaxTotal) * 100) : 0}%
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        {/* Overall summary column */}
                        <TableCell sx={{ width: 140 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {/* Math subject total */}
                            <Chip 
                              icon={
                                <Box sx={{ 
                                  background: '#2196F3',
                                  color: 'white',
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.65rem',
                                  fontWeight: 'bold'
                                }}>
                                  M
                                </Box>
                              } 
                              label={`${mathTotal}/${mathMaxTotal}`}
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                height: 20, 
                                fontSize: '0.65rem',
                                borderColor: alpha(theme.palette.info.main, 0.3),
                                '& .MuiChip-label': { px: 0.5 },
                                '& .MuiChip-icon': { mr: 0.5 }
                              }}
                            />
                            
                            {/* English subject total */}
                            <Chip 
                              icon={
                                <Box sx={{ 
                                  background: '#00897B',
                                  color: 'white',
                                  width: 16,
                                  height: 16,
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.65rem',
                                  fontWeight: 'bold'
                                }}>
                                  E
                                </Box>
                              } 
                              label={`${englishTotal}/${englishMaxTotal}`}
                              size="small" 
                              variant="outlined"
                              sx={{ 
                                height: 20, 
                                fontSize: '0.65rem',
                                borderColor: alpha(theme.palette.success.main, 0.3),
                                '& .MuiChip-label': { px: 0.5 },
                                '& .MuiChip-icon': { mr: 0.5 }
                              }}
                            />
                            
                            {/* Grand total */}
                            <Chip 
                              icon={<EmojiEventsIcon sx={{ fontSize: '0.85rem' }} />}
                              label={`${overallTotal}/${overallMaxTotal} (${Math.round(overallPercentage)}%) #${student.overallRank || '-'}`}
                              size="small" 
                              variant="filled"
                              color="secondary"
                              sx={{ 
                                height: 22, 
                                fontSize: '0.65rem',
                                background: 'linear-gradient(135deg, #7B1FA2 0%, #6A1B9A 100%)',
                                color: 'white',
                                '& .MuiChip-label': { px: 0.5 },
                                '& .MuiChip-icon': { mr: 0.5, color: 'white' }
                              }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </TableContainer>
        </Fade>
      )}
    </Card>
  );
};

export default StudentScoresTable; 