import React from "react";
import { Grid, Paper, Box, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { formatDateToShortMonth } from "@/app/utils/dateFormat";

export default function StartDateShowCase({
  startDate,
  frontEndTotal,
}) {
  return (
    <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mb: 2,
              gap: { xs: 1, sm: 2 }, // Add gap between items
              flexDirection: { xs: 'column', sm: 'row' } // Stack on mobile, row on desktop
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                bgcolor: startDate ? '#e3f2fd' : '#ffebee',
                borderRadius: '8px',
                padding: '8px',
                border: '1px solid',
                borderColor: startDate ? '#90caf9' : '#ffcdd2',
                transition: 'all 0.3s ease',
                width: { xs: '100%', sm: 'auto' }, // Full width on mobile
              }}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="bold"
                  sx={{
                    color: startDate ? '#1976d2' : '#d32f2f',
                    fontSize: { xs: '0.875rem', sm: '1rem' }, // Smaller font on mobile
                    width: '100%',
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  Start Date: {startDate ? formatDateToShortMonth(startDate) : 'Not Selected'}
                </Typography>
              </Box>
              {frontEndTotal && (
                <Typography 
                  variant="subtitle1" 
                  fontWeight="bold"
                  sx={{
                    bgcolor: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid #a5d6a7',
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile
                    textAlign: { xs: 'center', sm: 'left' }
                  }}
                >
                  Total: £{frontEndTotal}
                </Typography>
              )}
            </Box>
  );
}
