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
  useTheme,
  Stack
} from "@mui/material";
import Link from "next/link";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";
import ImageCarousel from "../../Common/ImageCarousel";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from 'moment';
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

const BatchButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#EDE9FE',
  color: '#5B21B6',
  padding: '8px 24px !important',
  minWidth: 'fit-content !important',
  maxWidth: 'max-content !important',
  width: 'auto !important',
  flex: '0 0 auto !important',
  '&.MuiButton-root': {
    padding: '8px 24px !important',
    minWidth: 'fit-content !important',
    width: 'auto !important'
  },
  '&:hover': {
    backgroundColor: '#DDD6FE',
  },
  '& .MuiButton-startIcon': {
    marginRight: '8px',
    marginLeft: 0
  }
}));

const FAQButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#FCD34D',
  color: '#1F2937',
  padding: '8px 24px !important',
  minWidth: 'fit-content !important',
  maxWidth: 'max-content !important',
  width: 'auto !important',
  flex: '0 0 auto !important',
  fontWeight: 'bold',
  '&.MuiButton-root': {
    padding: '8px 24px !important',
    minWidth: 'fit-content !important',
    width: 'auto !important'
  },
  '&:hover': {
    backgroundColor: '#F6B935',
  }
}));

const OneMockTest = ({ data }) => {
  const [openBatchModal, setOpenBatchModal] = useState(false);
  const [openFAQModal, setOpenFAQModal] = useState(false);
  // Format date for display
  const formatDateDisplay = (dateString) => {
    return moment(dateString).format('Do MMM YYYY');
  };

  // Format time for display
  const formatTimeDisplay = (time) => {
    return moment(time, 'HH:mm').format('h:mm A');
  };

  // Get lowest price from all batches
  const lowestPrice = Math.min(...data.batch.map(b => b.oneBatchprice));
    const theme = useTheme();
  
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Grid container spacing={4} sx={{ 
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '4px 4px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        marginTop: fullScreen ?"1px":"16px",
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',

      }}>
        <Grid item  xs={12} md={4} sx={{ p: 0 }}>
          <ImageCarousel
            images={data.imageUrls}
            title={data.mockTestTitle}
            height="220px"
            autoplayDelay={6000}
          />
        </Grid>

        <Grid item xs={12} md={8} sx={{ p: 3 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            {/* Title and Highlight Text */}

            <div style={{ flex: 1 }}>
            <Link href={"/mockTest/buy/" + data._id}>
              <Typography
                variant="h5"
                sx={{
                  color: '#082952',
                  fontWeight: 600,
                  mb: 1,
                  fontFamily: "Adequate, Helvetica Neue, Helvetica, sans-serif",
                }}
              >
                {data.mockTestTitle}
              </Typography></Link>
              {data.highlightedText && (
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
                  {data.highlightedText}
                </Typography>
              )}
            </div>

            {/* Price Tag */}
            <div style={{
              backgroundColor: '#FCD34D',
              padding: '16px',
              borderRadius: '8px',
              transform: 'rotate(12deg)',
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                £{lowestPrice}
              </Typography>
            </div>
          </div>

          {/* Location */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LocationOnIcon sx={{ color: 'text.secondary' }} />
              <Typography color="text.secondary">
                {data.location.label}
              </Typography>
            </div>
          </div>

          {/* Short Description - Only shown if exists */}
          {data.shortDescription && (
            <Typography
              sx={{
                mt: 2,
                color: '#4B5563',
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}
            >
              {data.shortDescription}
            </Typography>
          )}

          {/* Status Tags */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {data.blinkText?.label && (
              <Chip
                label={data.blinkText.label}
                sx={{
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                  fontWeight: 'bold'
                }}
              />
            )}
            <Chip
              label="BOOKING OPEN"
              sx={{
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                fontWeight: 'bold'
              }}
            />
          </div>

          {/* Action Buttons */}
          <Stack 
  direction="row" 
  spacing={2} 
  sx={{ 
    mt: 2,
    '& .MuiButton-root': {
      padding: '8px 24px !important',
      minWidth: 'fit-content',
    },
    '& a': {
      margin: 0,
      padding: 0,
      display: 'flex'
    }
  }}
>
  <FAQButton
    variant="contained"
    onClick={() => setOpenFAQModal(true)}
  >
    FAQS
  </FAQButton>
  <BatchButton
    variant="contained"
    onClick={() => setOpenBatchModal(true)}
    startIcon={<CalendarMonthIcon />}
  >
    Batches
  </BatchButton>
  <Link href={"/mockTest/buy/" + data._id} style={{ textDecoration: 'none' }}>
    <AnimatedButton>
      BUY NOW
    </AnimatedButton>
  </Link>
</Stack>
        </Grid>
      </Grid>

      {/* Batch Details Modal */}
      <Dialog 
        open={openBatchModal} 
        onClose={() => setOpenBatchModal(false)}
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
           {data.testType.label} Mock Test Batches
          <CloseIcon 
            onClick={() => setOpenBatchModal(false)} 
            sx={{ cursor: 'pointer', color: '#1F2937' }} 
          />
        </DialogTitle>
        <DialogContent>
          <div style={{ marginTop: '16px' }}>
            {data.batch.map((batch, index) => (
              <div key={index} style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F9FAFB',
                padding: '16px',
                borderRadius: '4px',
                marginBottom: '8px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <CalendarMonthIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                    <Typography variant="body1" sx={{ color: '#4B5563', fontWeight: 'medium' }}>
                      {formatDateDisplay(batch.date)}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AccessTimeIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {formatTimeDisplay(batch.startTime)} - {formatTimeDisplay(batch.endTime)}
                    </Typography>
                  </div>
                </div>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: batch.filled ? '#DC2626' : '#059669', 
                    fontWeight: 'bold', 
                    fontSize: batch.filled ? '0.875rem' : '1rem' 
                  }}
                >
                  {batch.filled ? 'Booking Full' : `£${batch.oneBatchprice}`}
                </Typography>
              </div>
            ))}
          </div>
        </DialogContent>
        <DialogActions sx={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={() => setOpenBatchModal(false)}
            sx={{ 
              color: 'white', 
              backgroundColor: 'red', 
              '&:hover': { backgroundColor: 'darkred' },
              flex: 1,
              marginRight: '8px'
            }}
          >
            Close
          </Button>
          <Link href={"/mockTest/buy/" + data._id} style={{ flex: 1 }}>
            <Button 
              onClick={() => setOpenBatchModal(false)}
              sx={{ 
                color: 'white', 
                backgroundColor: 'green', 
                '&:hover': { backgroundColor: 'darkred' },
                width: '100%'
              }}
            >
              Buy Now
            </Button>
          </Link>
        </DialogActions>
      </Dialog>

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
          FAQs
          <CloseIcon 
            onClick={() => setOpenFAQModal(false)} 
            sx={{ cursor: 'pointer', color: '#1F2937' }} 
          />
        </DialogTitle>
        <DialogContent>
          <div style={{ marginTop: '16px' }}>
          <FaqCom dataType={ data.testType?.id === "csse" ? "csseMockFaqData":"fsseMockFaqData"} />
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
    </>
  );
};

export default OneMockTest;