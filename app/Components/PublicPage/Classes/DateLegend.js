import React from "react";
import { Grid, Paper, Box, Typography } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const DateLegend = () => {
  return (
    <Grid item xs={12}>
      <Paper elevation={1} sx={{ p: 2, bgcolor: '#f8f9fa' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 16 }} />
              <Typography variant="body2">Selected Date</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CancelIcon color="error" sx={{ fontSize: 16 }} />
              <Typography variant="body2">Not Selected</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="disabled" sx={{ fontSize: 16 }} />
              <Typography variant="body2">Booking Closed</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#f0ad4e', fontSize: 16 }} />
              <Typography variant="body2">Already Purchased</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default DateLegend;