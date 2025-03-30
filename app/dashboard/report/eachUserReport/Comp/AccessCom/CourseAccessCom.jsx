"use client";
import React from 'react';
import {
  Avatar, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const CourseAccessCom = ({ courseComparison, selectedChildName, formatTime, handleGiveAccess }) => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {courseComparison.available.length} available courses • {courseComparison.purchased.length} purchased
      </Typography>
      
      {courseComparison.available.length > 0 ? (
        <Grid container spacing={2}>
          {courseComparison.available.map((course) => {
            const isPurchased = courseComparison.purchased.some(p => p._id === course._id);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderColor: isPurchased ? 'success.main' : 'divider',
                    position: 'relative',
                    borderRadius: '10px'
                  }}
                >
                  {isPurchased && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        right: 10, 
                        top: 10, 
                        bgcolor: 'success.main',
                        color: 'white',
                        borderRadius: '50%',
                        p: 0.5,
                        zIndex: 1
                      }}
                    >
                      <CheckCircleIcon />
                    </Box>
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        variant="rounded" 
                        src={course.imageUrls?.[0]} 
                        sx={{ mr: 2, width: 40, height: 40 }}
                      >
                        <SchoolIcon />
                      </Avatar>
                      <Typography variant="h6" title={course.courseTitle}>
                        {course.courseTitle}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatTime(course.startTime)} - {formatTime(course.endTime)}
                      </Typography>
                    </Box>
                    
                    {isPurchased && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          Purchased for {selectedChildName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {courseComparison.purchased.find(p => p._id === course._id)?.purchaseInfo?.selectedDates?.length || 0} sessions
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          
          {/* Add "Give Access" Card */}
          {/* <Grid item xs={12} sm={6} md={4}>
            <Card 
              variant="outlined" 
              sx={{ 
                borderColor: 'primary.light',
                borderStyle: 'dashed',
                borderRadius: '10px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                }
              }}
              onClick={() => handleGiveAccess('course')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <AddCircleIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" color="primary.main">
                  Give Course Access
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provide this user with access to a course
                </Typography>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography color="text.secondary">No course access available</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default CourseAccessCom;
