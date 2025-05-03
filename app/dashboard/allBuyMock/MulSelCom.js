import React, { useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import { mockTestService } from '@/app/services';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MulSelCom({ selectedMockTests, setSelectedMockTests, selectedBatches, setSelectedBatches, successOnly, setSuccessOnly, loadAllData, setLoadAllData }) {
  const [sortBy, setSort] = useState("newToOld");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1000);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mockTests, setMockTests] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      let response = await mockTestService.publicGetAll({ sortBy, page, rowsPerPage, searchText, totalCount });
      console.log(response);
      if (response.variant === "success") {
        setLoading(false);
        setMockTests(response.data);
      } else {
        console.log(response);
        setLoading(false);
      }
    }
    fetchAllData();
  }, [rowsPerPage, page, searchText, sortBy]);

  const handleMockTestChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedMockTests = typeof value === 'string' ? value.split(',') : value;
    const selectedMockTestObjects = selectedMockTests.map(title => {
      const mockTest = mockTests.find(mt => mt.mockTestTitle === title);
      return { title, id: mockTest._id };
    });
    console.log(selectedMockTestObjects)
    setSelectedMockTests(selectedMockTestObjects);
    setSelectedBatches([]); // Clear the second dropdown selection
  };

  const handleBatchChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedBatchLabels = typeof value === 'string' ? value.split(',') : value;
    const selectedBatchObjects = selectedBatchLabels.map(label => {
      const [date, time] = label.split(' ');
      const [startTime, endTime] = time.split('-');
      let batchId = '';
      selectedMockTests.forEach(mockTest => {
        const mockTestObj = mockTests.find(mt => mt.mockTestTitle === mockTest.title);
        const batch = mockTestObj.batch.find(b => b.date === date && b.startTime === startTime && b.endTime === endTime);
        if (batch) batchId = batch._id;
      });
      return { label, id: batchId };
    });
    setSelectedBatches(selectedBatchObjects);
  };

  const getBatchesForSelectedMockTests = () => {
    const batches = [];
    selectedMockTests.forEach(mockTest => {
      const mockTestObj = mockTests.find(mt => mt.mockTestTitle === mockTest.title);
      if (mockTestObj && mockTestObj.batch) {
        mockTestObj.batch.forEach(batch => {
          batches.push({
            label: `${batch.date} ${batch.startTime}-${batch.endTime}`,
            id: batch._id,
          });
        });
      }
    });
    return batches;
  };

  const batches = getBatchesForSelectedMockTests();

  const filteredMockTests =  mockTests;

  const handleSwitchChange = (event) => {
    setSuccessOnly(event.target.checked);
  };
  
  const handleLoadAllDataChange = (event) => {
    setLoadAllData(event.target.checked);
  };

  const getSelectWidth = () => {
    if (isSmallScreen) return '100%';
    if (isMediumScreen) return 220;
    return 300;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={{ xs: 1, sm: 2 }} 
        flexWrap="wrap"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <FormControl sx={{ width: getSelectWidth(), minWidth: isSmallScreen ? '100%' : 220 }}>
          <InputLabel id="mocktest-multiple-checkbox-label">Mock Tests</InputLabel>
          <Select
            labelId="mocktest-multiple-checkbox-label"
            id="mocktest-multiple-checkbox"
            multiple
            value={selectedMockTests.map(mockTest => mockTest.title)}
            onChange={handleMockTestChange}
            input={<OutlinedInput label="Mock Tests Student" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {filteredMockTests.map((mockTest) => (
              <MenuItem key={mockTest._id} value={mockTest.mockTestTitle}>
                <Checkbox checked={selectedMockTests.some(mt => mt.title === mockTest.mockTestTitle)} />
                <ListItemText primary={mockTest.mockTestTitle} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: getSelectWidth(), minWidth: isSmallScreen ? '100%' : 220 }} disabled={selectedMockTests.length === 0}>
          <InputLabel id="batch-multiple-checkbox-label">Batches</InputLabel>
          <Select
            labelId="batch-multiple-checkbox-label"
            id="batch-multiple-checkbox"
            multiple
            value={selectedBatches.map(batch => batch.label)}
            onChange={handleBatchChange}
            input={<OutlinedInput label="Batches" />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
          >
            {batches.map((batch) => (
              <MenuItem key={batch.id} value={batch.label}>
                <Checkbox checked={selectedBatches.some(b => b.label === batch.label)} />
                <ListItemText primary={batch.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Success Only Toggle */}
        <Box 
          sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: { xs: 0.5, sm: 1 },
            backgroundColor: successOnly ? '#e8f5e9' : '#f5f5f5'
          }}
        >
          <FormControlLabel
            control={
              <Switch 
                checked={successOnly} 
                onChange={handleSwitchChange} 
                color="success"
              />
            }
            label="Success Only"
            sx={{ m: 0 }}
          />
        </Box>
        
        {/* Load All Data Toggle */}
        <Box 
          sx={{ 
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: { xs: 0.5, sm: 1 },
            backgroundColor: loadAllData ? '#e3f2fd' : '#f5f5f5'
          }}
        >
          <FormControlLabel
            control={
              <Switch 
                checked={loadAllData} 
                onChange={handleLoadAllDataChange} 
                color="primary"
              />
            }
            label="Load All Data"
            sx={{ m: 0 }}
          />
        </Box>
      </Stack>
    </Box>
  );
}