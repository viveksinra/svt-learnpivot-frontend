import React from 'react';
import { 
  Grid, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton, 
  Tooltip, 
  Tab,
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Paper
} from '@mui/material';
import { TabContext, TabList } from "@mui/lab";
import { FcOrgUnit, FcTimeline } from "react-icons/fc";
import MulSelCom from "../MulSelCom";

const FilterControls = ({ 
  tabular, 
  setView, 
  sortBy, 
  setSort,
  selectedMockTests, 
  setSelectedMockTests, 
  selectedBatches, 
  setSelectedBatches, 
  successOnly, 
  setSuccessOnly
}) => {
  const sortOptions = [
    { label: "New First", value: "newToOld" }, 
    { label: "Old First", value: "oldToNew" }
  ];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      <Typography 
        color="primary" 
        variant='h5' 
        sx={{ 
          fontFamily: 'Courgette', 
          fontSize: { xs: '1.5rem', md: '2rem' },
          mb: 2
        }}
      >
        All Purchased Mock Tests
      </Typography>

      {/* View Type Toggle Buttons - Placed at the top for maximum visibility */}
      <Paper 
        elevation={0}
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mb: 3,
          p: 1,
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: 2
        }}
      >
        <ToggleButtonGroup 
          exclusive
          value={tabular ? "table" : "grid"}
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setView(newValue === "table");
            }
          }}
          aria-label="View Mode"
          sx={{
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            borderRadius: 1,
            '& .MuiToggleButton-root': {
              border: 'none',
              px: 3,
              py: 1
            }
          }}
        >
          <ToggleButton value="grid" aria-label="grid view">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FcOrgUnit style={{ fontSize: 24 }} />
              <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>Grid View</Typography>
            </Box>
          </ToggleButton>
          <Divider orientation="vertical" flexItem />
          <ToggleButton value="table" aria-label="table view">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FcTimeline style={{ fontSize: 24 }} />
              <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>Table View</Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Paper>
      
      {/* Filters */}
      <Box sx={{ width: '100%' }}>
        <MulSelCom 
          selectedMockTests={selectedMockTests} 
          setSelectedMockTests={setSelectedMockTests} 
          selectedBatches={selectedBatches} 
          setSelectedBatches={setSelectedBatches} 
          successOnly={successOnly} 
          setSuccessOnly={setSuccessOnly} 
        />
      </Box>
      
      {/* Sorting Options */}
      <Box sx={{ width: '100%', mt: 2 }}>
        <TabContext value={sortBy}>
          <TabList 
            onChange={(e, v) => setSort(v)} 
            aria-label="Sort options"
            variant="scrollable" 
            scrollButtons="auto" 
            allowScrollButtonsMobile
          >
            {sortOptions.map((option) => (
              <Tab 
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </TabList>
        </TabContext>
      </Box>
    </Box>
  );
};

export default FilterControls; 