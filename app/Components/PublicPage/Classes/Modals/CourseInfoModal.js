import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip
} from "@mui/material";
import Link from "next/link";
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DOMPurify from 'dompurify';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const CourseInfoModal = ({ open, onClose, courseData }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ 
        backgroundColor: '#F3F4F6',
        color: '#1F2937',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {courseData.courseTitle}
        <CloseIcon 
          onClick={onClose} 
          sx={{ cursor: 'pointer', color: '#1F2937' }} 
        />
      </DialogTitle>
      <DialogContent>
        <div 
          className="course-description"
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(courseData.fullDescription) 
          }}
          style={{
            padding: '16px',
            '& h1, h2, p, ul, ol, li, a': {
              // ...existing styles...
            }
          }}
        />
        
        <div style={{ marginTop: '16px' }}>
          {courseData.allBatch
            .filter(batch => !batch.hide)
            .map((batch, batchIndex) => {
              const previousClassesCount = courseData.allBatch
                .filter((b, idx) => !b.hide && idx < batchIndex)
                .reduce((sum, b) => sum + b.oneBatch.length, 0);

              return (
                <div key={batch._id} style={{ 
                  backgroundColor: '#F9FAFB',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  position: 'relative'
                }}>
                  {/* Batch header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px'
                  }}>
                    {courseData.allBatch.length > 1 && (
                      <Typography variant="h6" sx={{ color: '#1F2937', fontWeight: 'bold' }}>
                        Set {batchIndex + 1}
                      </Typography>
                    )}
                    {batch.bookingFull && (
                      <Chip
                        label="Fully Booked"
                        sx={{
                          backgroundColor: '#FEE2E2',
                          color: '#DC2626',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                  </div>

                  {/* Batch dates grid */}
                  <Grid container spacing={2}>
                    {batch.oneBatch.map((date, dateIndex) => (
                      <Grid item xs={12} sm={6} md={3} key={dateIndex}>
                        <div style={{
                          backgroundColor: 'white',
                          padding: '12px',
                          borderRadius: '4px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          opacity: batch.bookingFull ? 0.7 : 1
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <CalendarMonthIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                            <Typography variant="body2" sx={{ color: '#4B5563' }}>
                              Class {previousClassesCount + dateIndex + 1}
                            </Typography>
                          </div>
                          <Typography variant="body2" sx={{ 
                            color: '#1F2937',
                            fontWeight: 'medium',
                            marginTop: '4px',
                            marginLeft: '28px'
                          }}>
                            {formatDate(date)}
                          </Typography>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              );
            })}
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'white', 
            backgroundColor: '#EF4444', 
            '&:hover': { backgroundColor: '#DC2626' },
            flex: 1,
            marginRight: '8px'
          }}
        >
          Close
        </Button>
        <Link href={"/course/buy/" + courseData._id} style={{ flex: 1 }}>
          <Button 
            sx={{ 
              color: 'white', 
              backgroundColor: '#059669', 
              '&:hover': { backgroundColor: '#047857' },
              width: '100%'
            }}
          >
            Enroll Now
          </Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
};

export default CourseInfoModal;
