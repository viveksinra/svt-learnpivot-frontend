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
  Box,
  Stack
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
import FaqModal from './Modals/FaqModal';
import CourseInfoModal from './Modals/CourseInfoModal';

// Styled button with animation
const AnimatedButton = styled('button')(({ theme, bgcolor, hovercolor, textcolor = 'white' }) => ({
  backgroundColor: bgcolor || '#F97316',
  color: textcolor,
  padding: '12px 15px', // Reduced padding
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
        marginBottom: { xs: '16px', md: '0' }, // Add margin bottom for mobile
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        paddingLeft: '3px',
        paddingRight: '3px',
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
 
          <Box sx={{
              backgroundColor:  '#FCD34D',
              padding: '4px 8px',
              borderRadius: '8px',
              maxWidth: 'fit-content',
              marginTop: '16px'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              £{data.oneClassPrice} Per Class
              </Typography>
            </Box>
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
              onClick={() => setOpenDetailsModal(true)}
              bgcolor="#EDE9FE"
              hovercolor="#DDD6FE"
              textcolor="#5B21B6"
            >
              COURSE INFO
            </AnimatedButton>
            <Link href={"/course/buy/" + data._id} style={{ textDecoration: 'none' }}>
              <AnimatedButton>
              ENROLL NOW
              </AnimatedButton>
            </Link>
 
</Stack>
        </Grid>
      </Grid>

      <FaqModal 
        open={openFAQModal}
        onClose={() => setOpenFAQModal(false)}
      />

      <CourseInfoModal 
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        courseData={data}
      />
    </>
  );
};

export default OneClass;
