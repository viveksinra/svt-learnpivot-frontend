import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Button, Box, Typography
} from '@mui/material';

const ChildDialog = ({ open, onClose, onSubmit, editMode, initialData }) => {
  const [childData, setChildData] = useState({
    childName: '',
    childDob: '',
    childGender: '',
    childYear: ''
  });
  const [errors, setErrors] = useState({
    childName: '',
    childDob: '',
    childGender: '',
    childYear: ''
  });

  // Add this new useEffect to reset errors when dialog opens/closes
  useEffect(() => {
    setErrors({
      childName: '',
      childDob: '',
      childGender: '',
      childYear: ''
    });
  }, [open]);
  
  useEffect(() => {
    if (editMode && initialData) {
      // Format the date for the input field (YYYY-MM-DD format)
      let formattedDate = '';
      try {
        if (initialData.childDob) {
          // Try parsing as ISO string first
          const date = parseISO(initialData.childDob);
          formattedDate = format(date, 'yyyy-MM-dd');
        }
      } catch (error) {
        console.error('Error formatting date:', error);
        // If parsing fails, try to use the date string as is
        formattedDate = initialData.childDob;
      }

      setChildData({
        childName: initialData.childName || '',
        childDob: formattedDate,
        childGender: initialData.childGender || '',
        childYear: initialData.childYear || ''
      });
    } else {
      // Reset form for new child
      setChildData({
        childName: '',
        childDob: '',
        childGender: '',
        childYear: ''
      });
    }
    // Reset errors when switching between add/edit modes
    setErrors({
      childName: '',
      childDob: '',
      childGender: '',
      childYear: ''
    });
  }, [editMode, initialData, open]); // Added 'open' as dependency

  const validateForm = () => {
    let tempErrors = {
      childName: '',
      childDob: '',
      childGender: '',
      childYear: ''
    };
    let isValid = true;

    if (!childData.childName.trim()) {
      tempErrors.childName = 'Name is required';
      isValid = false;
    }

    if (!childData.childDob) {
      tempErrors.childDob = 'Date of birth is required';
      isValid = false;
    }

    if (!childData.childGender) {
      tempErrors.childGender = 'Gender is required';
      isValid = false;
    }

    if (!childData.childYear) {
      tempErrors.childYear = 'Year group is required';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChildData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSubmit(childData);
  };

  // Modify the onClose handler to wrap the original onClose
  const handleClose = () => {
    setErrors({
      childName: '',
      childDob: '',
      childGender: '',
      childYear: ''
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} // Change this from onClose to handleClose
      fullWidth 
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
        }
      }}
    >
      <DialogTitle sx={{ color: 'primary.main', fontWeight: 600 }}>
        {editMode ? 'Edit Child' : 'Add New Child'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            name="childName"
            label="Child Name"
            value={childData.childName}
            onChange={handleChange}
            error={!!errors.childName}
            helperText={errors.childName}
            fullWidth
            margin="dense"
          />
          <TextField
            name="childDob"
            label="Child DOB"
            type="date"
            value={childData.childDob}
            onChange={handleChange}
            error={!!errors.childDob}
            helperText={errors.childDob}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            name="childGender"
            label="Child Gender"
            value={childData.childGender}
            onChange={handleChange}
            error={!!errors.childGender}
            helperText={errors.childGender}
            fullWidth
            margin="dense"
          >
            {['Boy', 'Girl', 'Other'].map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            name="childYear"
            label="Year Group"
            value={childData.childYear}
            onChange={handleChange}
            error={!!errors.childYear}
            helperText={errors.childYear}
            fullWidth
            margin="dense"
          >
            {['Year 4', 'Year 5', 'Other'].map((opt) => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, display: 'flex', gap: 1 }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            color: 'white', 
            backgroundColor: 'error.main',
            '&:hover': { backgroundColor: 'error.dark' },
            flex: 1,
            py: 1,
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          sx={{ 
            color: 'white', 
            backgroundColor: 'success.main',
            '&:hover': { backgroundColor: 'success.dark' },
            flex: 1,
            py: 1,
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          {editMode ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChildDialog;
