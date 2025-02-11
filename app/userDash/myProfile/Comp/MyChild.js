import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Avatar,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  IconButton,
  Skeleton
} from '@mui/material';
import { School, Cake, Person } from '@mui/icons-material';
import { format, parseISO, isValid } from 'date-fns';
import { myProfileService } from '@/app/services';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PasswordConfirmDialog from './PasswordConfirmDialog';
import ChildDialog from './ChildDialog';

const ChildCard = ({ child, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      // First try to parse the ISO string
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'dd MMM yyyy');
      }
      // If parsing ISO fails, try creating a new Date object
      const fallbackDate = new Date(dateString);
      if (isValid(fallbackDate)) {
        return format(fallbackDate, 'dd MMM yyyy');
      }
      // If all parsing fails, return an informative message
      return 'Invalid Date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        mb: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[4],
          borderColor: 'primary.main'
        }
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.main',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}
          >
            {child.childName.charAt(0)}
          </Avatar>

          <Box flex={1}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
              {child.childName}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'primary.lighter',
                  color: 'primary.main',
                  py: 0.5,
                  px: 1.5,
                  borderRadius: 2,
                  fontSize: '0.875rem'
                }}
              >
                <School fontSize="small" />
                {child.childYear}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'grey.100',
                  color: 'grey.700',
                  py: 0.5,
                  px: 1.5,
                  borderRadius: 2,
                  fontSize: '0.875rem'
                }}
              >
                <Cake fontSize="small" />
                {formatDate(child.childDob)}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: 'grey.100',
                  color: 'grey.700',
                  py: 0.5,
                  px: 1.5,
                  borderRadius: 2,
                  fontSize: '0.875rem'
                }}
              >
                <Person fontSize="small" />
                {child.childGender}
              </Box>
            </Stack>
          </Box>
          <Stack direction="row">
            <IconButton onClick={() => onEdit(child)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(child)} color="error">
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const LoadingState = () => (
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
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        <Skeleton width={120} />
      </Typography>
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Skeleton width={100} height={36} sx={{ ml: 'auto' }} />
      </Box>
      {[1, 2].map((item) => (
        <Card
          key={item}
          elevation={0}
          sx={{
            mb: 2,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center">
              <Skeleton variant="circular" width={56} height={56} />
              <Box flex={1}>
                <Skeleton width={200} height={32} sx={{ mb: 1 }} />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Skeleton width={100} height={32} />
                  <Skeleton width={120} height={32} />
                  <Skeleton width={80} height={32} />
                </Stack>
              </Box>
              <Stack direction="row" spacing={1}>
                <Skeleton width={40} height={40} />
                <Skeleton width={40} height={40} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
);

const ErrorState = ({ message }) => (
  <Card
    elevation={0}
    sx={{
      borderRadius: 4,
      border: '1px solid',
      borderColor: 'divider',
      height: '100%'
    }}
  >
    <CardContent sx={{ p: 4, textAlign: 'center' }}>
      <Typography color="error">{message}</Typography>
    </CardContent>
  </Card>
);

const ChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [currentChild, setCurrentChild] = useState(null);

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await myProfileService.getMyAllChild();
      if (response.variant !== 'success') {
        throw new Error(response.message || 'Failed to fetch children');
      }

      setChildren(response.data || []);
    } catch (err) {
      setError(err.message);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to fetch children',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChildDialog = (child = null) => {
    setEditMode(!!child);
    setCurrentChild(child);
    setChildDialogOpen(true);
  };

  const handleCloseChildDialog = () => {
    setChildDialogOpen(false);
    setEditMode(false);
    setCurrentChild(null);
  };

  const handleChildSubmit = (childData) => {
    if (editMode) {
      // For edit mode, preserve the original ID and update state
      const updatedChildData = {
        ...childData,
        _id: currentChild._id // Keep the original ID
      };
      setCurrentChild(updatedChildData);
      setChildDialogOpen(false);
      // Open password confirmation dialog before updating
      setPasswordDialogOpen(true);
    } else {
      addChild(childData);
    }
  };

  const addChild = async (childData) => {
    try {
      const res = await myProfileService.addChild(childData);
      if (res.variant !== 'success') {
        throw new Error(res.message || 'Failed to add child');
      }
      // Refresh the children list after successful addition
      await fetchChildren();
      setChildDialogOpen(false);
      setPasswordDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Child Profile added successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Failed to add child',
        severity: 'error'
      });
    }
  };

  const handleDeleteChild = (child) => {
    setCurrentChild(child);
    setDeleteMode(true);
    setPasswordDialogOpen(true);
  };

  const handleConfirmPassword = async (password) => {
    const childId = currentChild?._id || currentChild?.id;
    if (!childId) {
      setSnackbar({
        open: true,
        message: 'No child ID found. Unable to process request.',
        severity: 'error'
      });
      return;
    }

    if (deleteMode) {
      try {
        const res = await myProfileService.deleteMyOneChild(childId, { password });
        if (res.variant !== 'success') {
          throw new Error(res.message || 'Failed to delete child');
        }
        await fetchChildren();
        setSnackbar({
          open: true,
          message: 'Child Profile deleted successfully',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to delete child',
          severity: 'error'
        });
      }
    } else {
      // Existing update logic
      const updatedChildData = { ...currentChild, password };
      try {
        const res = await myProfileService.updateMyOneChild(childId, updatedChildData);
        if (res.variant !== 'success') {
          throw new Error(res.message || 'Failed to update child');
        }
        // Refresh the children list after a successful update
        await fetchChildren();
        setPasswordDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Child Profile updated successfully',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: error.message || 'Failed to update child',
          severity: 'error'
        });
      }
    }
    setPasswordDialogOpen(false);
    setDeleteMode(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <>
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
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Children
          </Typography>
          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <Button variant="contained" onClick={() => handleOpenChildDialog()}>
              Add Child
            </Button>
          </Box>
          {children.length > 0 ? (
            children.map((child) => (
              <ChildCard 
                key={child._id} 
                child={child} 
                onEdit={handleOpenChildDialog}
                onDelete={handleDeleteChild}
              />
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography color="text.secondary">No children registered</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <ChildDialog
        open={childDialogOpen}
        editMode={editMode}
        initialData={currentChild}
        onClose={handleCloseChildDialog}
        onSubmit={handleChildSubmit}
      />
      <PasswordConfirmDialog
        open={passwordDialogOpen}
        onConfirm={handleConfirmPassword}
        onCancel={() => {
          setPasswordDialogOpen(false);
          setDeleteMode(false);
        }}
        title={deleteMode ? "Confirm Delete" : "Confirm Update"}
        message={deleteMode ? "Please enter your password to confirm deletion" : "Please enter your password to confirm update"}
      />
    </>
  );
};

export default ChildrenList;
