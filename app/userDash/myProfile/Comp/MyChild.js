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
  Alert
} from '@mui/material';
import { School, Cake, Person } from '@mui/icons-material';
import { format } from 'date-fns';
import { myProfileService } from '@/app/services';

const ChildCard = ({ child }) => {
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
                {format(new Date(child.childDob), 'dd MMM yyyy')}
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
          
          {children.length > 0 ? (
            children.map((child) => (
              <ChildCard key={child._id} child={child} />
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
    </>
  );
};

export default ChildrenList;