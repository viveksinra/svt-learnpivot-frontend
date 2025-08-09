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
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import ImageCarousel from '../../Common/ImageCarousel';
import PaperFaqModal from './PaperFaqModal';
import PaperInfoModal from './PaperInfoModal';

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

const InfoButton = styled(Button)({
  backgroundColor: '#EDE9FE',
  color: '#5B21B6',
  '&:hover': { backgroundColor: '#DDD6FE' },
});

export default function SmallOnePaperSet({ data }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openFAQModal, setOpenFAQModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  return (
    <>
      <StyledCard style={{ marginTop: isMobile ? '30px' : '0' }}>
        <Box sx={{ position: 'relative', width: '100%', height: isMobile ? '200px' : '230px' }}>
          <ImageCarousel
            images={data.imageUrls || []}
            title={data.setTitle}
            height={isMobile ? '220px' : '230px'}
            autoplayDelay={6000}
          />
        </Box>

        <Box sx={{ p: 2.5 }}>
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
                {data.setTitle}
              </Typography>
              {data.shortDescription && (
                <Typography sx={{ backgroundColor: '#10B981', color: 'white', p: 1, borderRadius: '4px', fontSize: '0.875rem', maxWidth: 'fit-content' }}>
                  {data.shortDescription}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {data.classLevel?.label && (
              <Chip label={`${data.classLevel.label}`} sx={{ backgroundColor: '#E0F2FE', color: '#0369A1', fontWeight: 'bold' }} />
            )}
            {data.subject?.label && (
              <Chip label={data.subject.label} sx={{ backgroundColor: '#F3E8FF', color: '#7E22CE', fontWeight: 'bold' }} />
            )}
            <Box sx={{ backgroundColor: '#FCD34D', padding: '8px 16px', borderRadius: '8px' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                £{data.onePaperPrice} Per Paper
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
            <button
              style={{ backgroundColor: '#FCD34D', color: '#1F2937', padding: '8px 24px', borderRadius: '4px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
              onClick={() => setOpenFAQModal(true)}
            >
              FAQS
            </button>
            <InfoButton variant="contained" onClick={() => setOpenDetailsModal(true)} startIcon={<CalendarMonthIcon />}>
              Set Info
            </InfoButton>
          </Box>
        </Box>
      </StyledCard>

      <Dialog open={false} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#F3F4F6', color: '#1F2937', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Paper Set Details
          <CloseIcon sx={{ cursor: 'pointer', color: '#1F2937' }} />
        </DialogTitle>
        <DialogContent></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button sx={{ color: 'white', backgroundColor: '#EF4444', '&:hover': { backgroundColor: '#DC2626' } }}>Close</Button>
        </DialogActions>
      </Dialog>

      <PaperFaqModal open={openFAQModal} onClose={() => setOpenFAQModal(false)} />
      <PaperInfoModal open={openDetailsModal} onClose={() => setOpenDetailsModal(false)} data={data} />
    </>
  );
}


