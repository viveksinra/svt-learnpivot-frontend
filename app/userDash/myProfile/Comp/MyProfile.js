import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Skeleton,
  Container,
  Paper
} from '@mui/material';
import {
  Mail as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import AddressInput from '@/app/Components/PublicPage/LoginSignUp/AddressInput';
import { myProfileService } from '@/app/services';
import MySnackbar from '@/app/Components/MySnackbar/MySnackbar';
import PasswordConfirmDialog from './PasswordConfirmDialog';



const ProfileInfo = ({
  icon: Icon,
  label,
  value,
  isEditing,
  name,
  onChange,
  error,
  helperText,
  component: Component = TextField,
  disabled = false
}) => {
  if (isEditing) {
    return (
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Box
          sx={{
            minWidth: 48,
            height: 48,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'primary.main',
            color: 'white'
          }}
        >
          <Icon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Component
            fullWidth
            name={name}
            label={label}
            value={value || ''}
            onChange={onChange}
            error={error}
            helperText={helperText}
            size="small"
            disabled={disabled}
          />
        </Box>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        mb: 3,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateX(8px)'
        }
      }}
    >
      <Box
        sx={{
          minWidth: 48,
          height: 48,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'primary.main',
          color: 'white'
        }}
      >
        <Icon />
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="500">
          {value || 'Not provided'}
        </Typography>
      </Box>
    </Stack>
  );
};

