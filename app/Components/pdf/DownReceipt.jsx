import React, { useState, useEffect } from 'react';
import { Box, Button } from '@mui/material';
import { PDFDocument } from 'pdf-lib';
import download from 'downloadjs';
import { reportService } from '@/app/services';
import { add } from 'date-fns';

const DownReceipt = ({
  data
}) => {
  console.log({data});
  // const [payData, setPosData] = useState({});
  // Fetch Payment data when the component mounts


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
    try {
      let payData = {}
      const response = await reportService.getOnePaymentReceiptData(data);
console.log(response);
if (response.variant === 'success') {
   payData = response.data;
} else {
  alert('Failed to fetch Payment data');
  return;
}
      // i want date in dd/mm/yyyy format
      const finalReceiptDate = formatMyDate(payData?.date);

      const productName = payData?.mockTestId?.mockTestTitle + " for " + payData?.childId?.childName || payData?.courseId?.courseTitle + " for " + payData?.childId?.childName || 'N/A';


      // Load the existing PDF from local path
      const url = '/pdf/receipt.pdf';
      const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

      // Load a PDFDocument from the existing PDF bytes
      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      // Get the form containing the fields in the PDF
      const form = pdfDoc.getForm();

      // Get individual fields using their names
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

      // Fill in the fields with the fetched data
      receiptDate.setText(finalReceiptDate);
      toName.setText(`${payData?.user?.firstName}  ${payData?.user?.lastName}`);
      receipt.setText(payData?.invoiceNumber || 'N/A');
      product.setText(productName);
      totalAmount.setText(formatAmount(payData?.amount) || 'N/A');
      amount.setText(formatAmount(payData?.amount) || 'N/A');

      // Flatten the form to make the fields non-editable
      form.flatten();

      // Serialize the PDFDocument to bytes (which can be downloaded)
      const pdfBytes = await pdfDoc.save();

      // Download the PDF with filled data
      await download(pdfBytes, 'chelmsford11plus-invoice.pdf', 'application/pdf');
    } catch (error) {
      console.log(error);
      alert('Failed to generate the certificate');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        marginTop: '10px',
      }}
    >
      <Button
        variant="contained"
        style={{ backgroundColor: '#18B5AC' }}
        onClick={() => downloadAgreement(data)} // Pass the data parameter here
      >
        View Receipt
      </Button>
    </Box>
  );
};

export default DownReceipt;
