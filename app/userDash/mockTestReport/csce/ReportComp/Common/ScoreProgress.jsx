import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const ScoreProgress = ({ score, maxScore, subject, performanceBoundaries }) => {
  const percentage = (score / maxScore) * 100;
  
  const getColor = (score, subject, boundaries) => {
    if (!boundaries) {
      // Fallback to percentage-based grading
      if (percentage >= 80) return '#4caf50';
      if (percentage >= 60) return '#2196f3';
      if (percentage >= 40) return '#ff9800';
      return '#f44336';
    }
    
    const subjectKey = subject.toLowerCase() === 'mathematics' ? 'math' : subject.toLowerCase();
    const subjectBoundaries = boundaries[subjectKey];
    
    if (!subjectBoundaries) {
      // Fallback for total score or unknown subjects
      if (percentage >= 80) return '#4caf50';
      if (percentage >= 60) return '#2196f3';
      if (percentage >= 40) return '#ff9800';
      return '#f44336';
    }
    
    if (score >= subjectBoundaries.excellent) return '#4caf50';  // Green for excellent
    if (score >= subjectBoundaries.good) return '#2196f3';       // Blue for good
    if (score >= subjectBoundaries.average) return '#ff9800';    // Orange for average
    return '#f44336';  // Red for concern (below average)
  };
  
  const getGradeLabel = (score, subject, boundaries) => {
    if (!boundaries) {
      // Fallback to percentage-based grading
      if (percentage >= 80) return 'Excellent';
      if (percentage >= 60) return 'Good';
      if (percentage >= 40) return 'Average';
      return 'Needs Improvement';
    }
    
    const subjectKey = subject.toLowerCase() === 'mathematics' ? 'math' : subject.toLowerCase();
    const subjectBoundaries = boundaries[subjectKey];
    
    if (!subjectBoundaries) {
      // Fallback for total score or unknown subjects
      if (percentage >= 80) return 'Excellent';
      if (percentage >= 60) return 'Good';
      if (percentage >= 40) return 'Average';
      return 'Needs Improvement';
    }
    
    if (score >= subjectBoundaries.excellent) return 'Excellent';
    if (score >= subjectBoundaries.good) return 'Good';
    if (score >= subjectBoundaries.average) return 'Average';
    return 'Concern';
  };
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between',
        mb: 0.5,
        gap: { xs: 0.5, sm: 0 }
      }}>
        <Typography variant="body2" fontWeight="medium">{subject}</Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Typography variant="body2" fontWeight="bold">
            {score} / {maxScore} ({percentage.toFixed(1)}%)
          </Typography>
          <Chip 
            label={getGradeLabel(score, subject, performanceBoundaries)} 
            size="small"
            sx={{ 
              height: 20, 
              fontSize: '0.7rem',
              backgroundColor: getColor(score, subject, performanceBoundaries),
              color: '#fff',
              fontWeight: 'bold'
            }} 
          />
        </Box>
      </Box>
      <Box sx={{ position: 'relative', height: 10, borderRadius: 5, bgcolor: '#f0f0f0', overflow: 'hidden' }}>
        <Box 
          sx={{ 
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${percentage}%`,
            borderRadius: 5,
            backgroundImage: `linear-gradient(to right, ${getColor(score, subject, performanceBoundaries)}80, ${getColor(score, subject, performanceBoundaries)})`,
            transition: 'width 1s ease-in-out'
          }}
        />
      </Box>
    </Box>
  );
};

export default ScoreProgress; 