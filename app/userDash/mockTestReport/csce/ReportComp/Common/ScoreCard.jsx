import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress, Chip } from '@mui/material';
import { getPerformanceGrade, getRankColor } from './utils';

const ScoreCard = ({ 
  title, 
  score, 
  maxScore, 
  genderRank, 
  overallRank, 
  totalGenderStudents, 
  totalOverallStudents, 
  performanceBoundaries 
}) => {
  const percentage = (score / maxScore) * 100;
  const grade = getPerformanceGrade(score, title, performanceBoundaries);

  return (
    <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          {title}
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
            {score}
            <Typography component="span" variant="h6" sx={{ color: 'text.secondary', ml: 0.5 }}>
              / {maxScore}
            </Typography>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {percentage.toFixed(1)}%
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={percentage} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: grade.color,
                borderRadius: 4
              }
            }} 
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Chip 
            label={grade.label} 
            size="small"
            sx={{ 
              backgroundColor: grade.color,
              color: '#fff',
              fontWeight: 'bold'
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Gender Rank</Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'bold',
                color: getRankColor(genderRank, totalGenderStudents)
              }}
            >
              {genderRank} / {totalGenderStudents}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Overall Rank</Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'bold',
                color: getRankColor(overallRank, totalOverallStudents)
              }}
            >
              {overallRank} / {totalOverallStudents}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ScoreCard; 