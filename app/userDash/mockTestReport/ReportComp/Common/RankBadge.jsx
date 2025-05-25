import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import { MilitaryTech } from '@mui/icons-material';

const RankBadge = ({ rank, label, size = "small" }) => {
  const badgeColors = {
    1: { bg: '#4caf50', text: '#fff' },  // Green for 1st place
    2: { bg: '#2196f3', text: '#fff' },  // Blue for 2nd place
    3: { bg: '#9c27b0', text: '#fff' },  // Purple for 3rd place
    default: { bg: '#e0e0e0', text: '#555' }
  };

  const color = badgeColors[rank] || badgeColors.default;

  return (
    <Tooltip title={`${label}: ${rank}`}>
      <Chip
        icon={<MilitaryTech sx={{ color: color.text }} />}
        label={`${rank}`}
        size={size}
        sx={{
          backgroundColor: color.bg,
          color: color.text,
          fontWeight: 'bold',
          mr: 1,
          '& .MuiChip-icon': {
            color: 'inherit'
          }
        }}
      />
    </Tooltip>
  );
};

export default RankBadge; 