import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  Divider, 
  useTheme, 
  IconButton, 
  Tooltip, 
  Fade,
  Chip,
  useMediaQuery,
  CardActionArea
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { 
  MdDashboard, 
  MdPayment, 
  MdSchool, 
  MdQuiz,
  MdShoppingCart,
  MdDateRange,
  MdAnalytics, 
  MdPerson,
  MdFamilyRestroom,
  MdAssessment,
  MdCategory,
  MdOutlineReceiptLong,
  MdArrowForward,
  MdArrowRight,
  MdHelpOutline
} from "react-icons/md";

export const AdminQuickLinks = () => {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  // Dashboard categories with enhanced metadata
  const categories = [
    {
      title: "Course Management",
      subtitle: "Manage courses and mock tests",
      icon: <MdSchool size={isMobile ? 28 : 36} color={theme.palette.primary.main} />,
      items: [
        { title: "All Courses", link: "/dashboard/addCourse", count: 24 },
        { title: "Mock Tests", link: "/dashboard/addMockTest", count: 16 },
        { title: "User Course Access", link: "/dashboard/report/userCourseAccess", count: 16 }
      ],
      bgColor: theme.palette.primary.light,
      accentColor: theme.palette.primary.main,
      textColor: theme.palette.primary.contrastText
    },
    {
      title: "Purchases",
      subtitle: "Track all transaction activities",
      icon: <MdShoppingCart size={isMobile ? 28 : 36} color={theme.palette.success.main} />,
      items: [
        { title: "Purchased Mocks", link: "/dashboard/allBuyMock", count: 85 },
        { title: "Purchased Courses", link: "/dashboard/allBuyCourse", count: 124 },
        { title: "All Payments", link: "/dashboard/allPayment", count: 256 }
      ],
      bgColor: theme.palette.success.light,
      accentColor: theme.palette.success.main,
      textColor: theme.palette.success.contrastText
    },
    {
      title: "Reports",
      subtitle: "View detailed analytics reports",
      icon: <MdAnalytics size={isMobile ? 28 : 36} color={theme.palette.warning.main} />,
      items: [
        { title: "Mock Batch Report", link: "/dashboard/report/mockBatchReport", count: 12 },
        { title: "Course Batch Report", link: "/dashboard/report/courseBatchReport", count: 18,isNew: true },
        { title: "Course Date Report", link: "/dashboard/report/courseDateReport", count: 9,isNew: true },
        { title: "Parent Course Report", link: "/dashboard/report/parentCourseReport", count: 7 }
      ],
      bgColor: theme.palette.warning.light,
      accentColor: theme.palette.warning.main,
      textColor: theme.palette.warning.contrastText
    },
    {
      title: "All Users",
      subtitle: "Analyze user engagement metrics",
      icon: <MdPerson size={isMobile ? 28 : 36} color={theme.palette.info.main} />,
      items: [
        { title: "All User", link: "/dashboard/report/userReport", count: 482, isNew: true},
        { title: "All Child", link: "/dashboard/report/childReport", count: 95,isNew: true },
        { title: "Each User Report", link: "/dashboard/report/eachUserReport", count: 482,isNew: true }
      ],
      bgColor: theme.palette.info.light,
      accentColor: theme.palette.info.main,
      textColor: theme.palette.info.contrastText
    },
    {
      title: "Super Coins",
      subtitle: "View detailed payment history",
      icon: <MdOutlineReceiptLong size={isMobile ? 28 : 36} color={theme.palette.error.main} />,
      items: [
        { title: "User Super Coins", link: "/dashboard/transaction/oneUserTransaction", count: 756, isNew: true }
      ],
      bgColor: theme.palette.error.light,
      accentColor: theme.palette.error.main,
      textColor: theme.palette.error.contrastText
    }
  ];

  const handleCardClick = (link) => {
    router.push(link);
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 },marginTop: "-50px" }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Box>
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ 
            fontWeight: 700, 
            color: theme.palette.text.primary,
            position: 'relative',
            display: 'inline-block',
            '&:after': {
              content: '""',
              position: 'absolute',
              width: '40%',
              height: '4px',
              bottom: '-8px',
              left: 0,
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px'
            }
          }}>
            Quick Links
          </Typography>

        </Box>
        <Tooltip title="Dashboard Help" arrow>
          <IconButton color="primary">
            <MdHelpOutline />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* Category Cards with enhanced visual feedback */}
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 5 }}>
        {categories.map((category, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card 
              sx={{ 
                p: 0, 
                borderRadius: 3,
                height: '100%',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': {
                  boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  transform: 'translateY(-4px)'
                }
              }}
              onMouseEnter={() => setHoveredCategory(index)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                p: 2,
                backgroundColor: category.bgColor,
                borderBottom: `1px solid ${theme.palette.divider}`
              }}>
                <Box sx={{
                  backgroundColor: 'white',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  mr: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  {category.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700,
                    color: 'white'
                  }}>
                    {category.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'white' }}>
                    {category.subtitle}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ p: 2, backgroundColor: 'white' }}>
                {category.items.map((item, idx) => (
                  <CardActionArea 
                    key={idx}
                    onClick={() => handleCardClick(item.link)}
                    sx={{
                      p: 1.5,
                      mb: idx === category.items.length - 1 ? 0 : 1.5,
                      borderRadius: 2,
                      backgroundColor: hoveredCategory === index && idx === 0 ? 
                        `${category.accentColor}10` : 'transparent',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        backgroundColor: `${category.accentColor}20`,
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ 
                        fontWeight: 500,
                        color: theme.palette.text.primary
                      }}>
                        {item.title}
                      </Typography>
                      {item.isNew && (
                        <Chip 
                          label="NEW" 
                          size="small" 
                          color="primary" 
                          sx={{ ml: 1, height: 20, fontSize: '0.625rem' }} 
                        />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {(item.count && "don't show" == "show") && (
                        <Chip 
                          label={item.count} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: category.accentColor,
                            color: category.accentColor,
                            mr: 1,
                            height: 24,
                            fontWeight: 500
                          }} 
                        />
                      )}
                      <MdArrowRight 
                        size={20} 
                        color={category.accentColor}
                        style={{ 
                          transition: 'transform 0.2s',
                          transform: hoveredCategory === index ? 'translateX(3px)' : 'none'
                        }}
                      />
                    </Box>
                  </CardActionArea>
                ))}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};