// LayoutWrapper.js
'use client';
import React from 'react';
import { MainProvider } from "./Components/Context/MainContext";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { blue, deepPurple, purple } from '@mui/material/colors'; // Change the primary color to blue

const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#1a237e',
    },
    secondary: deepPurple,
 
    mode: "light",
  },
});

export default function LayoutWrapper({ children }) {
  return (
    <MainProvider>
      <ThemeProvider theme={lightTheme}>
        {children}
      </ThemeProvider>
    </MainProvider>
  );
}
