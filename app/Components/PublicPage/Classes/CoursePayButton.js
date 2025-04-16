import React from 'react';
import { myCourseService } from '@/app/services';
import AnimatedButton from '../../Common/AnimatedButton';

const CoursePayButton = ({ 
  data, 
  setSubmitted, 
  setSubmittedId, 
  frontEndTotal, 
  setTotalAmount, 
  selectedDates, 
  selectedChild ,
  preserveSelections,
  setPreserveSelections
}) => {
  const handleCoEnquiry = async () => {
    if (!selectedDates || selectedDates.length === 0) return;

    const buyData = {
      courseId: data._id,
      selectedDates,
      selectedChild,
    };

    try {
      let response = await myCourseService.buyStepOne(buyData);

      if (response.variant === 'success') {
        setPreserveSelections(true);
        setSubmitted(true);
        setSubmittedId(response._id);
        setTotalAmount(response.totalAmount);
    

      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const buttonText = !selectedDates || selectedDates.length === 0
    ? "Please select a batch to continue"
    : `Proceed to Pay ${frontEndTotal ? `Amount: £ ${frontEndTotal}` : ''}`;

  return (
    <AnimatedButton 
      variant="contained" 
      onClick={handleCoEnquiry}
      disabled={!selectedDates || selectedDates.length === 0}
    >
      {buttonText}
    </AnimatedButton>
  );
};

export default CoursePayButton;
