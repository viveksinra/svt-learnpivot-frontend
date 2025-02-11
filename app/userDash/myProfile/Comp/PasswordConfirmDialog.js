import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Button, Typography
} from '@mui/material';

const PasswordConfirmDialog = ({ open, onConfirm, onCancel }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    onConfirm(password);
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    setPassword('');
    setError('');
    onCancel();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Password</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Please enter your password to confirm.
        </Typography>
        <TextField
          autoFocus
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordConfirmDialog;
