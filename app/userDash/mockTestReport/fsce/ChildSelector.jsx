"use client";
import React from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import { PersonOutline } from '@mui/icons-material';

const FsceChildSelector = ({ allChildren = [], selectedChild = '', onSelectChild }) => {
  if (!allChildren.length) return null;
  // if only one child skip selector (auto-selected in parent component)
  if (allChildren.length === 1) return null;

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
      <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}>
        Select Child
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1, sm: 2 } }}>
        {allChildren.map((child) => (
          <Button
            key={child._id}
            variant={selectedChild === child._id ? 'contained' : 'outlined'}
            onClick={() => onSelectChild(child._id)}
            startIcon={<PersonOutline />}
            size={['xs', 'sm'].includes(typeof window !== 'undefined' && window.innerWidth < 600) ? 'small' : 'medium'}
            sx={{ borderRadius: 2, py: { xs: 0.5, sm: 1 }, px: { xs: 1, sm: 2 }, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
          >
            {/* Prefer displayName fields if available */}
            {child.childName || `${child.firstName || ''} ${child.lastName || ''}`} - {child.childYear}
          </Button>
        ))}
      </Box>
    </Paper>
  );
};

export default FsceChildSelector; 