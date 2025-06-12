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
  Paper
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const PerformanceBoundariesSection = ({
  performanceBoundaries,
  handleUpdatePerformanceBoundaries,
  actionLoading
}) => {

  const handleBoundaryChange = (subject, field, value) => {
    const numericValue = value === '' ? '' : Number(value);
    
    handleUpdatePerformanceBoundaries({
      ...performanceBoundaries,
      [subject]: {
        ...(performanceBoundaries[subject] || {}),
        [field]: numericValue
      }
    });
  };

  const subjects = [
    { key: 'math', label: 'Maths' },
    { key: 'english', label: 'English' },
    { key: 'creativeWriting', label: 'Creative Writing' }
  ];

  const boundaryFields = [
    { key: 'excellent', label: 'Excellent' },
    { key: 'good', label: 'Good' },
    { key: 'average', label: 'Average' },
  ];

  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TrendingUpIcon color="success" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Performance Boundaries
        </Typography>
        <Tooltip title="Set the score thresholds for Excellent, Good, and Average performance levels for each subject." placement="right">
          <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <TableContainer component={Paper} elevation={1}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>Subject</TableCell>
              {boundaryFields.map((field) => (
                <TableCell key={field.key} align="center" sx={{ fontWeight: 'bold', bgcolor: 'grey.100' }}>
                  {field.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.map((subject) => (
              <TableRow key={subject.key}>
                <TableCell sx={{ fontWeight: 'bold' }}>{subject.label}</TableCell>
                {boundaryFields.map((field) => (
                  <TableCell key={field.key} align="center">
                    <TextField
                      size="small"
                      type="number"
                      value={performanceBoundaries?.[subject.key]?.[field.key] || ''}
                      onChange={(e) => handleBoundaryChange(subject.key, field.key, e.target.value)}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default PerformanceBoundariesSection; 