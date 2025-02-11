// components/ChildrenList/ChildrenList.js
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Box, 
  Avatar 
} from '@mui/material';
import { School, Cake } from '@mui/icons-material';
import moment from 'moment';

const ChildCard = ({ child }) => (
  <Card 
    elevation={0}
    sx={{ 
      mb: 2,
      borderRadius: 3,
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: (theme) => theme.shadows[4],
        borderColor: 'primary.main',
      }
    }}
  >
    <CardContent>
      <Stack direction="row" spacing={3} alignItems="center">
        <Avatar 
          sx={{ 
            width: 56,
            height: 56,
            bgcolor: 'primary.main',
            fontSize: '1.5rem',
            fontWeight: 'bold'
          }}
        >
          {child.childName.charAt(0)}
        </Avatar>
        <Box flex={1}>
          <Typography 
            variant="h6" 
            sx={{ mb: 1, fontWeight: 600 }}
          >
            {child.childName}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'primary.lighter',
                color: 'primary.main',
                py: 0.5,
                px: 1.5,
                borderRadius: 2,
                fontSize: '0.875rem',
              }}
            >
              <School fontSize="small" />
              {child.childYear}
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: 'grey.100',
                color: 'grey.700',
                py: 0.5,
                px: 1.5,
                borderRadius: 2,
                fontSize: '0.875rem',
              }}
            >
              <Cake fontSize="small" />
              {moment(child.childDob).format('DD MMM YYYY')}
            </Box>
            <Box
              sx={{
                bgcolor: 'grey.100',
                color: 'grey.700',
                py: 0.5,
                px: 1.5,
                borderRadius: 2,
                fontSize: '0.875rem',
              }}
            >
              {child.childGender}
            </Box>
          </Stack>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const ChildrenList = ({ children }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 4,
        border: '1px solid',
        borderColor: 'divider',
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            mb: 3
          }}
        >
          Children
        </Typography>
        
        {children.length > 0 ? (
          children.map((child) => (
            <ChildCard key={child._id} child={child} />
          ))
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center',
              py: 8
            }}
          >
            <Typography 
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              No children registered
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ChildrenList;