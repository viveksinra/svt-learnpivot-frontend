import React, { useState, useRef } from "react";
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
  Stack,
  CircularProgress
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
import BatchDialog from "./BatchDialog";
import { mockTestService } from "@/app/services";

// Update AnimatedButton to accept custom colors
const AnimatedButton = styled('button')(({ theme, bgcolor, hovercolor, textcolor = 'white' }) => ({
  backgroundColor: bgcolor || '#F97316',
  color: textcolor,
  padding: '8px 20px', // Reduced padding
  borderRadius: '4px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  minWidth: 'fit-content',
  maxWidth: 'max-content',
  whiteSpace: 'nowrap', // Prevent text wrapping
  flex: '0 0 auto',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
    backgroundColor: hovercolor || '#E85D04',
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

const OneMockTest = ({ data }) => {
  const [openBatchModal, setOpenBatchModal] = useState(false);
  const [openFAQModal, setOpenFAQModal] = useState(false);
  const [isLoadingBatch, setIsLoadingBatch] = useState(false);
  const [batchData, setBatchData] = useState(null);
  const snackRef = useRef();
  
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

  // Function to handle batch button click
  const handleBatchButtonClick = async () => {
    try {
      setIsLoadingBatch(true);
      // Fetch batch data
      let res = await mockTestService.publicGetOne(`${data._id}`);
      if (res.variant === "success") {
        setBatchData(res.data);
        // Open the dialog after data is loaded
        setOpenBatchModal(true);
      } else {
        if (snackRef.current) {
          snackRef.current.handleSnack(res);
        }
        console.error("Error fetching batch data:", res);
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
    } finally {
      setIsLoadingBatch(false);
    }
  };

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
            direction="row"  // Always keep row direction
            spacing={1}      // Reduced spacing between buttons
            sx={{ 
              mt: 2,
              pr: { xs: 2, sm: 0 },
              flexWrap: 'nowrap', // Prevent wrapping
              '& a': {
                margin: 0,
                padding: 0,
                display: 'flex',
                flexShrink: 0 // Prevent shrinking
              },
              '& button': {
                flexShrink: 0 // Prevent shrinking
              }
            }}
          >
            <AnimatedButton
              onClick={() => setOpenFAQModal(true)}
              bgcolor="#FCD34D"
              hovercolor="#F6B935"
              textcolor="#1F2937"
            >
              FAQS
            </AnimatedButton>
            <AnimatedButton
              onClick={handleBatchButtonClick}
              bgcolor="#EDE9FE"
              hovercolor="#DDD6FE"
              textcolor="#5B21B6"
              disabled={isLoadingBatch}
              style={{ 
                position: 'relative',
                minWidth: '90px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isLoadingBatch ? (
                <>
                  <CircularProgress 
                    size={16} 
                    sx={{ 
                      color: '#5B21B6', 
                      position: 'absolute',
                      left: '8px'
                    }} 
                  />
                  Loading...
                </>
              ) : 'Batches'}
            </AnimatedButton>
            <Link href={"/mockTest/buy/" + data._id} style={{ textDecoration: 'none' }}>
              <AnimatedButton>
                BUY NOW
              </AnimatedButton>
            </Link>
          </Stack>
        </Grid>
      </Grid>

      {/* Batch Details Modal */}
      <BatchDialog 
        open={openBatchModal}
        onClose={() => setOpenBatchModal(false)}
        data={batchData || data}
        loading={false} // We've already loaded the data
      />

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