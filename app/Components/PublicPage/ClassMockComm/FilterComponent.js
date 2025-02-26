import { Checkbox, FormControlLabel, FormGroup, Box, Typography, IconButton, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { useState } from 'react';

const FilterComponent = ({ filterData, selectedFilter, setSelectedFilter }) => {
  const hasSelectedFilters = selectedFilter.some(filter => filter.ids.length > 0);

  const handleClearFilters = () => {
    setSelectedFilter(prevState => 
      prevState.map(filter => ({
        ...filter,
        ids: []
      }))
    );
  };

  const handleCheckboxChange = (link, id) => {
    setSelectedFilter(prevState => {
      return prevState.map(filter => {
        if (filter.link === link) {
          const isChecked = filter.ids.includes(id);
          return {
            ...filter,
            ids: isChecked 
              ? filter.ids.filter(item => item !== id) 
              : [...filter.ids, id]
          };
        }
        return filter;
      });
    });
  };

  const isChecked = (link, id) => {
    const filter = selectedFilter.find(filter => filter.link === link);
    return filter ? filter.ids.includes(id) : false;
  };

  return (
    <Box sx={{ 
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      {hasSelectedFilters && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleClearFilters}
          sx={{
            color: '#082952',
            textTransform: 'none',
            mb: 2,
            '&:hover': {
              backgroundColor: 'rgba(8, 41, 82, 0.04)',
            }
          }}
        >
          Clear Filters
        </Button>
      )}
      
      {filterData && filterData.map((e, j) => (
        <Box 
          key={j} 
          sx={{ 
            mb: 3,
            '&:last-child': { mb: 0 }
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#082952",
              fontFamily: "Adequate, Helvetica Neue, Helvetica, sans-serif",
              fontSize: '1rem',
              fontWeight: 600,
              mb: 1.5,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: '-4px',
                left: 0,
                width: '40px',
                height: '2px',
                backgroundColor: '#082952'
              }
            }}
          >
            {e.title}
          </Typography>
          <FormGroup>
            {e?.tags?.map((i, k) => (
              <FormControlLabel
                key={k}
                control={
                  <Checkbox
                    name={i.id}
                    checked={isChecked(e.link, i.id)}
                    onChange={() => handleCheckboxChange(e.link, i.id)}
                    sx={{
                      color: '#6b7280',
                      '&.Mui-checked': {
                        color: '#082952',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(8, 41, 82, 0.04)',
                      }
                    }}
                  />
                }
                label={
                  <Typography 
                    sx={{ 
                      color: "#082952",
                      fontSize: '0.9rem',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: '#1a4b8f'
                      }
                    }}
                  >
                    {i.label}
                  </Typography>
                }
                sx={{
                  marginY: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(8, 41, 82, 0.02)',
                  }
                }}
              />
            ))}
          </FormGroup>
        </Box>
      ))}
    </Box>
  );
};

export default FilterComponent;
