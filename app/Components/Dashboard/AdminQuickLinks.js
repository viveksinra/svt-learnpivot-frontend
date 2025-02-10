import React from 'react';
import { Grid, Card, Typography, Stack } from '@mui/material';
import { AssignmentOutlined, Book, CalendarToday, Payment, Class } from '@mui/icons-material'; // Added Payment and Class icons
import { useRouter } from 'next/navigation';
import { FcStatistics } from 'react-icons/fc';

const quickLinks = [
    {
        id: 1,
        title: 'Add/ Update Mock Tests',
        link: "/dashboard/addMockTest",
        icon: <AssignmentOutlined sx={{ fontSize: 40, color: 'primary.main' }} />
      },
    {
      id: 2,
      title: 'Add/ Update Courses',
      link: "/dashboard/addCourse",
      icon: <Class sx={{ fontSize: 40, color: 'primary.main' }} /> // Updated icon to Class
    },

    {
      id: 3,
      title: 'All Purchased Mock Test',
      link: "/dashboard/allBuyMock",
      icon: <AssignmentOutlined sx={{ fontSize: 40, color: 'success.main' }} />
    },
    {
      id: 4,
      title: 'All Purchased Courses',
      link: "dashboard/allBuyCourse",
      icon: <Class sx={{ fontSize: 40, color: 'success.main' }} /> // Updated icon to Class
    },
    {
      id: 5,
      title: 'All Payments Received',
      link: "/dashboard/allPayment",
      icon: <Payment sx={{ fontSize: 40, color: 'warning.main' }} /> // Updated icon to Payment
    },
    {
      id: 5,
      title: "Mock Batch Report",
      link: "/dashboard/report/mockBatchReport",
      icon: <CalendarToday sx={{ fontSize: 40, color: 'warning.main' }} /> // Updated icon to Payment
    }
  ];

export const AdminQuickLinks = () => {
  const router = useRouter();

  const handleCardClick = (link) => {
    router.push(link);
  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>Quick Links</Typography>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        {quickLinks.map((link) => (
          <Grid item xs={12} sm={6} md={3} key={link.id}>
            <Card
              onClick={() => handleCardClick(link.link)}
              sx={{
                p: 3,
                borderRadius: 3,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              <Stack alignItems="center" spacing={2}>
                {link.icon}
                <Typography variant="h6" align="center" sx={{ fontWeight: 600 }}>
                  {link.title}
                </Typography>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};