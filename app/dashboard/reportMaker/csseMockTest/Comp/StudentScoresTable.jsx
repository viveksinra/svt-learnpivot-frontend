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
  Button
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useState, useEffect } from 'react';

const StudentScoresTable = ({ 
  students, 
  maxScores, 
  actionLoading, 
  handleScoreChange,
  onReloadStudents
}) => {
  const theme = useTheme();
  
  // Add sorting state
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [isReloading, setIsReloading] = useState(false);
  
  // Debug students array
  useEffect(() => {
    console.log('StudentScoresTable received students:', students);
    console.log('Students array length:', students ? students.length : 0);
  }, [students]);
  
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
  
  // Calculate progress for a student
  const calculateProgress = (mathScore, englishScore) => {
    if (mathScore === '' && englishScore === '') return 0;
    
    const mathValue = mathScore === '' ? 0 : Number(mathScore);
    const englishValue = englishScore === '' ? 0 : Number(englishScore);
    
    const maxTotal = maxScores.math + maxScores.english;
    const studentTotal = mathValue + englishValue;
    
    return (studentTotal / maxTotal) * 100;
  };

  // Handle sort request
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sorting function for student data
  const sortStudents = (students) => {
    if (!students || students.length === 0) return [];
    
    return [...students].sort((a, b) => {
      let aValue, bValue;
      
      if (orderBy === 'name') {
        aValue = a.name;
        bValue = b.name;
        return order === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (orderBy === 'mathScore') {
        aValue = a.mathScore === '' ? -1 : Number(a.mathScore);
        bValue = b.mathScore === '' ? -1 : Number(b.mathScore);
      } else if (orderBy === 'englishScore') {
        aValue = a.englishScore === '' ? -1 : Number(a.englishScore);
        bValue = b.englishScore === '' ? -1 : Number(b.englishScore);
      } else if (orderBy === 'total') {
        const aMath = a.mathScore === '' ? 0 : Number(a.mathScore);
        const aEnglish = a.englishScore === '' ? 0 : Number(a.englishScore);
        const bMath = b.mathScore === '' ? 0 : Number(b.mathScore);
        const bEnglish = b.englishScore === '' ? 0 : Number(b.englishScore);
        
        aValue = aMath + aEnglish;
        bValue = bMath + bEnglish;
        
        // If both students have no scores, sort by name
        if (aValue === 0 && bValue === 0 && a.mathScore === '' && a.englishScore === '' && b.mathScore === '' && b.englishScore === '') {
          return order === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
      }
      
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };
  
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
            '& .MuiTableCell-root': { py: 2 },
          }}
        >
          <Box sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText, minWidth: 150 }}>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleRequestSort('name')}
                    >
                      Student Info
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText, minWidth: 180 }}>
                    Parent Info
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText, minWidth: 120 }}>
                    <TableSortLabel
                      active={orderBy === 'mathScore'}
                      direction={orderBy === 'mathScore' ? order : 'asc'}
                      onClick={() => handleRequestSort('mathScore')}
                    >
                      Math Score
                    </TableSortLabel> <br />
                    <Chip 
                      label={`Max: ${maxScores.math}`} 
                      size="small" 
                      sx={{ mt: 0.5, color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }} 
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText, minWidth: 120 }}>
                    <TableSortLabel
                      active={orderBy === 'englishScore'}
                      direction={orderBy === 'englishScore' ? order : 'asc'}
                      onClick={() => handleRequestSort('englishScore')}
                    >
                      English Score
                    </TableSortLabel> <br />
                    <Chip 
                      label={`Max: ${maxScores.english}`} 
                      size="small" 
                      sx={{ mt: 0.5, color: 'white', bgcolor: 'rgba(255,255,255,0.2)' }} 
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: theme.palette.primary.contrastText, minWidth: 100 }}>
                    <TableSortLabel
                      active={orderBy === 'total'}
                      direction={orderBy === 'total' ? order : 'asc'}
                      onClick={() => handleRequestSort('total')}
                    >
                      Total
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortStudents(students).map((student) => {
                  const mathScore = student.mathScore === '' ? 0 : Number(student.mathScore);
                  const englishScore = student.englishScore === '' ? 0 : Number(student.englishScore);
                  const total = student.mathScore !== '' || student.englishScore !== '' ? mathScore + englishScore : '-';
                  const progress = calculateProgress(student.mathScore, student.englishScore);

                  return (
                    <TableRow
                      key={student.id}
                      hover
                      sx={{ '&:nth-of-type(odd)': { backgroundColor: theme.palette.action.hover } }}
                    >
                      <TableCell>
                        <Typography fontWeight="medium">{student.name}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {student.gender} • {student.year}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{student.parentName}</Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {student.parentEmail}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {student.parentMobile}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Tooltip title={`Enter Math score (max ${maxScores.math})`}>
                            <TextField
                              type="number"
                              value={student.mathScore}
                              onChange={(e) => handleScoreChange(student.id, 'math', e.target.value)}
                              InputProps={{
                                inputProps: {
                                  min: 0,
                                  max: maxScores.math,
                                  style: { textAlign: 'center' },
                                },
                                sx: { borderRadius: 1.5 },
                              }}
                              size="small"
                              disabled={actionLoading}
                              sx={{ width: '90px' }}
                            />
                          </Tooltip>
                          {Number(student.mathScore) === maxScores.math && maxScores.math > 0 && (
                            <Tooltip title="Max Score!">
                              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: '1.2rem' }} />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Tooltip title={`Enter English score (max ${maxScores.english})`}>
                            <TextField
                              type="number"
                              value={student.englishScore}
                              onChange={(e) => handleScoreChange(student.id, 'english', e.target.value)}
                              InputProps={{
                                inputProps: {
                                  min: 0,
                                  max: maxScores.english,
                                  style: { textAlign: 'center' },
                                },
                                sx: { borderRadius: 1.5 },
                              }}
                              size="small"
                              disabled={actionLoading}
                              sx={{ width: '90px' }}
                            />
                          </Tooltip>
                          {Number(student.englishScore) === maxScores.english && maxScores.english > 0 && (
                            <Tooltip title="Max Score!">
                              <StarIcon sx={{ color: theme.palette.warning.main, fontSize: '1.2rem' }} />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 1, fontWeight: 'bold' }}>{total}</Typography>
                          <Tooltip title={`${Math.round(progress)}% of maximum possible score`}>
                            <CircularProgress
                              variant="determinate"
                              value={progress}
                              size={24}
                              color={progress > 70 ? 'success' : progress > 40 ? 'warning' : 'error'}
                            />
                          </Tooltip>
                        </Box>
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