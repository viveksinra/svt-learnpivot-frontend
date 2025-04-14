"use client";
import React, { useState } from 'react';
import {
  Box, 
  Typography, 
  Tabs, 
  Tab,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SchoolIcon from '@mui/icons-material/School';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CourseAccessCom from './AccessCom/CourseAccessCom';
import MockAccessCom from './AccessCom/MockAccessCom';
import Link from 'next/link';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1)
}));

const ContentSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(3),
  borderRadius: '12px',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}));

const BuyButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  textTransform: 'none',
}));

const OneAccessCom = ({ reportData, selectedChild, selectedChildName, profileType }) => {
  const [accessTab, setAccessTab] = useState(0);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // Convert 24-hour format to 12-hour format with AM/PM
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    
    return `${hour12}:${minutes} ${ampm}`;
  };

  // New function to compare course access vs purchased
  const getCourseAccessComparison = () => {
    if (!reportData || !reportData.courseAccess || !reportData.courseAccessBought) {
      return { available: [], purchased: [], notPurchased: [] };
    }

    // All courses available to the user
    const allCourseAccess = reportData.courseAccess.map(course => ({
      ...course,
      isPurchased: false
    }));
    
    // Courses purchased for the selected child
    const purchasedCourses = [];
    
    // Find purchased courses for the selected child
    reportData.courseAccessBought.forEach(course => {
      const childData = course.children?.find(child => child.childId === selectedChild);
      if (childData) {
        purchasedCourses.push({
          ...course,
          isPurchased: true,
          purchaseInfo: childData
        });
      }
    });
    
    // Find courses that are available but not purchased
    const notPurchasedCourses = allCourseAccess.filter(course => 
      !purchasedCourses.some(purchased => purchased._id === course._id)
    );
    
    return {
      available: allCourseAccess,
      purchased: purchasedCourses,
      notPurchased: notPurchasedCourses
    };
  };
  
  // New function to compare mocktest access vs purchased
  const getMockTestAccessComparison = () => {
    if (!reportData || !reportData.mocktestAccess) {
      return { available: [], purchased: [], notPurchased: [] };
    }

    // Create a map of all available mock tests with their batches
    const allMockTestsMap = reportData.mocktestAccess.reduce((acc, test) => {
      acc[test._id] = {
        ...test,
        isPurchased: false,
        purchasedBatches: []
      };
      return acc;
    }, {});
    
    // Find purchased mock test batches for the selected child
    const purchasedTests = [];
    
    if (reportData.mocktestAccessBought) {
      reportData.mocktestAccessBought.forEach(test => {
        const testWithPurchasedBatches = {
          ...test,
          isPurchased: false,
          purchasedBatches: []
        };

        // Check each batch if it's purchased for the selected child
        test.batch?.forEach(batch => {
          const childPurchase = batch.children?.find(child => child.childId === selectedChild);
          if (childPurchase) {
            testWithPurchasedBatches.isPurchased = true;
            testWithPurchasedBatches.purchasedBatches.push({
              ...batch,
              purchaseInfo: childPurchase
            });
          }
        });

        if (testWithPurchasedBatches.isPurchased) {
          purchasedTests.push(testWithPurchasedBatches);
          
          // Update the all tests map to mark this test as purchased
          if (allMockTestsMap[test._id]) {
            allMockTestsMap[test._id].isPurchased = true;
            allMockTestsMap[test._id].purchasedBatches = testWithPurchasedBatches.purchasedBatches;
            
            // Make sure we also copy the batch data with children information
            if (allMockTestsMap[test._id].batch) {
              // Replace the batch array with the one from the access bought data
              // which includes the children information
              allMockTestsMap[test._id].batch = test.batch;
            }
          }
        }
      });
    }
    
    // Convert the map back to an array
    const allMockTestAccess = Object.values(allMockTestsMap);
    
    // Find mock tests that are available but not purchased for this child
    const notPurchasedTests = allMockTestAccess.filter(test => !test.isPurchased);
    
    return {
      available: allMockTestAccess,
      purchased: purchasedTests,
      notPurchased: notPurchasedTests
    };
  };

  const courseComparison = getCourseAccessComparison();
  const mockTestComparison = getMockTestAccessComparison();

  const handleGiveAccess = (type) => {
    console.log(`Give ${type} access clicked`);
    // Logic to handle giving access would go here
  };

  // Get the title based on profileType and tab
  const getAccessTitle = () => {
    if (profileType === 'user') {
      if (accessTab === 0) {
        return `${courseComparison.notPurchased.length} Available Courses`;
      } else {
        return `${mockTestComparison.notPurchased.length} Available Mock Tests`;
      }
    } else {
      // Default title for admin or other profiles
      if (accessTab === 0) {
        return 'Access Comparison';
      } else {
        return 'Access Comparison';
      }
    }
  };

  // Determine which data to pass based on profileType
  const getFilteredCourseData = () => {
    if (profileType === 'user') {
      // For user profile, only show unpurchased items
      return {
        ...courseComparison,
        // Override available to only show unpurchased for display
        available: courseComparison.notPurchased
      };
    }
    return courseComparison;
  };

  const getFilteredMockTestData = () => {
    if (profileType === 'user') {
      // For user profile, only show unpurchased items
      return {
        ...mockTestComparison,
        // Override available to only show unpurchased for display
        available: mockTestComparison.notPurchased
      };
    }
    return mockTestComparison;
  };

  return (
    <ContentSection sx={{ mb: 4 }}>
      <SectionTitle variant="h6">
        {profileType === 'user' ? (
          <ShoppingCartIcon color="primary" />
        ) : (
          <CompareArrowsIcon color="primary" />
        )}
        {getAccessTitle()}
      </SectionTitle>
      
      <Tabs
        value={accessTab}
        onChange={(e, newValue) => setAccessTab(newValue)}
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab label="Courses" icon={<SchoolIcon />} iconPosition="start" />
        <Tab label="Mock Tests" icon={<FactCheckIcon />} iconPosition="start" />
      </Tabs>
      
      {accessTab === 0 ? (
        <CourseAccessCom 
          courseComparison={getFilteredCourseData()}
          selectedChildName={selectedChildName}
          formatTime={formatTime}
          handleGiveAccess={handleGiveAccess}
          profileType={profileType}
          showBuyButton={profileType === 'user'}
        />
      ) : (
        <MockAccessCom 
          mockTestComparison={getFilteredMockTestData()}
          formatDate={formatDate}
          formatTime={formatTime}
          handleGiveAccess={handleGiveAccess}
          profileType={profileType}
          showBuyButton={profileType === 'user'}
        />
      )}
    </ContentSection>
  );
};

export default OneAccessCom;
