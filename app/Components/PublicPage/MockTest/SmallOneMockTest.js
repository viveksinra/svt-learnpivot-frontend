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

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: 'white',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',

  [theme.breakpoints.up('md')]: {
  },
  [theme.breakpoints.down('md')]: {
    width: '100%',
    margin: '16px 0',
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  '&.batch-chip': {
    backgroundColor: '#F3E8FF',
    color: '#6B21A8',
    fontWeight: 500,
    fontSize: '0.875rem',
    '& .MuiChip-icon': {
      color: '#6B21A8',
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
    backgroundColor: '#F97316',
    color: 'white',
    '&:hover': {
      backgroundColor: '#EA580C',
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: '#EDE9FE',
    color: '#5B21B6',
    '&:hover': {
      backgroundColor: '#DDD6FE',
    },
  }),
}));

const MockTestCard = ({ data , selectedChild, totalAmount, selectedBatch}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openBatchModal, setOpenBatchModal] = useState(false);

  const formatDate = (dateString) => moment(dateString).format('Do MMM YYYY');
  const formatTime = (time) => moment(time, 'HH:mm').format('h:mm A');
  
  return (
    <>
      <StyledCard style={{marginTop: isMobile ? '30px' : '0'}}>
        {/* Image Carousel */}
        <Box sx={{ position: 'relative', width: '100%', height: isMobile ? '200px' : '230px' }}>
        <ImageCarousel
            images={data.imageUrls}
            title={data.mockTestTitle}
            height= {isMobile ? '220px' : '230px' }
            autoplayDelay={6000}
          />
        </Box>

        <Box sx={{ p: 2.5 }}>
          {/* Title and Price */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.125rem', md: '1.25rem' },
                fontWeight: 600,
                color: '#0F172A',
                flex: 1,
                lineHeight: 1.4,
                fontFamily: '"Adequate", "Helvetica Neue", Helvetica, sans-serif',
              }}
            >
              {data.mockTestTitle}
            </Typography>
            {(totalAmount > 0) && <Box sx={{
              backgroundColor: totalAmount?"#a0ff69":'#FCD34D',
              padding: '8px 16px',
              borderRadius: '8px',
              transform: !totalAmount && 'rotate(12deg)',
            }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Total: £{totalAmount.toFixed(2)} 
            
              </Typography>
            </Box>}
          </Box>

          {/* Location */}
          {data.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LocationOnIcon sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
              <Typography color="text.secondary" variant="body2">
                {data.location.label}
              </Typography>
            </Box>
          )}

          {/* Test Type */}
          {/* {data.testType?.label && (
            <StyledChip
              icon={<SchoolIcon />}
              className="info-chip"
              label={data.testType.label}
              sx={{ mb: 2 }}
            />
          )} */}

   

          {/* Action Buttons */}
{  selectedBatch && selectedBatch?.length > 0 &&        <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <ActionButton
              variant="secondary"
              startIcon={<CalendarMonthIcon />}
              onClick={() => setOpenBatchModal(true)}
            >
              Selected Batches for {selectedChild.childName}
            </ActionButton>

          </Box>}
        </Box>
      </StyledCard>

      {/* Batch Modal */}
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
          {`${data?.testType?.label} Selected Batches ${selectedChild?.childName ? 'for ' + selectedChild.childName : ''}`}
          <CloseIcon 
            onClick={() => setOpenBatchModal(false)} 
            sx={{ cursor: 'pointer', color: '#1F2937' }}
          />
        </DialogTitle>
        <DialogContent>
          {selectedBatch && selectedBatch?.length > 0 && (  <Box sx={{ mt: 2 }}>
            {data.batch.map((batch, index) => (
             <>
             { (selectedBatch.some(selected => selected._id === batch._id) ) && <Box
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
                  border: selectedBatch.some(selected => selected._id === batch._id) ? '2px solid #059669' : 'none'
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <CalendarMonthIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                    <Typography variant="body1" sx={{ color: '#4B5563', fontWeight: 500 }}>
                      {formatDate(batch.date)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccessTimeIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ color: '#059669', fontWeight: 'bold' }}>
                  £{batch.oneBatchprice}
                </Typography>
                {selectedBatch.some(selected => selected._id === batch._id) && (
                  <Typography variant="body2" sx={{ color: '#059669', fontWeight: 'bold' }}>
                    Selected
                  </Typography>
                )}
              </Box>}
               </>
            ))}
          </Box> )}
        
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => setOpenBatchModal(false)}
            sx={{ color: 'white', backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' } }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MockTestCard;