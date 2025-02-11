import React, { useEffect, useState } from 'react';
import { 
  Card, Box, Chip, Typography, Stack, Button, 
  Skeleton, Container, useTheme, useMediaQuery, Grid
} from '@mui/material';
import { 
  PersonOutline, CalendarToday, AccessTimeOutlined, 
  LocationOn, School, QuizOutlined 
} from '@mui/icons-material';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { reportService } from '@/app/services';

const LoadingSkeleton = () => {
  const theme = useTheme();
  
  return (
    <Grid container spacing={2}>
      {[1, 2, 3].map((item) => (
        <Grid item key={item} xs={12} sm={6} md={4}>
          <Card sx={{ p: 2, borderRadius: 2, height: '100%' }}>
            <Stack spacing={1.5}>
              <Skeleton variant="rounded" width={72} height={24} />
              <Skeleton variant="text" width="80%" sx={{ fontSize: '1.25rem' }} />
              <Skeleton variant="text" width="60%" sx={{ fontSize: '0.875rem' }} />
              <Stack spacing={1}>
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rounded" height={32} />
                ))}
              </Stack>
            </Stack>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

const EmptyState = ({ type, onButtonClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isClass = type === 'class';
  
  return (
    <Card sx={{ 
      p: 2,
      textAlign: 'center',
      borderRadius: 2,
      bgcolor: 'background.paper',
      boxShadow: theme.shadows[1]
    }}>
      <Box sx={{ p: 2 }}>
        {isClass ? (
          <School sx={{ 
            fontSize: isMobile ? 40 : 48, 
            color: 'primary.main', 
            mb: 1.5 
          }} />
        ) : (
          <QuizOutlined sx={{ 
            fontSize: isMobile ? 40 : 48, 
            color: 'secondary.main', 
            mb: 1.5 
          }} />
        )}
        <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
          No Upcoming {isClass ? 'Courses' : 'Mock Tests'}
        </Typography>
        <Button
          variant="contained"
          color={isClass ? "primary" : "secondary"}
          onClick={() => onButtonClick(isClass ? '/course' : '/mockTest')}
          size="small"
          sx={{ 
            borderRadius: 1.5,
            textTransform: 'none',
            px: 3
          }}
        >
          Browse {isClass ? 'Courses' : 'Tests'}
        </Button>
      </Box>
    </Card>
  );
};

const EventCard = ({ item }) => {
  const theme = useTheme();
  const isClass = item.type === 'class';
  
  return (
    <Card sx={{ 
      p: 2,
      height: '100%',
      borderRadius: 2,
      position: 'relative',
      overflow: 'visible',
      boxShadow: theme.shadows[1],
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        bgcolor: isClass ? 'primary.main' : 'secondary.main',
        borderRadius: '8px 8px 0 0'
      },
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: theme.shadows[4]
      }
    }}>
      <Stack spacing={1.5}>
        <Box>
          <Chip 
            label={isClass ? "Class" : "Mock Test"}
            size="small"
            sx={{ 
              bgcolor: isClass ? 'primary.lighter' : 'secondary.lighter',
              color: isClass ? 'primary.dark' : 'secondary.dark',
              fontWeight: 600,
              mb: 1,
              fontSize: '0.75rem'
            }}
          />
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 700, 
              mb: 0.5,
              lineHeight: 1.3,
              fontSize: '1rem'
            }}
          >
            {isClass ? item.courseTitle : item.testTitle}
          </Typography>
        </Box>

        <Stack direction="row" alignItems="center" spacing={1}>
          <PersonOutline sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {item.studentName} ({item.studentYear})
          </Typography>
        </Stack>

        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">
              {moment(item.date).format('ddd, MMM DD')}
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccessTimeOutlined sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption">
              {item.startTime} - {item.endTime}
            </Typography>
          </Stack>

          {!isClass && item.location && (
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption">
                {item.location}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Card>
  );
};

const EventList = ({ items, type, currentPage, onShowMore }) => {
  const theme = useTheme();
  const itemsToShow = items.slice(0, currentPage * 3);
  const hasMore = items.length > itemsToShow.length;

  return (
    <Box>
      <Grid container spacing={2}>
        {itemsToShow.map((item) => (
          <Grid item key={item.bookingId} xs={12} sm={6} md={4}>
            <EventCard item={{ ...item, type }} />
          </Grid>
        ))}
      </Grid>
      
      {hasMore && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onShowMore}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 4,
              '&:hover': {
                bgcolor: 'primary.lighter'
              }
            }}
          >
            Show More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export const UpcomingEvents = ({ selectedChild }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState({ classes: [], mockTests: [] });
  const [classPage, setClassPage] = useState(1);
  const [mockPage, setMockPage] = useState(1);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await reportService.getUpcomingEvent({ childId: selectedChild });
        
        if (response?.myData?.upcomingBookings) {
          setEvents(response.myData.upcomingBookings);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Failed to load events. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedChild]);

  const handleNavigate = (path) => {
    router.push(path);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: isMobile ? 2 : 3, px: isMobile ? 1 : 2 }}>
        <Typography variant="h6" sx={{ 
          mb: 2, 
          fontWeight: 700,
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}>
          Upcoming Mock Tests
        </Typography>
        <LoadingSkeleton />
        <Typography variant="h6" sx={{ 
          mt: 4,
          mb: 2, 
          fontWeight: 700,
          fontSize: isMobile ? '1.25rem' : '1.5rem'
        }}>
          Upcoming Courses
        </Typography>
        <LoadingSkeleton />
      </Container>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        textAlign: 'center', 
        p: isMobile ? 2 : 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        mx: 2,
        my: 3
      }}>
        <Typography 
          color="error" 
          variant="body2"
          gutterBottom
          sx={{ mb: 2 }}
        >
          {error}
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          onClick={() => setError(null)}
          sx={{ borderRadius: 1.5 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: isMobile ? 2 : 3,
        px: isMobile ? 1 : 2
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 700,
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}
        >
          Upcoming Mock Tests
        </Typography>
        {events.mockTests.length > 0 ? (
          <EventList 
            items={events.mockTests}
            type="mock"
            currentPage={mockPage}
            onShowMore={() => setMockPage(p => p + 1)}
          />
        ) : (
          <EmptyState type="mock" onButtonClick={handleNavigate} />
        )}
      </Box>

      <Box>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2,
            fontWeight: 700,
            fontSize: isMobile ? '1.25rem' : '1.5rem'
          }}
        >
          Upcoming Courses
        </Typography>
        {events.classes.length > 0 ? (
          <EventList 
            items={events.classes}
            type="class"
            currentPage={classPage}
            onShowMore={() => setClassPage(p => p + 1)}
          />
        ) : (
          <EmptyState type="class" onButtonClick={handleNavigate} />
        )}
      </Box>
    </Container>
  );
};

export default UpcomingEvents;