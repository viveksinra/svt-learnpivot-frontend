import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import {
  ErrorOutline,
  Email,
  FiberManualRecord,
  Close
} from '@mui/icons-material';

const CourseBookingFullMessage = ({ userInfo, data, allowWaitingList = false, isWaitListed = false, onJoinWaitingList, onLeaveWaitingList }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState('join'); // join or leave

  const handleEmailClick = () => {
    const subject = encodeURIComponent(`Booking Inquiry - ${data?.courseTitle || ''}`);
    const body = encodeURIComponent(
      `Hello Support,\n\nI am ${userInfo?.firstName || 'User'} ${userInfo?.lastName || ''} and I'm interested in booking the course (${data?.courseTitle || ''}) but I see it is full. Can you please update me on this?\n\nThank you,\n${userInfo?.firstName || 'User'}`
    );
    window.location.href = `mailto:support@chelmsford11plus.com?subject=${subject}&body=${body}`;
  };

  const handleCloseClick = () => {
    window.location.href = '/course';
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    if (dialogType === 'join' && onJoinWaitingList) onJoinWaitingList();
    if (dialogType === 'leave' && onLeaveWaitingList) onLeaveWaitingList();
  };

  return (
    <Box sx={{ maxWidth: 500, margin: '0 auto', p: 2 }}>
      <Card elevation={3} sx={{ position: 'relative' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ErrorOutline color="warning" sx={{ mr: 1 }} />
            <Typography variant="h6" component="h2">
              Course Fully Booked
            </Typography>
          </Box>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>We're sorry!</AlertTitle>
            This course has reached its maximum capacity. We want to ensure each student gets the attention they deserve.
          </Alert>

          {allowWaitingList && (
            isWaitListed ? (
              <Box sx={{
                mb: 3,
                backgroundColor: '#FEF3C7',
                border: '1px solid #F59E0B',
                borderRadius: '6px',
                p: 2
              }}>
                <Typography variant="body2" sx={{ color: '#1F2937', fontWeight: 500 }}>
                  You're currently on the waiting list. We'll notify you if a seat opens, or you can leave the list below.
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Seats are full, but you can join the waiting list below and we'll notify you if a spot opens.
              </Typography>
            )
          )}
        </CardContent>

        <Divider />

        <CardActions sx={{ padding: 2, flexDirection: 'column', gap: 2 }}>


          {allowWaitingList && (
            <Box sx={{ width: '100%' }}>
              <Button
                variant="contained"
                color={isWaitListed ? 'success' : 'warning'}
                fullWidth
                startIcon={isWaitListed ? <ErrorOutline sx={{ transform: 'scale(0.8)' }} /> : null}
                onClick={() => {
                  if (!isWaitListed) {
                    setDialogType('join');
                    setDialogOpen(true);
                  } else {
                    setDialogType('leave');
                    setDialogOpen(true);
                  }
                }}
                sx={isWaitListed ? {
                  backgroundColor: '#22c55e',
                  '&:hover': { backgroundColor: '#16a34a' }
                } : {
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(202, 189, 8, 0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(255,165,0, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(255,165,0, 0)' }
                  }
                }}
              >
                {isWaitListed ? 'Leave Waiting List' : 'Join Waiting List'}
              </Button>
            </Box>
          )}
                    <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
                    <Button
              variant="contained"
              startIcon={<Email />}
              onClick={handleEmailClick}
              fullWidth
              sx={{
                textTransform: 'none',
                backgroundColor: '#059669',
                '&:hover': { backgroundColor: '#047857' }
              }}
            >
              Contact Support
            </Button>
            <Button
              onClick={handleCloseClick}
              sx={{
                color: 'white',
                backgroundColor: '#EF4444',
                '&:hover': { backgroundColor: '#DC2626' }
              }}
              fullWidth
            >
              Close
            </Button>
       
          </Box>
        </CardActions>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton aria-label="close" onClick={handleCloseClick}>
            <Close />
          </IconButton>
        </Box>
      </Card>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{dialogType === 'join' ? 'Join Waiting List' : 'Leave Waiting List'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogType === 'join' ? 'Are you sure you want to join the waiting list for this course?' : 'Are you sure you want to remove yourself from the waiting list?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}
            sx={{
              color: 'white',
              backgroundColor: dialogType === 'leave' ? '#059669' : '#EF4444',
              '&:hover': { backgroundColor: dialogType === 'leave' ? '#047857' : '#DC2626' }
            }}
          >{dialogType === 'leave' ? 'Stay in Waiting List' : 'Cancel'}</Button>
          <Button onClick={handleConfirm} autoFocus
            sx={{
              color: 'white',
              backgroundColor: dialogType === 'leave' ? '#EF4444' : '#059669',
              '&:hover': { backgroundColor: dialogType === 'leave' ? '#DC2626' : '#047857' }
            }}
          >{dialogType === 'join' ? 'Join' : 'Remove'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseBookingFullMessage;