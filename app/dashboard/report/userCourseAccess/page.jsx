"use client"
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Skeleton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import ParentWiseView from "./Comp/ParentWiseView";
import CourseWiseView from "./Comp/CourseWiseView";

// Wrapper component to handle search params
const UserCourseAccessContent = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Get view from URL params, default to 'view1'
  const viewParam = searchParams.get('view') || 'view1';
  const [selectedView, setSelectedView] = useState(viewParam);

  // Update selected view when URL params change
  useEffect(() => {
    const currentView = searchParams.get('view') || 'view1';
    setSelectedView(currentView);
  }, [searchParams]);

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setSelectedView(newView);
      
      // Update URL with new view parameter
      const params = new URLSearchParams(searchParams);
      params.set('view', newView);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const renderCurrentView = () => {
    switch (selectedView) {
      case 'view2':
        return <CourseWiseView />;
      case 'view1':
      default:
        return <ParentWiseView />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ py: { xs: 2, sm: 2.5, md: 3, lg: 4 } }}>
        {/* Header with View Toggle */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center',
          mb: { xs: 2, sm: 3, md: 4 },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            fontWeight="bold" 
            color="primary"
            sx={{ 
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' }
            }}
          >
            User Course Access Management
          </Typography>
          
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 0.5, sm: 0.75 },
              borderRadius: 2,
              backgroundColor: 'background.paper'
            }}
          >
            <ToggleButtonGroup
              value={selectedView}
              exclusive
              onChange={handleViewChange}
              aria-label="view selection"
              size={isMobile ? "small" : "medium"}
              sx={{
                '& .MuiToggleButton-root': {
                  px: { xs: 1.5, sm: 2, md: 3 },
                  py: { xs: 0.5, sm: 0.75, md: 1 },
                  fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                  fontWeight: 'medium',
                  borderRadius: 1.5,
                  border: 'none',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  },
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }
              }}
            >
              <ToggleButton value="view1" aria-label="view 1">
                Parent Wise View
              </ToggleButton>
              <ToggleButton value="view2" aria-label="view 2">
                Course Wise View
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
        </Box>

        {/* Current View Content */}
        <Box sx={{ minHeight: '400px' }}>
          {renderCurrentView()}
        </Box>
      </Box>
    </Container>
  );
};

// Loading component
const LoadingSkeleton = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ py: { xs: 2, sm: 2.5, md: 3, lg: 4 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between', 
          alignItems: isMobile ? 'flex-start' : 'center',
          mb: { xs: 2, sm: 3, md: 4 },
          gap: { xs: 2, sm: 0 }
        }}>
          <Skeleton 
            variant="text" 
            width={isMobile ? "100%" : 400} 
            height={isMobile ? 40 : 50}
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2.125rem' } }}
          />
          <Skeleton 
            variant="rectangular" 
            width={isMobile ? "100%" : 200} 
            height={isMobile ? 36 : 48}
            sx={{ borderRadius: 2 }}
          />
        </Box>
        
        <Box sx={{ space: 2 }}>
          <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2, mb: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={250} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>
    </Container>
  );
};

// Main page component with Suspense boundary
const UserCourseAccessPage = () => {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <UserCourseAccessContent />
    </Suspense>
  );
};

export default UserCourseAccessPage;