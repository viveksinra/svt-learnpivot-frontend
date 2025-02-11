"use client";
import React, { useEffect, useRef, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  useTheme, 
  Grid, 
  Card, 
  CardContent,
  Avatar,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import { myProfileService } from '@/app/services';
import { useRouter } from 'next/navigation';
import MySnackbar from '@/app/Components/MySnackbar/MySnackbar';
import { 
  Person, 
  Email, 
  Phone, 
  LocationOn, 
  School, 
  Cake 
} from '@mui/icons-material';
import moment from 'moment';

const Profile = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState({
    msg: "Welcome",
    firstName: "Guest",
    lastName: "",
    designation: "Role"
  });
  const router = useRouter();
  const [allChildren, setAllChildren] = useState([]);
  const snackRef = useRef();

  useEffect(() => {
    handleGetAllChildren();
  }, []);

  const handleGetAllChildren = async () => {
    try {
      const response = await myProfileService.getMyAllChild();
      if (response.data) {
        setAllChildren(response.data);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      snackRef.current.handleSnack({ message: 'Failed to fetch children.', variant: 'error' });
    }
  };

  useEffect(() => {
    async function getProfile() {
      let res = await myProfileService.getMyProfile();
      if (res.variant === "success") {
        setProfile(res.data);
      } else {
        router.reload();
      }
    }
    getProfile();
  }, []);

  const InfoItem = ({ icon, label, value }) => (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
      {icon}
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">
          {value || 'Not provided'}
        </Typography>
      </Box>
    </Stack>
  );

  const ChildCard = ({ child }) => (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        mb: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
        }
      }}
    >
      <Stack direction="row" spacing={3} alignItems="center">
        <Avatar 
          sx={{ 
            width: 64, 
            height: 64,
            bgcolor: theme.palette.primary.main
          }}
        >
          {child.childName.charAt(0)}
        </Avatar>
        <Box flex={1}>
          <Typography variant="h6" gutterBottom>
            {child.childName}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip 
              icon={<School />} 
              label={child.childYear}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip 
              icon={<Cake />}
              label={moment(child.childDob).format('DD MMM YYYY')}
              size="small"
              variant="outlined"
            />
            <Chip 
              label={child.childGender}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );

  return (
    <Box sx={{ 
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          {/* Profile Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                  <Avatar 
                    sx={{ 
                      width: 80, 
                      height: 80,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '2rem'
                    }}
                  >
                    {profile.firstName?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h4">
                      {`${profile.firstName} ${profile.lastName}`}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {profile.jobRole?.label || 'User'}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <InfoItem 
                  icon={<Email color="primary" />}
                  label="Email"
                  value={profile.email}
                />
                <InfoItem 
                  icon={<Phone color="primary" />}
                  label="Mobile"
                  value={profile.mobile}
                />
                <InfoItem 
                  icon={<LocationOn color="primary" />}
                  label="Address"
                  value={`${profile.address1}${profile.address2 ? `, ${profile.address2}` : ''}${profile.address3 ? `, ${profile.address3}` : ''}`}
                />
                <InfoItem 
                  icon={<LocationOn color="primary" />}
                  label="City & Postcode"
                  value={`${profile.city}, ${profile.postcode}`}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Children Information */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Children
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                {allChildren.length > 0 ? (
                  allChildren.map((child) => (
                    <ChildCard key={child._id} child={child} />
                  ))
                ) : (
                  <Typography color="text.secondary" align="center">
                    No children registered
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <MySnackbar ref={snackRef} />
    </Box>
  );
};

export default Profile;