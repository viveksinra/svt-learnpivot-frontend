import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { keyframes } from '@mui/system';
import Image from 'next/image';

// Define a pulsating animation
const pulse = keyframes`
  0% {
    opacity: 0.6;
    transform: scale(0.98);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0.6;
    transform: scale(0.98);
  }
`;

// Define a rotating animation for the outer circle
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const FullPageLoadingTransparent = ({ message = "Loading..." }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(5px)'
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 200,
          height: 200,
        }}
      >
        {/* Outer rotating circle */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            animation: `${rotate} 3s linear infinite`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress 
            size={120} 
            thickness={1.5} 
            sx={{ 
              color: '#fc7658',
            }} 
          />
        </Box>

        {/* Secondary rotating circle */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            animation: `${rotate} 4s linear infinite reverse`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress 
            size={100} 
            thickness={1.5}
            sx={{ 
              color: '#1976d2',
            }} 
          />
        </Box>
        
        {/* Center logo or text placeholder */}
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: '50%',
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.1)',
            animation: `${pulse} 2s ease-in-out infinite`,
            zIndex: 1,
            overflow: 'hidden',
            padding: '10px'
          }}
        >
          {/* Replace with your actual logo */}
          <Image
            src="/images/MyImage/logo/logo-chems.png"
            alt="logo"
            width={75}
            height={75}
            style={{
              objectFit: 'contain'
            }}
            priority
          />
        </Box>
      </Box>
      
      <Typography 
        sx={{ 
          mt: 4, 
          fontWeight: 500,
          color: '#333',
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default FullPageLoadingTransparent;
