// MockPayButton.js
import React from 'react';
import { mockTestService } from '@/app/services';
import AnimatedButton from '../../Common/AnimatedButton';

const MockPayButton = ({
  data,
  setSubmitted,
  setSubmittedId,
  setTotalAmount,
  totalAmount,
  selectedBatch,
  selectedChild
}) => {
  const handleCoEnquiry = async () => {
    if (totalAmount === 0) return;

    setSubmitted(true);



  };

  const buttonText = totalAmount === 0 
    ? "Please select at least one item" 
    : `Proceed to Pay ${totalAmount ? `Amount: £ ${totalAmount.toFixed(2)}` : ''}`;

  return (
    <AnimatedButton 
      variant="contained" 
      onClick={handleCoEnquiry}
      disabled={totalAmount === 0}
    >
      {buttonText}
    </AnimatedButton>
  );
};

export default MockPayButton;