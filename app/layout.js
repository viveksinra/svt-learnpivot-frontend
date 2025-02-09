// layout.js

import React from 'react';
import LayoutWrapper from './LayoutWrapper'; 

import "../styles/bootstrap.min.css";

import "swiper/css/bundle";

// Global CSS
import "../styles/style.css";
import "../styles/responsive.css";

import  './globals.css';

export const metadata = {
  title: 'Chelmsford 11 Plus - Preparing for Success in the 11 Plus Exam',
  description: 'Help your child excel in the 11 Plus exam with expertly designed courses and mock tests tailored for Year 5-6 students. Book sessions now and prepare them for a brighter future. For more details, reach us at info@chelmsford11plus.com.',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper> 
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}