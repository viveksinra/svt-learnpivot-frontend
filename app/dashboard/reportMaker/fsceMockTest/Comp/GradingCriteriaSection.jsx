import React from 'react';
import {
  Box,
  Typography,
  Card,
  Divider,
  TextField,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const GradingCriteriaSection = ({ 
  gradingCriteria, 
  handleUpdateGradingCriteria, 
  actionLoading 
}) => {
  const theme = useTheme();

  const handleCriteriaChange = (category, subject, field, value) => {
    const numericValue = value === '' ? '' : Number(value);
    
    const updatedCriteria = {
      ...gradingCriteria,
      [category]: {
        ...gradingCriteria[category],
        [subject]: {
          ...(gradingCriteria[category]?.[subject] || {}),
          [field]: numericValue
        }
      }
    };
    
    handleUpdateGradingCriteria(updatedCriteria);
  };

  const subjects = [
    { key: 'math', label: 'Maths' },
    { key: 'english', label: 'Eng' },
    { key: 'creativeWriting', label: 'CW' }
  ];

  const categories = ['ICQ', 'OQ'];
  const criteriaTypes = [
    { key: 'safe', label: 'Safe', color: '#4caf50' },
    { key: 'border', label: 'Borderline', color: '#ff9800' },
  ];

  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <AssessmentIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Grading Criteria
        </Typography>
        <Tooltip title="Define score thresholds for Safe and Borderline categories for each subject" placement="right">
          <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Category</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Subject</TableCell>
              {criteriaTypes.map((criteria) => (
                <TableCell 
                  key={criteria.key} 
                  align="center" 
                  sx={{ 
                    fontWeight: 'bold', 
                    bgcolor: 'grey.100',
                    color: criteria.color,
                  }}
                >
                  {criteria.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, categoryIndex) => (
              subjects.map((subject, subjectIndex) => (
                <TableRow key={`${category}-${subject.key}`}>
                  {subjectIndex === 0 && (
                    <TableCell 
                      rowSpan={subjects.length} 
                      align="center" 
                      sx={{ 
                        fontWeight: 'bold',
                        bgcolor: categoryIndex === 0 ? 'blue.50' : 'green.50',
                        borderLeft: `4px solid ${categoryIndex === 0 ? theme.palette.primary.main : theme.palette.success.main}`
                      }}
                    >
                      {category}
                    </TableCell>
                  )}
                  <TableCell sx={{ fontWeight: 'bold' }}>{subject.label}</TableCell>
                  {criteriaTypes.map((criteria) => (
                    <TableCell key={criteria.key} sx={{ p: 1 }} align="center">
                      <TextField
                        size="small"
                        type="number"
                        value={gradingCriteria?.[category]?.[subject.key]?.[criteria.key] || ''}
                        onChange={(e) => handleCriteriaChange(category, subject.key, criteria.key, e.target.value)}
                        disabled={actionLoading}
                        sx={{ width: '80px' }}
                        InputProps={{
                          inputProps: { min: 0 },
                          style: { fontSize: '0.875rem' }
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          <strong>Note:</strong> Define score thresholds for each category.
        </Typography>
      </Box>
    </Card>
  );
};

export default GradingCriteriaSection; 