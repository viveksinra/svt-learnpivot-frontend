import { format } from 'date-fns';

export const formatDate = (dateString) => {
  try {
    if (!dateString) return 'N/A';
    
    // Check if the date string is valid
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return format(date, 'dd MM yyyy');
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};

export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};
