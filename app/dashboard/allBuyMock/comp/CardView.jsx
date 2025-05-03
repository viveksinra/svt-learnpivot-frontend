import React from 'react';
import { Grid, Button, Typography, Chip, Box, useTheme, useMediaQuery } from '@mui/material';
import { MdOutlineClose, MdOutlineMail } from "react-icons/md";
import { FcOk, FcNoIdea } from "react-icons/fc";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";

const CardView = ({ 
  rows, 
  selectedItems, 
  setSelectedItems 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Grid container spacing={2}>
      {rows && rows.map((mockTest, i) => {
        // Check if this mock test is currently selected
        const isSelected = selectedItems.some(item => item._id === mockTest._id);
        
        return (
          <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
            <Box sx={{
              backgroundColor: isSelected ? '#e8f4ff' : (mockTest.status === 'succeeded' ? '#f8fff9' : '#fffef7'),
              borderRadius: '12px',
              p: { xs: 2, sm: 3 },
              boxShadow: isSelected ? 
                'rgba(25, 118, 210, 0.25) 0px 4px 12px, rgba(25, 118, 210, 0.5) 0px 0px 0px 2px' : 
                (mockTest.status === 'succeeded' ? 
                  'rgba(0, 200, 83, 0.1) 0px 4px 12px' : 
                  'rgba(255, 191, 0, 0.1) 0px 4px 12px'),
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              border: isSelected ? 
                '2px solid #1976d2' : 
                `1px solid ${mockTest.status === 'succeeded' ? '#e0e7e1' : '#e7e6df'}`
            }}>
              <Box sx={{
                position: 'absolute',
                top: '0',
                right: '0',
                p: { xs: '6px 12px', sm: '8px 16px' },
                borderRadius: '0 0 0 12px',
                backgroundColor: mockTest.status === 'succeeded' ? '#e3ffea' : '#ffffe6',
                zIndex: 2
              }}>
                <Chip 
                  icon={mockTest.status === 'succeeded' ? <FcOk /> : <FcNoIdea />}
                  label={mockTest.status} 
                  size="small"
                  color={mockTest.status === 'succeeded' ? "success" : "warning"}
                  variant="outlined"
                  sx={{ 
                    '& .MuiChip-label': { 
                      px: { xs: 0.5, sm: 1 },
                      fontSize: { xs: '0.7rem', sm: '0.8125rem' } 
                    }
                  }}
                />
              </Box>

              <Typography 
                color="primary" 
                variant="h6" 
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  pr: { xs: 10, sm: 12 }, // Increased padding to avoid overlap with status chip
                  pl: isSelected ? 4 : 0, // Add left padding when selected
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {mockTest.mockTestId?.mockTestTitle}
              </Typography>

              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item>
                  <Chip 
                    label={`${mockTest.childId?.childName}`} 
                    size="small" 
                    color="primary"
                    sx={{ 
                      '& .MuiChip-label': { 
                        fontSize: { xs: '0.7rem', sm: '0.8125rem' } 
                      }
                    }}
                  />
                </Grid>
                <Grid item>
                  <Chip 
                    label={mockTest.childId?.childGender} 
                    size="small" 
                    variant="outlined"
                    sx={{ 
                      '& .MuiChip-label': { 
                        fontSize: { xs: '0.7rem', sm: '0.8125rem' } 
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ 
                background: '#f5f5f5', 
                borderRadius: 2, 
                p: { xs: 1, sm: 1.5 },
                mb: 2 
              }}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Parent</Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {`${mockTest.user?.firstName} ${mockTest.user?.lastName}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Contact</Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {mockTest.user?.mobile}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                      {mockTest.user?.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Batch Details</Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      📅 {formatDateToShortMonth(mockTest.selectedBatch?.date)}
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      ⏰ {mockTest.selectedBatch?.startTime} - {mockTest.selectedBatch?.endTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Booking Date</Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {formatDateToShortMonth(mockTest.date)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Button
                fullWidth
                onClick={() => {
                  if (isSelected) {
                    // Remove from selection if already selected
                    setSelectedItems(selectedItems.filter(item => item._id !== mockTest._id));
                  } else {
                    // Add to selection
                    setSelectedItems([...selectedItems, mockTest]);
                  }
                }}
                variant={isSelected ? "contained" : "outlined"}
                startIcon={isSelected ? <MdOutlineClose /> : <MdOutlineMail />}
                color={isSelected ? "error" : "secondary"}
                size={isMobile ? "small" : "medium"}
                sx={{
                  textTransform: 'none',
                  borderRadius: 2,
                  mb: 1,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                {isSelected ? "Remove Selection" : "Select for Email"}
              </Button>
              
              {/* Show selected indicator */}
              {isSelected && (
                <Box sx={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: '#1976d2',
                  borderRadius: '50%',
                  width: { xs: '22px', sm: '26px' },
                  height: { xs: '22px', sm: '26px' },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  zIndex: 3,
                  border: '2px solid white',
                  fontSize: { xs: '0.8rem', sm: '1rem' }
                }}>
                  ✓
                </Box>
              )}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default CardView; 