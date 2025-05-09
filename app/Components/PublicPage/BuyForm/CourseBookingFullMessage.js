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
  IconButton
} from '@mui/material';
import {
  ErrorOutline,
  Email,
  FiberManualRecord,
  Close
} from '@mui/icons-material';

const CourseBookingFullMessage = ({userInfo, data}) => {
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

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Please contact our admin team to:
          </Typography>

          <List dense>
            {['Join the waiting list', 'Learn about upcoming sessions', 'Explore alternative course dates'].map((text, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <FiberManualRecord sx={{ fontSize: 8 }} />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </CardContent>

        <Divider />

        <CardActions sx={{ padding: 2 }}>
          <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<Email />}
              fullWidth
              onClick={handleEmailClick}
              sx={{
                backgroundColor: 'green',
                '&:hover': { backgroundColor: 'darkgreen' },
                height: 'auto',
                minHeight: { xs: '60px', sm: '48px' },
                py: 1.5,
                px: { xs: 1, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 1, sm: 0.5 },
                '& .MuiButton-startIcon': {
                  margin: { xs: '0 0 4px 0', sm: '0 8px 0 0' }
                }
              }}
            >
              <Typography
                variant="button"
                sx={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  lineHeight: 1.2,
                  wordBreak: 'break-word'
                }}
              >
                Contact Support
              </Typography>
            </Button>
            <Button
              onClick={handleCloseClick}
              sx={{
                color: 'white',
                backgroundColor: 'red',
                '&:hover': { backgroundColor: 'darkred' }
              }}
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
    </Box>
  );
};

export default CourseBookingFullMessage;