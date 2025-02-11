import React, { useState, useEffect } from 'react';
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editMode && initialData) {
      setChildData({
        childName: initialData.childName || '',
        childDob: initialData.childDob || '',
        childGender: initialData.childGender || '',
        childYear: initialData.childYear || ''
      });
    } else {
      setChildData({ childName: '', childDob: '', childGender: '', childYear: '' });
    }
  }, [editMode, initialData]);

  const validateForm = () => {
    // ...existing code for validations...
    return true; // or false if invalid
  };

  const handleChange = (e) => {
    setChildData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSubmit(childData);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{editMode ? 'Edit Child' : 'Add Child'}</DialogTitle>
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
      <DialogActions>
        <Button onClick={onClose} color="error">Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {editMode ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChildDialog;
