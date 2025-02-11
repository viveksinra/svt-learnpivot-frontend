import React, { useEffect, useRef, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Box, 
  Avatar,
  CircularProgress,
  Container,
  Snackbar,
  Alert,
  Button,
  IconButton
} from '@mui/material';
import { School, Cake, Person } from '@mui/icons-material';
import { format, parseISO, isValid } from 'date-fns';
import { myProfileService } from '@/app/services';
import EditIcon from '@mui/icons-material/Edit';
import PasswordConfirmDialog from './PasswordConfirmDialog';
import ChildDialog from './ChildDialog';

const ChildCard = ({ child, onEdit }) => {
  const formatDate = (dateString) => {
    try {
      // First try to parse the ISO string
      const date = parseISO(dateString);
      
      // Check if the parsed date is valid
      if (isValid(date)) {
        return format(date, 'dd MMM yyyy');
      }
      
      // If parsing ISO fails, try creating a new Date object
      const fallbackDate = new Date(dateString);
      if (isValid(fallbackDate)) {
        return format(fallbackDate, 'dd MMM yyyy');
      }
      
      // If all parsing fails, return the original string
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
          borderColor: 'primary.main',
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
            <Typography 
              variant="h6" 
              sx={{ mb: 1, fontWeight: 600 }}
            >
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
                  fontSize: '0.875rem',
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
                  fontSize: '0.875rem',
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
                  fontSize: '0.875rem',
                }}
              >
                <Person fontSize="small" />
                {child.childGender}
              </Box>
            </Stack>
          </Box>
          <IconButton onClick={() => onEdit(child)}>
            <EditIcon />
          </IconButton>
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
    <CardContent sx={{ 
      p: 4, 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: 200 
    }}>
      <CircularProgress />
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
      <Typography color="error">
        {message}
      </Typography>
    </CardContent>
  </Card>
);

const ChildrenList = () => {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const snackbarRef = useRef();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [childDialogOpen, setChildDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentChild, setCurrentChild] = useState(null);
  const [tempPassword, setTempPassword] = useState('');

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
      // Preserve the original ID when updating child data
      const updatedChildData = {
        ...childData,
        _id: currentChild._id // Keep the original ID
      };
      console.log('Updated child data:', updatedChildData);
      setCurrentChild(updatedChildData);
      setChildDialogOpen(false);
      setPasswordDialogOpen(true);
    } else {
      setChildDialogOpen(false);
      addChild(childData);
    }
  };

  const addChild = async (childData) => {
    try {
      // Call the service to add the child
      // e.g.: const response = await myProfileService.addChild(childData);
      // if (response.variant === 'success') { ... } else { ... }
      // On success, refresh children or show a success snackbar
    } catch (err) {
      // Handle error scenario, show an error snackbar
    }
  };

  const handleConfirmPassword = async (password) => {
    console.log('Current Child State:', currentChild); // Debug log
    // MongoDB typically uses _id, but API might return id
    const childId = currentChild?._id || currentChild?.id;
    if (!childId) {
      console.error('No child ID found:', currentChild);
      return;
    }

    const updatedChildData = { ...currentChild, password };
    try {
      const res = await myProfileService.updateMyOneChild(childId, updatedChildData);
      if (res.variant === 'success') {
        // After successful update, refresh the children list
        await fetchChildren();
        setPasswordDialogOpen(false);
        if (snackRef.current) {
          snackRef.current.handleSnack({
            message: 'Child Profile updated successfully',
            variant: 'success'
          });
        }
      }
      // ...rest of the error handling remains the same...
    } catch (error) {
      // ...existing error handling...
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600,
              mb: 3
            }}
          >
            Children
          </Typography>
          <Box sx={{ textAlign: 'right', mb: 2 }}>
            <Button variant="contained" onClick={() => handleOpenChildDialog()}>
              Add Child
            </Button>
          </Box>
          {children.length > 0 ? (
            children.map((child) => (
              <ChildCard key={child._id} child={child} onEdit={handleOpenChildDialog} />
            ))
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center',
                py: 8
              }}
            >
              <Typography color="text.secondary">
                No children registered
              </Typography>
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
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
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
        onCancel={() => setPasswordDialogOpen(false)}
      />
    </>
  );
};

export default ChildrenList;