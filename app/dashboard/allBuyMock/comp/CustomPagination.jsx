import React from 'react';
import { Box, Typography, ButtonGroup, Button } from '@mui/material';

const CustomPagination = ({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalCount
}) => {
  const pageCount = Math.ceil(totalCount / pageSize);
  
  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setPage(0);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      padding: '8px',
      borderTop: '1px solid rgba(224, 224, 224, 1)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: 2 }}>Rows per page:</Typography>
        <select
          value={pageSize}
          onChange={handleChangeRowsPerPage}
          style={{
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        >
          {[10, 25, 50, 100, 1000].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </Box>
      <Typography variant="body2">
        {totalCount > 0 ? `${page * pageSize + 1}-${Math.min((page + 1) * pageSize, totalCount)} of ${totalCount}` : `0 of ${totalCount}`}
      </Typography>
      <ButtonGroup variant="outlined" size="small">
        <Button
          onClick={() => setPage(0)}
          disabled={page === 0}
        >
          First
        </Button>
        <Button
          onClick={() => setPage(Math.max(page - 1, 0))}
          disabled={page === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage(Math.min(page + 1, pageCount - 1))}
          disabled={page >= pageCount - 1}
        >
          Next
        </Button>
        <Button
          onClick={() => setPage(pageCount - 1)}
          disabled={page >= pageCount - 1}
        >
          Last
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default CustomPagination; 