const ProfileInfoSkeleton = () => (
  <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
    <Skeleton variant="rounded" width={48} height={48} />
    <Box sx={{ flex: 1 }}>
      <Skeleton variant="text" width={100} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width={200} />
    </Box>
  </Stack>
);

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({});
  const [initialProfile, setInitialProfile] = useState({});
  const [errors, setErrors] = useState({});
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const snackRef = useRef();

  useEffect(() => {
    async function getProfile() {
      try {
        setIsLoading(true);
        const res = await myProfileService.getMyProfile();
        if (res.variant === 'success') {
          setProfile(res.data);
          setInitialProfile(res.data);
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        window.location.reload();
      } finally {
        setIsLoading(false);
      }
    }
    getProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, ...extra } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
      ...extra
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!profile?.firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!profile?.lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!profile?.email?.trim()) newErrors.email = 'Email is required';
    if (!profile?.mobile?.trim()) newErrors.mobile = 'Phone number is required';
    if (!profile?.address1?.trim()) newErrors.address1 = 'Address is required';
    if (!profile?.city?.trim()) newErrors.city = 'City is required';
    if (!profile?.postcode?.trim()) newErrors.postcode = 'Postcode is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordConfirm = async (password) => {
    try {
      const res = await myProfileService.updateMyProfile({
        ...profile,
        password
      });
      
      if (res.variant === 'success') {
        setProfile(res.data);
        setInitialProfile(res.data);
        setIsEditing(false);
        setIsPasswordDialogOpen(false);
        if (snackRef.current) {
          snackRef.current.handleSnack({
            message: 'Profile updated successfully',
            variant: 'success'
          });
        }
      } else {
        if (snackRef.current) {
          snackRef.current.handleSnack({
            message: res.message || 'Failed to update profile',
            variant: 'error'
          });
        }
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      if (snackRef.current) {
        snackRef.current.handleSnack({
          message: 'An error occurred while updating profile',
          variant: 'error'
        });
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Box sx={{ 
          bgcolor: 'primary.main', 
          py: 2, 
          px: 4,
          color: 'white'
        }}>
          <Typography variant="h5" fontWeight="600">
            My Profile
          </Typography>
        </Box>
        
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            justifyContent: 'space-between',
            alignItems: { xs: 'center', md: 'flex-start' },
            mb: 4,
            gap: 2
          }}>
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={3} 
              alignItems="center"
              width="100%"
            >
              {isLoading ? (
                <>
                  <Skeleton variant="circular" width={80} height={80} />
                  <Box>
                    <Skeleton variant="text" width={200} height={40} sx={{ mb: 0.5 }} />
                  </Box>
                </>
              ) : (
                <>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      boxShadow: 2
                    }}
                  >
                    {profile?.firstName?.charAt(0)}
                  </Avatar>
                  <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                    {isEditing ? (
                      <Stack spacing={2}>
                        <TextField
                          name="firstName"
                          label="First Name"
                          value={profile?.firstName || ''}
                          onChange={handleChange}
                          error={!!errors.firstName}
                          helperText={errors.firstName}
                          size="small"
                          variant="outlined"
                        />
                        <TextField
                          name="lastName"
                          label="Last Name"
                          value={profile?.lastName || ''}
                          onChange={handleChange}
                          error={!!errors.lastName}
                          helperText={errors.lastName}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                    ) : (
                      <>
                        <Typography variant="h4" sx={{ 
                          fontWeight: 700, 
                          mb: 0.5,
                          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' }
                        }}>
                          {`${profile?.firstName} ${profile?.lastName}`}
                        </Typography>
                      </>
                    )}
                  </Box>
                </>
              )}
            </Stack>
            {!isLoading && !isEditing && (
              <Button 
                onClick={handleEdit} 
                startIcon={<EditIcon />}
                variant="outlined"
                sx={{ 
                  height: 'fit-content',
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Edit Profile
              </Button>
            )}
          </Box>

          <Divider sx={{ mb: 4 }} />

          {isLoading ? (
            <>
              <ProfileInfoSkeleton />
              <ProfileInfoSkeleton />
              <ProfileInfoSkeleton />
              <ProfileInfoSkeleton />
              <ProfileInfoSkeleton />
            </>
          ) : (
            <>
              <ProfileInfo
                icon={EmailIcon}
                label="Email"
                value={profile?.email}
                isEditing={isEditing}
                name="email"
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={true}
              />
              <ProfileInfo
                icon={PhoneIcon}
                label="Mobile"
                value={profile?.mobile}
                isEditing={isEditing}
                name="mobile"
                onChange={handleChange}
                error={!!errors.mobile}
                helperText={errors.mobile}
              />
              <ProfileInfo
                icon={LocationIcon}
                label="Address Line 1"
                value={profile?.address1}
                isEditing={isEditing}
                name="address1"
                onChange={handleChange}
                error={!!errors.address1}
                helperText={errors.address1}
                component={AddressInput}
              />
              <ProfileInfo
                icon={LocationIcon}
                label="Address Line 2"
                value={profile?.address2}
                isEditing={isEditing}
                name="address2"
                onChange={handleChange}
                error={!!errors.address2}
                helperText={errors.address2}
              />
              <ProfileInfo
                icon={LocationIcon}
                label="Address Line 3"
                value={profile?.address3}
                isEditing={isEditing}
                name="address3"
                onChange={handleChange}
                error={!!errors.address3}
                helperText={errors.address3}
              />
              <ProfileInfo
                icon={LocationIcon}
                label="City"
                value={profile?.city}
                isEditing={isEditing}
                name="city"
                onChange={handleChange}
                error={!!errors.city}
                helperText={errors.city}
              />
              <ProfileInfo
                icon={LocationIcon}
                label="Postcode"
                value={profile?.postcode}
                isEditing={isEditing}
                name="postcode"
                onChange={handleChange}
                error={!!errors.postcode}
                helperText={errors.postcode}
              />
            </>
          )}

          {isEditing && (
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button 
                onClick={handleCancel}
                sx={{ 
                  color: 'white', 
                  backgroundColor: 'red', 
                  '&:hover': { backgroundColor: 'darkred' },
                  flex: 1,
                  maxWidth: 200,
                  marginRight: '16px',
                  py: 1
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate}
                sx={{ 
                  color: 'white', 
                  backgroundColor: 'green', 
                  '&:hover': { backgroundColor: 'darkgreen' },
                  flex: 1,
                  maxWidth: 200,
                  py: 1
                }}
              >
                Update Changes
              </Button>
            </Box>
          )}
        </CardContent>
      </Paper>

      <PasswordConfirmDialog
        open={isPasswordDialogOpen}
        onConfirm={handlePasswordConfirm}
        onCancel={() => setIsPasswordDialogOpen(false)}
      />
      <MySnackbar ref={snackRef} />
    </Container>
  );
};

export default UserProfile;