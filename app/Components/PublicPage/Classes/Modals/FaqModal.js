import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import FaqCom from "../../../ITStartup/Faq/FaqCom";

const FaqModal = ({ open, onClose }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        backgroundColor: '#F3F4F6',
        color: '#1F2937',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        Course FAQs
        <CloseIcon 
          onClick={onClose} 
          sx={{ cursor: 'pointer', color: '#1F2937' }} 
        />
      </DialogTitle>
      <DialogContent>
        <div style={{ marginTop: '16px' }}>
          <FaqCom dataType="courseFaqData" />
        </div>
      </DialogContent>
      <DialogActions sx={{ padding: '16px' }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'white', 
            backgroundColor: 'red', 
            '&:hover': { backgroundColor: 'darkred' } 
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FaqModal;
