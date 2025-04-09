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
  Paper,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Mail as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Home as HomeIcon
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
            color: 'white',
            boxShadow: 1
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
            variant="outlined"
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
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateX(8px)',
          bgcolor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: 2,
          px: 1,
          py: 0.5,
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
          color: 'white',
          boxShadow: 2
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
  const [isManualAddressEdit, setIsManualAddressEdit] = useState(false);
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
    setIsManualAddressEdit(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle address fields clearing when address1 is emptied
    if (name === 'address1' && !value.trim()) {
      setProfile((prev) => ({
        ...prev,
        address1: '',
        address2: '',
        address3: '',
        city: '',
        postcode: ''
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value
      }));
    }
    
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
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 6
          }
        }}
      >
        <Box sx={{ 
          bgcolor: 'primary.main', 
          py: 2.5, 
          px: 4,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography 
            variant="h5" 
            fontWeight="600"
            sx={{ 
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              letterSpacing: '0.5px'
            }}
          >
            My Profile
          </Typography>
          {!isLoading && !isEditing && (
            <IconButton 
              onClick={handleEdit}
              sx={{ 
                color: 'white',
                width: 36,
                height: 36,
                border: '1px solid rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
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
                  <Skeleton variant="circular" width={90} height={90} />
                  <Box>
                    <Skeleton variant="text" width={200} height={40} sx={{ mb: 0.5 }} />
                  </Box>
                </>
              ) : (
                <>
                  <Avatar
                    sx={{
                      width: 90,
                      height: 90,
                      bgcolor: 'primary.main',
                      fontSize: '2.8rem',
                      fontWeight: 'bold',
                      boxShadow: 3,
                      border: '3px solid #fff',
                      position: 'relative',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '2px solid rgba(0,0,0,0.1)',
                        top: 0,
                        left: 0
                      }
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
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Contact Information
              </Typography>
              
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
              
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                  Address Information
                </Typography>
              </Box>
              
              {isEditing && (
                <ProfileInfo
                  icon={LocationIcon}
                  label="Address Line 1"
                  value={profile?.address1}
                  isEditing={isEditing}
                  name="address1"
                  onChange={handleChange}
                  error={!!errors.address1}
                  helperText={errors.address1}
                  component={isManualAddressEdit ? TextField : AddressInput}
                />
              )}
              
              {!isManualAddressEdit || !isEditing ? (
                <>
                  {profile?.postcode && (
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        mb: 3, 
                        bgcolor: 'rgba(0, 0, 0, 0.02)',
                        position: 'relative'
                      }}
                    >
                      {isEditing && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon fontSize="small" />}
                          onClick={() => setIsManualAddressEdit(true)}
                          sx={{ 
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            fontSize: '0.75rem',
                            padding: '2px 8px',
                            minWidth: 'auto',
                            width: 'fit-content',
                            maxWidth: '120px',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            display: 'inline-flex',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              borderColor: 'primary.dark'
                            }
                          }}
                        >
                          Manual Edit
                        </Button>
                      )}
                      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mt: isEditing ? 4 : 0 }}>
                        <HomeIcon color="primary" sx={{ mt: 0.5 }} />
                        <Box>
                          {profile?.address1 && <Typography variant="body1">{profile?.address1}</Typography>}
                          {profile?.address2 && <Typography variant="body1">{profile?.address2}</Typography>}
                          {profile?.address3 && <Typography variant="body1">{profile?.address3}</Typography>}
                          {profile?.city && <Typography variant="body1">{profile?.city}</Typography>}
                          {profile?.postcode && <Typography variant="body1" fontWeight="bold">{profile?.postcode}</Typography>}
                        </Box>
                      </Stack>
                    </Paper>
                  )}
                </>
              ) : (
                <>
                  {isEditing && (
                    <>
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
                </>
              )}
            </>
          )}

          {isEditing && (
            <Box sx={{ 
              mt: 4, 
              display: 'flex', 
              justifyContent: 'center',
              gap: 2
            }}>
              <Button 
                variant="contained"
                onClick={handleCancel}
                sx={{ 
                  bgcolor: 'error.main', 
                  '&:hover': { bgcolor: 'error.dark' },
                  flex: 1,
                  maxWidth: 200,
                  py: 1,
                  boxShadow: 2
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained"
                onClick={handleUpdate}
                sx={{ 
                  bgcolor: 'success.main', 
                  '&:hover': { bgcolor: 'success.dark' },
                  flex: 1,
                  maxWidth: 200,
                  py: 1,
                  boxShadow: 2
                }}
              >
                Save Changes
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