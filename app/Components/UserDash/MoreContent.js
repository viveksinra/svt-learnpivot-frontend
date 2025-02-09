// MoreContent.js
import React from 'react';
import { Grid, Card, Box, Chip, Typography, Button, Stack } from '@mui/material';
import { AssignmentOutlined, ArrowForwardIos } from '@mui/icons-material';

const ContentCard = ({ item, type, getSubjectColor }) => (
  <Card sx={{ 
    p: 3,
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 25px rgba(0,0,0,0.1)'
    }
  }}>
    <Box>
      <Chip 
        label={item.subject}
        size="small"
        sx={{ 
          mb: 2,
          bgcolor: `${getSubjectColor(item.subject)}15`,
          color: getSubjectColor(item.subject),
          fontWeight: 500
        }}
      />
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>{item.title}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography color="text.secondary">
          {type === 'class' ? item.duration : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentOutlined sx={{ fontSize: 18 }} />
              {item.questions} Questions
            </Box>
          )}
        </Typography>
        <Typography color="primary" variant="h6" sx={{ fontWeight: 600 }}>{item.price}</Typography>
      </Box>
      {type === 'class' ? (
        <Button
          variant="outlined"
          endIcon={<ArrowForwardIos />}
          fullWidth
          sx={{
            borderColor: getSubjectColor(item.subject),
            color: getSubjectColor(item.subject),
            '&:hover': {
              borderColor: getSubjectColor(item.subject),
              bgcolor: `${getSubjectColor(item.subject)}10`
            }
          }}
        >
          View Details
        </Button>
      ) : (
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIos />}
            fullWidth
            sx={{
              bgcolor: getSubjectColor(item.subject),
              '&:hover': {
                bgcolor: getSubjectColor(item.subject),
                opacity: 0.9
              }
            }}
          >
            Start Test
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              borderColor: getSubjectColor(item.subject),
              color: getSubjectColor(item.subject),
              '&:hover': {
                borderColor: getSubjectColor(item.subject),
                bgcolor: `${getSubjectColor(item.subject)}10`
              }
            }}
          >
            View Details
          </Button>
        </Stack>
      )}
    </Box>
  </Card>
);

export const MoreContent = ({ classes, tests, getSubjectColor }) => (
  <>
    <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>More Courses</Typography>
    <Grid container spacing={3} sx={{ mb: 5 }}>
      {classes.map((class_) => (
        <Grid item xs={12} md={6} lg={4} key={class_.id}>
          <ContentCard item={class_} type="class" getSubjectColor={getSubjectColor} />
        </Grid>
      ))}
    </Grid>

    <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>More Mock Tests</Typography>
    <Grid container spacing={3} sx={{ mb: 5 }}>
      {tests.map((test) => (
        <Grid item xs={12} md={6} lg={4} key={test.id}>
          <ContentCard item={test} type="test" getSubjectColor={getSubjectColor} />
        </Grid>
      ))}
    </Grid>
  </>
);
