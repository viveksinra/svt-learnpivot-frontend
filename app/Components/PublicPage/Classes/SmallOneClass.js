import React, { useState } from 'react';
import { 
  Box,
  Card,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  useMediaQuery,
  styled
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import CloseIcon from '@mui/icons-material/Close';
import moment from 'moment';
import ImageCarousel from '../../Common/ImageCarousel';
import FaqModal from './Modals/FaqModal';
import CourseInfoModal from './Modals/CourseInfoModal';

// Reuse the same styled components
const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',

  [theme.breakpoints.down('md')]: {
    width: '100%',
    margin: '16px 0',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  '&.subject-chip': {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
    fontWeight: 500,
    fontSize: '0.875rem',
    '& .MuiChip-icon': {
      color: '#0369A1',
    }
  },
  '&.info-chip': {
    backgroundColor: '#EFF6FF',
    color: '#1D4ED8',
    height: '28px',
    fontSize: '0.875rem',
    '& .MuiChip-icon': {
      color: '#1D4ED8',
    }
  }
}));

const ActionButton = styled(Button)(({ variant }) => ({
  padding: '8px 24px',
  fontWeight: 'bold',
  borderRadius: '8px',
  textTransform: 'none',
  ...(variant === 'primary' && {
    backgroundColor: '#0EA5E9',
    color: 'white',
    '&:hover': {
      backgroundColor: '#0284C7',
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: '#E0F2FE',
    color: '#0369A1',
    '&:hover': {
      backgroundColor: '#BAE6FD',
    },
  }),
}));

const InfoButton = styled(Button)({
  backgroundColor: '#EDE9FE',
  color: '#5B21B6',
  '&:hover': {
    backgroundColor: '#DDD6FE',
  },
});

const ClassCard = ({ data, selectedChild, totalAmount=0, selectedSchedules }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [openFAQModal, setOpenFAQModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const formatDate = (dateString) => moment(dateString).format('Do MMM YYYY');
  const formatTime = (time) => moment(time, 'HH:mm').format('h:mm A');

  return (
    <>
      <StyledCard style={{marginTop: isMobile ? '30px' : '0'}}>
        <Box sx={{ position: 'relative', width: '100%', height: isMobile ? '200px' : '230px' }}>
          <ImageCarousel
            images={data.imageUrls || []}
            title={data.className}
            height={isMobile ? '220px' : '230px'}
            autoplayDelay={6000}
          />
        </Box>

        <Box sx={{ p: 2.5 }}>
          {/* Title and Price Section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h5"
                sx={{
                  fontSize: { xs: '1.125rem', md: '1.25rem' },
                  fontWeight: 600,
                  color: '#082952',
                  lineHeight: 1.4,
                  mb: 1,
                  fontFamily: '"Adequate", "Helvetica Neue", Helvetica, sans-serif',
                }}
              >
                {data.courseTitle}
              </Typography>
              {data.shortDescription && (
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
                  {data.shortDescription}
                </Typography>
              )}
            </Box>
   
          </Box>



          {/* Class Information Chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
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
                label={data.courseType.label}
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
               <Box sx={{
              backgroundColor: totalAmount ? '#a0ff69' : '#FCD34D',
              padding: '8px 16px',
              borderRadius: '8px',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
             { totalAmount?  `${ `Total: £${totalAmount}`}`:`£${data.oneClassPrice} Per Class`}
              </Typography>
            </Box>
          </Box>

          {/* Buttons Section */}
          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            {selectedSchedules && selectedSchedules.length > 0 && (
              <ActionButton
                variant="secondary"
                startIcon={<CalendarMonthIcon />}
                onClick={() => setOpenScheduleModal(true)}
              >
                Selected Schedules for {selectedChild?.childName}
              </ActionButton>
            )}
            
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
          </Box>
        </Box>
      </StyledCard>

      <Dialog 
        open={openScheduleModal} 
        onClose={() => setOpenScheduleModal(false)}
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
          {`Class Schedules ${selectedChild?.childName ? 'for ' + selectedChild.childName : ''}`}
          <CloseIcon 
            onClick={() => setOpenScheduleModal(false)} 
            sx={{ cursor: 'pointer', color: '#1F2937' }}
          />
        </DialogTitle>
        <DialogContent>
          {selectedSchedules && selectedSchedules.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {data.schedules?.map((schedule, index) => (
                selectedSchedules.some(selected => selected._id === schedule._id) && (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      backgroundColor: '#F9FAFB',
                      p: 2,
                      borderRadius: 1,
                      mb: 1,
                      flexWrap: 'wrap',
                      border: '2px solid #0EA5E9'
                    }}
                  >
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <CalendarMonthIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                        <Typography variant="body1" sx={{ color: '#4B5563', fontWeight: 500 }}>
                          {formatDate(schedule.date)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#0EA5E9', fontWeight: 'bold' }}>
                      £{schedule.price}
                    </Typography>
                  </Box>
                )
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenScheduleModal(false)}
            sx={{ color: 'white', backgroundColor: '#EF4444', '&:hover': { backgroundColor: '#DC2626' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

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

export default ClassCard;
