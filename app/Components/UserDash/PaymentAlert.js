// PaymentAlert.js
import React from 'react';
import { Box, Card, Typography, Button } from '@mui/material';

export const PaymentAlert = ({ payment }) => (
  <Card sx={{ 
    p: 3,
    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    color: 'white',
    boxShadow: '0 4px 20px rgba(255, 152, 0, 0.2)',
    borderRadius: 3
  }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Box>
        <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>{payment.title}</Typography>
        <Typography sx={{ opacity: 0.9, mb: 1 }}>{payment.description}</Typography>
        <Typography variant="h6">{payment.amount}</Typography>
      </Box>
      <Button 
        variant="contained" 
        sx={{ 
          bgcolor: 'white',
          color: '#F57C00',
          '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
          px: 4,
          py: 1.5,
          fontSize: '1rem'
        }}
      >
        Pay Now
      </Button>
    </Box>
  </Card>
);