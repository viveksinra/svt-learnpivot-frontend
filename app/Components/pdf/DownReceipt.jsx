import React, { useState } from 'react';
import { Box, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { PDFDocument } from 'pdf-lib';
import download from 'downloadjs';
import { reportService } from '@/app/services';

const DownReceipt = ({ data }) => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatMyDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatAmount = (amount) => {
    return `£${parseFloat(amount).toFixed(2)}`;
  };

  const downloadAgreement = async (data) => {
    if (!data) {
      console.error('Data is not defined');
      return;
    }
    
    setLoading(true);
    setSnackbar({ open: true, message: 'Preparing receipt for download...', severity: 'info' });

    try {
      let payData = {};
      const response = await reportService.getOnePaymentReceiptData(data);
      
      if (response.variant === 'success') {
        payData = response.data;
      } else {
        setSnackbar({ open: true, message: 'Failed to fetch Payment data', severity: 'error' });
        return;
      }

      const finalReceiptDate = formatMyDate(payData?.date);
      const proName = payData?.mockTestId?.mockTestTitle ? payData?.mockTestId?.mockTestTitle : payData?.courseId?.courseTitle ? payData?.courseId?.courseTitle : "Purchase"

      const productName = proName + " for " + payData?.childId?.childName || payData?.courseId?.courseTitle + " for " + payData?.childId?.childName || 'N/A';

      const url = '/pdf/receipt.pdf';
      const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const form = pdfDoc.getForm();

      const toName = form.getTextField('toName');
      const receipt = form.getTextField('receipt');
      const receiptDate = form.getTextField('receiptDate');
      const product = form.getTextField('product');
      const amount = form.getTextField('amount');
      const totalAmount = form.getTextField('totalAmount');
      const add1 = form.getTextField('add1');
      const add2 = form.getTextField('add2');
      const add3 = form.getTextField('add3');
      const add4 = form.getTextField('add4');
      const add5 = form.getTextField('add5');

      add1.setText(payData?.user?.address1 || 'N/A');
      if (payData?.user?.address2) {
        add2.setText(payData?.user?.address2);
        if (payData?.user?.address3) {
          add3.setText(payData?.user?.address3);
          add4.setText(payData?.user?.city);
          add5.setText(payData?.user?.postcode);
        } else {
          add3.setText(payData?.user?.city);
          add4.setText(payData?.user?.postcode);
        }
      } else {
        add2.setText(payData?.user?.city);
        add3.setText(payData?.user?.postcode);
      }

      receiptDate.setText(finalReceiptDate);
      toName.setText(`${payData?.user?.firstName}  ${payData?.user?.lastName}`);
      receipt.setText(payData?.invoiceNumber || 'N/A');
      product.setText(productName);
      totalAmount.setText(formatAmount(payData?.amount) || 'N/A');
      amount.setText(formatAmount(payData?.amount) || 'N/A');

      form.flatten();

      const pdfBytes = await pdfDoc.save();

      await download(pdfBytes, 'chelmsford11plus-invoice.pdf', 'application/pdf');
      setSnackbar({ open: true, message: 'Receipt downloaded successfully!', severity: 'success' });
    } catch (error) {
      console.log(error);
      setSnackbar({ open: true, message: 'Failed to generate the receipt', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', marginTop: '10px' }}>
      <Button
        variant="contained"
        style={{ backgroundColor: '#18B5AC' }}
        onClick={() => downloadAgreement(data)}
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
      >
        {loading ? 'Downloading...' : 'Download Receipt'}
      </Button>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DownReceipt;
