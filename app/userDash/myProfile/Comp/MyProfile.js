import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Avatar,
  Divider,
  IconButton,
  TextField
} from '@mui/material';
import {
  Mail as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import AddressInput from '@/app/Components/PublicPage/LoginSignUp/AddressInput';
import { myProfileService } from '@/app/services';

const ProfileInfo = ({
  icon: Icon,
  label,
  value,
  isEditing,
  name,
  onChange,
  error,
  helperText,
  component: Component = TextField
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

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({});
  const [initialProfile, setInitialProfile] = useState({});
  const [errors, setErrors] = useState({});
  const snackRef = useRef();

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await myProfileService.getMyProfile();
        if (res.variant === 'success') {
          setProfile(res.data);
          setInitialProfile(res.data);
        } else {
          // Handle error appropriately; for example, reload the page:
          window.location.reload();
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        window.location.reload();
      }
    }
    getProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Revert to the last saved profile data.
    setProfile(initialProfile);
    setIsEditing(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
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

    try {
      const res = await myProfileService.updateMyProfile(profile);
      if (res.variant === 'success') {
        // Update both the current and initial profile to the saved data.
        setProfile(res.data);
        setInitialProfile(res.data);
        setIsEditing(false);
        // Optionally, display a success message here (e.g., via a snackbar).
      } else {
        console.error('Profile update failed:', res);
        if(res.message) 
        {
            snackRef.current.handleSnack(res);
        } else {
        snackRef.current.handleSnack({ message: 'Failed to fetch children.', variant: 'error' });
        }
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      // Optionally handle the error (e.g., show an error message to the user).
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 'bold'
              }}
            >
              {profile?.firstName?.charAt(0)}
            </Avatar>
            <Box>
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
                  />
                  <TextField
                    name="lastName"
                    label="Last Name"
                    value={profile?.lastName || ''}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    size="small"
                  />
                </Stack>
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {`${profile?.firstName} ${profile?.lastName}`}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {profile?.jobRole?.label || 'User'}
                  </Typography>
                </>
              )}
            </Box>
          </Stack>
          <Box>
            {isEditing ? (
              <Stack direction="row" spacing={1}>
                <IconButton onClick={handleUpdate} color="primary">
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={handleCancel} color="error">
                  <CancelIcon />
                </IconButton>
              </Stack>
            ) : (
              <IconButton onClick={handleEdit} color="primary">
                <EditIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <ProfileInfo
          icon={EmailIcon}
          label="Email"
          value={profile?.email}
          isEditing={isEditing}
          name="email"
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
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
          label="Address"
          value={profile?.address1}
          isEditing={isEditing}
          name="address1"
          onChange={handleChange}
          error={!!errors.address1}
          helperText={errors.address1}
          component={AddressInput}
        />
        {isEditing && (
          <>
            <ProfileInfo
              icon={LocationIcon}
              label="Address Line 2"
              value={profile?.address2}
              isEditing={isEditing}
              name="address2"
              onChange={handleChange}
            />
            <ProfileInfo
              icon={LocationIcon}
              label="Address Line 3"
              value={profile?.address3}
              isEditing={isEditing}
              name="address3"
              onChange={handleChange}
            />
          </>
        )}
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
      </CardContent>

    </Card>
  );
};

export default UserProfile;
