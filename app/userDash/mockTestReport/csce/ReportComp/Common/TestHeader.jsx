import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Divider, 
  Chip, 
  Paper,
  Avatar
} from '@mui/material';
import { 
  CalendarToday, 
  AccessTime, 
  LocationOn, 
  School, 
  Person,
  CalendarMonth
} from '@mui/icons-material';
import { formatDateToShortMonth } from '@/app/utils/dateFormat';
import moment from 'moment';

const TestHeader = ({ 
  mockTestDetails, 
  batchDetails, 
  currentChild, 
  childScore,
  variant = 'detailed' // 'detailed' for JustOne, 'compact' for AllInOne
}) => {
  if (variant === 'compact') {
    // Compact version for AllInOne cards
    return (
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)', 
        p: { xs: 2, sm: 3 },
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Typography variant="h5" fontWeight="bold" sx={{ 
            color: '#1e3a8a',
            fontSize: { xs: '1.1rem', sm: '1.25rem' }
          }}>
            {mockTestDetails?.title || 'Test Name Not Available'}
          </Typography>
          <Chip 
            label={mockTestDetails?.testType?.label || 'Type Not Available'} 
            color="primary"
            icon={<School />}
            sx={{ fontWeight: 'medium' }}
          />
        </Box>

        {/* Enhanced batch details */}
        <Box sx={{ 
          mt: 2,
          p: { xs: 1.5, sm: 2 },
          bgcolor: 'rgba(255,255,255,0.85)',
          borderRadius: 1,
          border: '1px solid #e0e0e0',
          backdropFilter: 'blur(4px)'
        }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarMonth sx={{ color: 'primary.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Test Date</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {batchDetails?.date ? formatDateToShortMonth(batchDetails.date) : 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ color: 'primary.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Time</Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {batchDetails?.startTime || 'N/A'} - {batchDetails?.endTime || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            {mockTestDetails?.location && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocationOn sx={{ color: 'primary.main', mr: 1, fontSize: { xs: 18, sm: 20 } }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Location</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {mockTestDetails.location.label}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    );
  }

  // Detailed version for JustOne
  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {mockTestDetails?.title || 'Mock Test'}
          </Typography>
          {mockTestDetails?.highlightedText && (
            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
              {mockTestDetails.highlightedText}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: { xs: 2, md: 0 } }}>
          <Avatar sx={{ bgcolor: '#f5f5f5', color: 'primary.main', mr: 1 }}>
            <Person />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Student</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {currentChild?.childName || childScore?.childName || 'Student Name'}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarToday fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="body2">
              Date: {batchDetails?.date ? moment(batchDetails.date).format('DD MMM YYYY') : 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTime fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="body2">
              Time: {batchDetails?.startTime || 'N/A'} - {batchDetails?.endTime || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <School fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
            <Typography variant="body2">
              Test Type: {mockTestDetails?.testType?.label || 'N/A'}
            </Typography>
          </Box>
        </Grid>
        {mockTestDetails?.location && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LocationOn fontSize="small" sx={{ color: 'primary.main', mr: 1, mt: 0.5 }} />
              <Typography variant="body2">
                Location: {mockTestDetails.location.label}
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default TestHeader; 