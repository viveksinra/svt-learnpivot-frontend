import React, { useState, useEffect, useRef } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { PersonOutline } from '@mui/icons-material';
import { childService } from '@/app/services';
import MySnackbar from '../MySnackbar/MySnackbar';

const ChildSelectorDropDown = ({ selectedChild, setSelectedChild }) => {
  const [allChildren, setAllChildren] = useState([]);
  const snackRef = useRef();

  useEffect(() => {
    handleGetAllChildren();
  }, []);

  const handleGetAllChildren = async () => {
    try {
      const response = await childService.getAll();
      if (response.data) {
        setAllChildren(response.data);
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      snackRef.current.handleSnack({ message: 'Failed to fetch children.', variant: 'error' });
    }
  };

  return (
    <FormControl sx={{ width: 220 }}>
      <InputLabel>Select Child</InputLabel>
      <Select
        value={selectedChild}
        label="Select Child"
        onChange={(e) => setSelectedChild(e.target.value)}
        sx={{ '& .MuiSelect-select': { py: 1.5 } }}
        MenuProps={{
          disableScrollLock: true,
          disablePortal: true,
          PaperProps: {
            sx: {
              width: 220,
              maxHeight: 300,
              p: 0,
              m: 0
            }
          },
          MenuListProps: {
            sx: {
              p: 0,
              m: 0
            }
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left'
          }
        }}
      >
        <MenuItem value="all">All Children</MenuItem>
        {allChildren.map((child) => (
          <MenuItem key={child._id} value={child._id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                whiteSpace: 'normal',
                wordBreak: 'break-word'
              }}
            >
              <PersonOutline color="primary" />
              {child.childName} - {child.childYear}
            </Box>
          </MenuItem>
        ))}
      </Select>
      <MySnackbar ref={snackRef} />
    </FormControl>
  );
};

export default ChildSelectorDropDown;