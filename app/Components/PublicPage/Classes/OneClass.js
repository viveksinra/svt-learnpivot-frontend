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
            </div>

            <div style={{
              backgroundColor: '#FCD34D',
              padding: '16px',
              borderRadius: '8px',
              transform: 'rotate(12deg)',
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                £{data.price || '299'}
              </Typography>
            </div>
          </div>

          {/* <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AccessTimeIcon sx={{ color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {data.startTime} - {data.endTime}
              </Typography>
            </div>
          </div>

          <Typography
            sx={{
              mt: 2,
              color: '#4B5563',
              fontSize: '0.875rem',
              lineHeight: 1.5
            }}
          >
            {data.shortDescription}
          </Typography> */}

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {data.courseClass?.label && (
              <Chip
                label={`Class ${data.courseClass.label}`}
                sx={{
                  backgroundColor: '#E0F2FE',
                  color: '#0369A1',
                  fontWeight: 'bold'
                }}
              />
            )}

            {data.courseType?.label && (
              <Chip
                label={`Class ${data.courseType?.label}`}
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
        maxWidth="sm"
        fullWidth
      >
        {/* Add course details modal content similar to batch details in OneMockTest */}
      </Dialog>
    </>
  );
};

export default OneClass;
