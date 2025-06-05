import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { SchoolOutlined } from '@mui/icons-material';
import { calculateStandardizedScore, evaluateSchoolChances, formatSchoolName } from './utils';

const SchoolChances = ({ report }) => {
  if (!report) return null;
  
  const chances = evaluateSchoolChances(report);
  const schoolEntries = Object.entries(chances);
  
  if (schoolEntries.length === 0) return null;

  // Calculate the child's current standardized score
  const standardizedScore = calculateStandardizedScore(
    report.childScore?.mathsScore || 0,
    report.childScore?.englishScore || 0,
    report.englishMean || 34.35675165,
    report.englishStdDev || 7.757773879,
    report.mathsMean || 27.49480642,
    report.mathsStdDev || 11.77128731
  );

  // Check if standardized score should be hidden
  const hideStandardisedScore = report.hideStandardisedScore || false;

  // Calculate total score for display when standardized score is hidden
  const totalScore = (report.childScore?.englishScore || 0) + (report.childScore?.mathsScore || 0);
  const totalMaxScore = (report.englishMaxScore || 0) + (report.mathsMaxScore || 0);

  return (
    <Box>
      <Typography variant="h6" sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        color: '#1e3a8a',
        fontSize: { xs: '1rem', sm: '1.25rem' },
        mb: 2
      }}>
        <SchoolOutlined sx={{ mr: 1, fontSize: { xs: 18, sm: 20 } }} /> School Selection Chances
      </Typography>

      {/* Current score indicator */}
      <Box sx={{ 
        mb: 2.5, 
        p: 1.5,
        bgcolor: '#f5f9ff',
        borderRadius: 1.5,
        border: '1px solid #e0e8ff'
      }}>
        <Typography variant="body2" color="text.secondary">
          Current {hideStandardisedScore ? 'Total Score' : 'Standardized Score'}
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#1976d2' }}>
          {hideStandardisedScore ? `${totalScore}/${totalMaxScore}` : standardizedScore.toFixed(1)}
        </Typography>
    
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2
      }}>
        {schoolEntries.map(([school, chance]) => {
          return (
            <Paper
              key={school}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 'bold' }}>
                {formatSchoolName(school)} School
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {/* Inside Catchment */}
                {chance.inside && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: `${chance.inside.color}10`,
                  }}>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                        Inside Catchment
                      </Typography>
                    </Box>
                    <Chip 
                      label={chance.inside.label} 
                      size="small"
                      sx={{ 
                        bgcolor: chance.inside.color, 
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                )}

                {/* Outside Catchment */}
                {chance.outside && (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 1,
                    borderRadius: 1,
                    bgcolor: `${chance.outside.color}10`,
                  }}>
                    <Box>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                        Outside Catchment
                      </Typography>
                    </Box>
                    <Chip 
                      label={chance.outside.label} 
                      size="small"
                      sx={{ 
                        bgcolor: chance.outside.color, 
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default SchoolChances; 