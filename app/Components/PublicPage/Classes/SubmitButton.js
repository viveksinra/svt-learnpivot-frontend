import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import { styled, keyframes } from '@mui/system';
import { myCourseService } from '@/app/services';
import AnimatedButton from '../../Common/AnimatedButton';
import { Typography } from '@mui/material';
import MySnackbar from '../../MySnackbar/MySnackbar';

const ProceedToPayButton = ({ data, setSubmitted, setSubmittedId,frontEndTotal, setTotalAmount, totalAmount, selectedDates, selectedChild }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const snackRef = useRef();  
  const [isFirstRender, setIsFirstRender] = useState(true); // Track first render

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false); // Set first render flag to false after initial render
      return; // Skip the first render check
    }
    
    if (!selectedDates || selectedDates.length === 0) {
      setErrorMessage('Kindly choose a batch to continue.');
      snackRef.current.handleSnack({ message: 'Please Select Your batch', variant: 'info' });
    } else if (selectedDates.length >= 1) {
      setErrorMessage('');
    }
  }, [selectedDates, isFirstRender]);

  const handleCoEnquiry = async () => {
    if (!selectedDates || selectedDates.length === 0) {
      setErrorMessage('Please select a batch to proceed.');
      return;
    }

    const buyData = {
      courseId: data._id,
      selectedDates,
      selectedChild,
    };

    try {
      let response = await myCourseService.buyStepOne(buyData);

      if (response.variant === 'success') {
        setSubmitted(true);
        setSubmittedId(response._id);
        setTotalAmount(response.totalAmount);
        setErrorMessage(''); // Clear the error message if the request is successful
      } else {
        snackRef.current.handleSnack({ message: response.message, variant: response.variant });
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setErrorMessage('Failed to submit data.');
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <AnimatedButton variant="contained" onClick={handleCoEnquiry}>
        Proceed to Pay {frontEndTotal && `Amount: £ ${frontEndTotal}`}
      </AnimatedButton>
      {errorMessage && (
        <Typography color="red" variant="body2" style={{ marginTop: '8px' }}>
          {errorMessage}
        </Typography>
      )}
      <MySnackbar ref={snackRef} />
    </div>
  );
};

export default ProceedToPayButton;
