import React, { useState, useEffect, useRef, useCallbainitialChildStateck, memo, useCallback } from 'react';
import {
  TextField, MenuItem, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Box, Typography, IconButton,
  styled
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { childService } from '@/app/services';

const ChildContainer = styled(Box)(({ theme, selected }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.grey[300]}`,
  cursor: 'pointer',
  transition: 'border 0.3s, transform 0.3s',
  position: 'relative',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  ...(selected && {
    transform: 'scale(1.02)',
  }),
}));

const CheckIconContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  padding: 2,
}));

const initialChildState = {
  _id: '',
  childName: '',
  childDob: '',
  childGender: '',
  childYear: '',
};

const CourseChildSelector = memo(({ 
  isMobile, title, setTotalAmount,
   setSelectedDates, selectedChild, 
   setSelectedChild, setStep }) => {
  const [allChildren, setAllChildren] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [newChild, setNewChild] = useState(initialChildState);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialMount = useRef(true);
  const childrenLoaded = useRef(false);

    // Add this new useEffect to reset errors when dialog opens/closes
    useEffect(() => {
      setErrors({
        childName: '',
        childDob: '',
        childGender: '',
        childYear: ''
      });
    }, [open]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const fields = ['childName', 'childDob', 'childGender', 'childYear'];
    
    fields.forEach(field => {
      if (!newChild[field]) {
        newErrors[field] = `${field.replace('child', '')} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [newChild]);

  const handleSelectChild = useCallback((child) => {
    setSelectedChild(child);
    setSelectedDates(null);
    setTotalAmount('');
  }, [setSelectedChild, setSelectedDates, setTotalAmount]);

  const handleGetAllChildren = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && (childrenLoaded.current || isLoading)) return;
    
    try {
      setIsLoading(true);
      const response = await childService.getAll();
      if (response.data) {
        setAllChildren(response.data);
        childrenLoaded.current = true;
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Check for childId in URL params and select that child
  useEffect(() => {
    if (allChildren.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const childId = urlParams.get('childId');
      
      if (childId) {
        const childToSelect = allChildren.find(child => child._id === childId);
        if (childToSelect) {
          handleSelectChild(childToSelect);
          setStep(3); // Automatically advance to step 3
        }
      }
    }
  }, [allChildren, handleSelectChild, setStep]);

  useEffect(() => {
    if (isInitialMount.current) {
      handleGetAllChildren();
      isInitialMount.current = false;
    }
  }, [handleGetAllChildren]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setNewChild(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }, []);

  const handleAddChild = useCallback(async () => {
    try {
      const response = await childService.add(newChild._id, newChild);
      console.log('response:', response.variant);
      if (response.variant === 'success') {
        handleGetAllChildren(true); // Move this inside the success condition
        setOpen(false);
        setNewChild(initialChildState); // Clear the fields
      }
    } catch (error) {
      console.error('Error adding child:', error);
    }
  }, [newChild, handleGetAllChildren]); // Ensure handleGetAllChildren is in the dependency array

  const handleConfirmAddChild = useCallback(() => {
    setConfirmOpen(false);
    handleAddChild();
  }, [handleAddChild]);

  const dialogActions = (
    <DialogActions>
      <Button 
        variant="contained"
        style={{ 
          backgroundColor: '#FC7658', 
          color: 'white',
        }}
        onClick={() => setOpen(false)}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        style={{ 
          backgroundColor: '#4CAF50', 
          color: 'white',
        }}
        onClick={() => validateForm() && setConfirmOpen(true)}
      >
        Add Child
      </Button>
    </DialogActions>
  );

  return (
    <div style={{ padding: isMobile ? 20 : 0 }}>
      <Typography variant="h6" gutterBottom>
        Select a child for {title}:
      </Typography>

      {allChildren.map((child) => (
        <ChildContainer
          key={child._id}
          selected={selectedChild?._id === child._id}
          onClick={() => handleSelectChild(child)}
        >
          {child.childImage && (
            <img
              src={child.childImage}
              alt={child.childName}
              style={{ width: 40, height: 40, marginRight: 16, borderRadius: '50%' }}
            />
          )}
          <Typography variant="body1">{child.childName}</Typography>
          {selectedChild?._id === child._id && (
            <CheckIconContainer>
              <CheckCircleIcon style={{ color: '#fff' }} />
            </CheckIconContainer>
          )}
        </ChildContainer>
      ))}

      <ChildContainer onClick={() => setOpen(true)}>
        <AddIcon />
        <Typography variant="body1" style={{ marginLeft: 16 }}>
          Add A New Child
        </Typography>
      </ChildContainer>

      <Dialog 
        open={open} 
        onClose={() => {}}
        disableBackdropClick
        disableEscapeKeyDown
        keepMounted
      >
        <DialogTitle>Add a New Child</DialogTitle>
        <DialogContent >
          <DialogContentText>Please fill in the details of the new child.</DialogContentText>
          <Box component="form" sx={{ mt: 2, maxWidth: 500 }} >
            {[
              { name: 'childName', label: 'Full Name', type: 'text' },
              { name: 'childDob', label: 'Date Of Birth', type: 'date' },
              { 
                name: 'childGender', 
                label: 'Gender', 
                type: 'select',
                options: [
                  { value: 'Boy', label: 'Boy' },
                  { value: 'Girl', label: 'Girl' }
                ]
              },
              {
                name: 'childYear',
                label: 'Year Group',
                type: 'select',
                options: [
                  { value: 'Year 5', label: 'Year 5' },
                  { value: 'Year 4', label: 'Year 4' },
                  { value: 'Other', label: 'Other' }
                ]
              }
            ].map(field => (
              field.type === 'select' ? (
                <TextField
                  key={field.name}
                  select
                  fullWidth
                  margin="dense"
                  name={field.name}
                  label={field.label}
                  value={newChild[field.name]}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                >
                  {field.options.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  key={field.name}
                  fullWidth
                  margin="dense"
                  name={field.name}
                  label={field.label}
                  type={field.type}
                  value={newChild[field.name]}
                  onChange={handleInputChange}
                  error={!!errors[field.name]}
                  helperText={errors[field.name]}
                  focused={field.type === 'date'}
                />
              )
            ))}
          </Box>
        </DialogContent>
        {dialogActions}
      </Dialog>

      <Dialog 
        open={confirmOpen} 
        onClose={() => {}}
        // disableBackdropClick
        // disableEscapeKeyDown
        keepMounted
        PaperProps={{
          style: { 
            backgroundColor: '#f0f0f0',
            borderRadius: 12 
          }
        }}
      >
        <DialogTitle>Confirm Child Details</DialogTitle>
        <DialogContent>
          <DialogContentText>Please confirm the details of the new child.</DialogContentText>
          <Box sx={{ mt: 2, mb: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
            <Typography><strong>Name:</strong> {newChild.childName}</Typography>
            <Typography><strong>Date of Birth:</strong> {formatDate(newChild.childDob)}</Typography>
            <Typography><strong>Gender:</strong> {newChild.childGender}</Typography>
            <Typography><strong>Year Group:</strong> {newChild.childYear}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setConfirmOpen(false)}
            variant="contained"
            style={{ backgroundColor: '#FC7658', color: 'white' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmAddChild}
            variant="contained" 
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {selectedChild?._id && (
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: 16 }}
          onClick={() => setStep(3)}
        >
          {isMobile ? 'Proceed' : 'Proceed'}
        </Button>
      )}
    </div>
  );
});

CourseChildSelector.displayName = 'CourseChildSelector';

export default CourseChildSelector;