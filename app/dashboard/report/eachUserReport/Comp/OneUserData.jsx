import React, { useState } from 'react';
import { Avatar, Box, Grid, Stack, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import BlockIcon from '@mui/icons-material/Block';
import { styled } from '@mui/material/styles';
import { registrationService } from '@/app/services';

const ContentSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
    padding: theme.spacing(3),
    borderRadius: '12px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  }));

const OneUserData = ({ reportData, onBlockUser, profileType }) => {
  const [loginAllowed, setLoginAllowed] = useState(reportData.user.loginAllowed || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  async function allowDisableLogin(userId, loginAllowed) {
    console.log(userId, loginAllowed);
    console.log(reportData);
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    const data = {
      userId: userId,
      loginAllowed: loginAllowed
    }
    
    try {
      let response = await registrationService.allowDisableLoginApi(data);
      if (response.variant === "success" && response.data) {
        setLoginAllowed(response.data.loginAllowed);
        if (onBlockUser) {
          onBlockUser(userId, loginAllowed);
        }
      } else {
        setError("Failed to update login status");
      }
    } catch (error) {
      setError("An error occurred while updating login status");
      console.error('Error updating login status:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleConfirmAction = async() => {
    // Call API to update login status
    await allowDisableLogin(reportData.user._id, !loginAllowed);
    handleCloseModal();
  };

  const handleDisableLogin = () => {
    handleOpenModal();
  };

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
              <Typography variant="body2">{reportData.children.length} {reportData.children.length === 1 ? 'Child' : 'Children'}</Typography>
            </Box>
          </Stack>
          {profileType === "admin" && <Button 
            variant="contained" 
            color={loginAllowed ? "error" : "warning"}
            startIcon={<BlockIcon />}
            onClick={handleDisableLogin}
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loginAllowed ? "Disable Login" : "Enable Login"}
          </Button>}
          {error && (
            <Typography color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Grid>
      </Grid>

      {/* Confirmation Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {loginAllowed ? "Disable User Login" : "Enable User Login"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {loginAllowed 
              ? `Are you sure you want to disable login for ${reportData.user.firstName} ${reportData.user.lastName}? This user will no longer be able to log in to the system.`
              : `Are you sure you want to enable login for ${reportData.user.firstName} ${reportData.user.lastName}? This user will be able to log in to the system.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAction} 
            color={loginAllowed ? "error" : "success"} 
            variant="contained" 
            autoFocus
            disabled={loading}
          >
            {loading ? "Processing..." : (loginAllowed ? "Disable" : "Enable")}
          </Button>
        </DialogActions>
      </Dialog>
    </ContentSection>
  );
};

export default OneUserData;
