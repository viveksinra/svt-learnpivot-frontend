import React from 'react';
import { Avatar, Box, Grid, Stack, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { styled } from '@mui/material/styles';

const ContentSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  }));

const OneUserData = ({ reportData }) => {
  return (
    <ContentSection sx={{ mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
            }}
          >
            {reportData.user.userImage ? (
              <img src={reportData.user.userImage} alt="User" width="100%" />
            ) : (
              reportData.user.firstName.charAt(0)
            )}
          </Avatar>
        </Grid>
        <Grid item xs>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {reportData.user.firstName} {reportData.user.lastName}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }} sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">{reportData.user.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PhoneIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">{reportData.user.mobile}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ChildCareIcon sx={{ fontSize: 18, mr: 1, color: 'primary.main' }} />
              <Typography variant="body2">{reportData.children.length} Children</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </ContentSection>
  );
};

export default OneUserData;
