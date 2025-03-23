import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Stack,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { transactionService } from '@/app/services';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const successModalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const DepositOrWithdraw = ({ 
  open, 
  handleClose, 
  type, // 'deposit' or 'withdraw'
  user, 
  onSubmit 
}) => {
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  
  const handleSubmit = async () => {
    // Basic validation
    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (Number(amount) > 5000) {
      setError('Maximum limit for transaction is £5000');
      return;
    }
    
    if (!paymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = {
        userId: user?.type === 'parent' ? user._id : user?.parent?._id,
        childId: user?.type === 'child' ? user._id : null,
        amount: Number(amount),
        transactionType: type,
        paymentMethod,
        remark
      };

      await onSubmit(data);
      setSuccessMessage(type === 'deposit' ? 
        `£${amount} deposited successfully!` : 
        `£${amount} withdrawn successfully!`);
      setShowSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setAmount('');
    setRemark('');
    setPaymentMethod('');
    setError(null);
    setLoading(false);
    setShowSuccess(false);
  };
  
  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    resetForm();
    handleClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleModalClose}
        aria-labelledby="transaction-modal-title"
      >
        <Box sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography id="transaction-modal-title" variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center' }}>
              {type === 'deposit' ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <CurrencyPoundIcon color="success" />
                    <AddCircleIcon color="success" sx={{ ml: -0.5, fontSize: '1rem' }} />
                  </Box>
                  Deposit Coins
                </>
              ) : (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <CurrencyPoundIcon color="error" />
                    <RemoveCircleIcon color="error" sx={{ ml: -0.5, fontSize: '1rem' }} />
                  </Box>
                  Withdraw Coins
                </>
              )}
            </Typography>
            <IconButton onClick={handleModalClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}
          
          <Typography variant="body2" sx={{ mb: 3 }}>
            {type === 'deposit' ? 'Add coins to' : 'Withdraw coins from'} {user?.name || 'account'}
            {user?.type === 'child' && ' (Child)'}
          </Typography>
          
          <Stack spacing={3}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>£</Typography>,
              }}
            />
            
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={paymentMethod}
                label="Payment Method"
                onChange={(e) => setPaymentMethod(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="creditCard">Credit Card</MenuItem>
                <MenuItem value="debitCard">Debit Card</MenuItem>
                <MenuItem value="bankTransfer">Bank Transfer</MenuItem>
                <MenuItem value="check">Check</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Remark"
              multiline
              rows={3}
              fullWidth
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              disabled={loading}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button variant="outlined" onClick={handleModalClose} disabled={loading}>
                Cancel
              </Button>
              <Button 
                variant="contained" 
                color={type === 'deposit' ? 'success' : 'error'}
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Processing...' : (type === 'deposit' ? 'Deposit' : 'Withdraw')}
              </Button>
            </Box>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={showSuccess}
        onClose={handleSuccessClose}
        aria-labelledby="success-modal-title"
      >
        <Box sx={successModalStyle}>
          <Typography id="success-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Success!
          </Typography>
          <Typography sx={{ mb: 3 }}>
            {successMessage}
          </Typography>
          <Button variant="contained" onClick={handleSuccessClose}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DepositOrWithdraw;
