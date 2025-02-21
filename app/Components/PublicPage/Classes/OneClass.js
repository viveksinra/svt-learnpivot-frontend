import React, { useState } from "react";
import { 
  Divider, 
  Grid, 
  Typography, 
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme
} from "@mui/material";
import Link from "next/link";
import ImageCarousel from "../../Common/ImageCarousel";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { styled } from '@mui/material/styles';
import FaqCom from "../../ITStartup/Faq/FaqCom";
import CloseIcon from '@mui/icons-material/Close';
import DOMPurify from 'dompurify';

// Styled button with animation
const AnimatedButton = styled('button')(({ theme }) => ({
  backgroundColor: '#F97316',
  color: 'white',
  padding: '8px 24px',
  borderRadius: '4px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: '0.5s',
  },
  '&:hover::after': {
    left: '100%',
  }
}));

const InfoButton = styled(Button)({
  backgroundColor: '#EDE9FE',
  color: '#5B21B6',
  '&:hover': {
    backgroundColor: '#DDD6FE',
  },
});

// Add this helper function at the top level
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const OneClass = ({ data }) => {
  const [openFAQModal, setOpenFAQModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Grid container spacing={4} sx={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginTop: fullScreen ? "1px" : "16px",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}>
        <Grid item xs={12} md={4} sx={{ p: 0 }}>
          <ImageCarousel
            images={data.imageUrls}
            title={data.courseTitle}
            height="220px"
            autoplayDelay={6000}
          />
        </Grid>

        <Grid item xs={12} md={8} sx={{ p: 3 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <Link href={"/course/buy/" + data._id}>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#082952',
                    fontWeight: 600,
                    mb: 1,
                    fontFamily: "Adequate, Helvetica Neue, Helvetica, sans-serif",
                  }}
                >
                  {data.courseTitle}
                </Typography>
              </Link>
           
            </div>
 

          </div>

          <Typography
                sx={{
                  backgroundColor: '#10B981',
                  color: 'white',
                  p: 1,
                  borderRadius: '4px',
                  fontSize: '0.875rem',
                  maxWidth: 'fit-content'
                }}
              >
                {data.shortDescription || 'Full Course'}
              </Typography>
        

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            
            {data.courseClass?.label && (
              <Chip
                label={`${data.courseClass.label}`}
                sx={{
                  backgroundColor: '#E0F2FE',
                  color: '#0369A1',
                  fontWeight: 'bold'
                }}
              />
            )}

            {data.courseType?.label && (
              <Chip
                label={`${data.courseType?.label}`}
                sx={{
                  backgroundColor: '#F3E8FF',
                  color: '#7E22CE',
                  fontWeight: 'bold'
                }}
              />
            )}
            {data.duration?.label && (
              <Chip
                label={data.duration.label}
                sx={{
                  backgroundColor: '#ECFDF5',
                  color: '#047857',
                  fontWeight: 'bold'
                }}
              />
            )}
          </div>
          <Typography
            sx={{
              backgroundColor: '#F8FAFC',
              color: '#0F172A',
              p: '12px 16px',
              mt: 2,
              borderRadius: '8px',
              fontSize: '1rem',
              maxWidth: 'fit-content',
              fontWeight: '600',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
     
            }}
          >
            £ {data.oneClassPrice} Per Class
          </Typography>

          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <button 
              style={{
                backgroundColor: '#FCD34D',
                color: '#1F2937',
                padding: '8px 24px',
                borderRadius: '4px',
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => setOpenFAQModal(true)}
            >
              FAQS
            </button>
            <InfoButton
              variant="contained"
              onClick={() => setOpenDetailsModal(true)}
              startIcon={<CalendarMonthIcon />}
            >
              Course Info
            </InfoButton>
            <Link href={"/course/buy/" + data._id}>
              <AnimatedButton>
                ENROLL NOW
              </AnimatedButton>
            </Link>
          </div>
        </Grid>
      </Grid>

      {/* FAQ Modal */}
      <Dialog 
        open={openFAQModal} 
        onClose={() => setOpenFAQModal(false)}
        maxWidth="sm"
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
          Course FAQs
          <CloseIcon 
            onClick={() => setOpenFAQModal(false)} 
            sx={{ cursor: 'pointer', color: '#1F2937' }} 
          />
        </DialogTitle>
        <DialogContent>
          <div style={{ marginTop: '16px' }}>
            <FaqCom dataType="courseFaqData" />
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: '16px' }}>
          <Button 
            onClick={() => setOpenFAQModal(false)}
            sx={{ color: 'white', backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Course Details Modal */}
      <Dialog 
        open={openDetailsModal} 
        onClose={() => setOpenDetailsModal(false)}
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
          {data.courseTitle}
          <CloseIcon 
            onClick={() => setOpenDetailsModal(false)} 
            sx={{ cursor: 'pointer', color: '#1F2937' }} 
          />
        </DialogTitle>
        <DialogContent>
          <div 
            className="course-description"
            dangerouslySetInnerHTML={{ 
              __html: DOMPurify.sanitize(data.fullDescription) 
            }}
            style={{
              padding: '16px',
              '& h1': {
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#1F2937'
              },
              '& h2': {
                fontSize: '1.25rem',
                fontWeight: 'bold',
                marginBottom: '0.75rem',
                color: '#374151'
              },
              '& p': {
                marginBottom: '1rem',
                lineHeight: '1.6',
                color: '#4B5563'
              },
              '& ul, & ol': {
                marginLeft: '1.5rem',
                marginBottom: '1rem'
              },
              '& li': {
                marginBottom: '0.5rem'
              },
              '& a': {
                color: '#2563EB',
                textDecoration: 'underline'
              }
            }}
          />
          
          <div style={{ marginTop: '16px' }}>
            {data.allBatch
              .filter(batch => !batch.hide)
              .map((batch, batchIndex) => {
              // Calculate starting class number for this batch
              const previousClassesCount = data.allBatch
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
           {  data.allBatch.length > 1 &&    
            <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#1F2937',
                      fontWeight: 'bold',
                    }}
                  >
                    Set {batchIndex + 1}
                  </Typography>
                  }
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
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#1F2937',
                            fontWeight: 'medium',
                            marginTop: '4px',
                            marginLeft: '28px'
                          }}
                        >
                          {formatDate(date)}
                        </Typography>
                      </div>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )})}
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setOpenDetailsModal(false)}
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
          <Link href={"/course/buy/" + data._id} style={{ flex: 1 }}>
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
    </>
  );
};

export default OneClass;
