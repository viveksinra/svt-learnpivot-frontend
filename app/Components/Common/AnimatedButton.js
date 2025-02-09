import React from 'react';
import Button from '@mui/material/Button';
import { styled, keyframes } from '@mui/system';
import { useMediaQuery, useTheme } from '@mui/material';

const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(123, 31, 162, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(123, 31, 162, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(123, 31, 162, 0);
  }
`;

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})(({ theme, isMobile, disabled }) => ({
  background: disabled
    ? 'linear-gradient(45deg, rgb(194, 0, 0) 30%, rgb(126, 0, 0) 90%)'
    : 'linear-gradient(45deg, #0D47A1 30%, #7B1FA2 90%)',
  border: 0,
  borderRadius: 3,
  minHeight: 58,
  fontSize: isMobile ? '1rem' : '1.25rem',
  padding: '0 30px',
  animation: disabled ? 'none' : `${pulse} 2s infinite`,
  opacity: disabled ? 0.6 : 1,
  color: 'white !important',
  '&:hover': {
    background: disabled
      ? 'linear-gradient(45deg, #9E9E9E 30%, #757575 90%)'
      : 'linear-gradient(45deg, #0D47A1 30%, #7B1FA2 90%)',
  },
}));

const AnimatedButton = ({ children, disabled, ...props }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <StyledButton
      {...props}
      isMobile={isMobile}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

export default AnimatedButton;
