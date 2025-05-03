import React from 'react';
import { Box, Typography, ButtonGroup, Button, useTheme, useMediaQuery } from '@mui/material';
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from 'react-icons/md';

const CustomPagination = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalCount
}) => {
  const pageCount = Math.ceil(totalCount / pageSize);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setPage(0);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'flex-start' : 'center', 
      gap: 1,
      p: { xs: 1, sm: 1.5 },
      width: '100%',
      borderTop: '1px solid rgba(224, 224, 224, 1)'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        mb: isMobile ? 1 : 0,
        width: isMobile ? '100%' : 'auto',
        justifyContent: isMobile ? 'space-between' : 'flex-start'
      }}>
        <Typography variant="body2" sx={{ 
          mr: 1, 
          fontSize: isMobile ? '0.75rem' : '0.875rem' 
        }}>
          Rows per page:
        </Typography>
        <select
          value={pageSize}
          onChange={handleChangeRowsPerPage}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: isMobile ? '0.75rem' : '0.875rem'
          }}
        >
          {[10, 25, 50, 100, 1000].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        width: isMobile ? '100%' : 'auto',
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant="body2" sx={{ 
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          whiteSpace: 'nowrap'
        }}>
          {totalCount > 0 ? `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, totalCount)} of ${totalCount}` : `0 of ${totalCount}`}
        </Typography>
        
        <ButtonGroup variant="outlined" size={isMobile ? "small" : "medium"}>
          <Button
            onClick={() => setPage(0)}
            disabled={page === 0}
            sx={{ p: isMobile ? '4px 8px' : '6px 12px' }}
          >
            {isMobile ? <MdFirstPage /> : "First"}
          </Button>
          <Button
            onClick={() => setPage(Math.max(page - 1, 0))}
            disabled={page === 0}
            sx={{ p: isMobile ? '4px 8px' : '6px 12px' }}
          >
            {isMobile ? <MdNavigateBefore /> : "Previous"}
          </Button>
          <Button
            onClick={() => setPage(Math.min(page + 1, pageCount - 1))}
            disabled={page >= pageCount - 1}
            sx={{ p: isMobile ? '4px 8px' : '6px 12px' }}
          >
            {isMobile ? <MdNavigateNext /> : "Next"}
          </Button>
          <Button
            onClick={() => setPage(pageCount - 1)}
            disabled={page >= pageCount - 1}
            sx={{ p: isMobile ? '4px 8px' : '6px 12px' }}
          >
            {isMobile ? <MdLastPage /> : "Last"}
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};

export default CustomPagination; 