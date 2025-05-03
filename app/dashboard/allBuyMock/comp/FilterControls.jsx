import React from 'react';
import { 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton, 
  Box,
  useMediaQuery,
  useTheme,
  Divider,
  Tab,
  TextField,
  InputAdornment
} from '@mui/material';
import { TabContext, TabList } from "@mui/lab";
import { FcOrgUnit, FcTimeline } from "react-icons/fc";
import { BsSearch } from "react-icons/bs";
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
  setSuccessOnly,
  loadAllData,
  setLoadAllData,
  localSearchText,
  setLocalSearchText
}) => {
  const sortOptions = [
    { label: "New First", value: "newToOld" }, 
    { label: "Old First", value: "oldToNew" }
  ];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ width: '100%', mb: 3 }}>
      {/* Page Title and Search Row */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        mb: 1.5,
        gap: 2
      }}>
        <Typography 
          color="primary" 
          variant='h5' 
          sx={{ 
            fontFamily: 'Courgette', 
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          All Purchased Mock Tests
        </Typography>

     
      </Box>

      {/* View Toggle - Directly below the title */}
      <Box sx={{ mb: 2.5 }}>
        <ToggleButtonGroup 
          exclusive
          value={tabular ? "table" : "grid"}
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setView(newValue === "table");
            }
          }}
          size="small"
        >
          <ToggleButton value="grid">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FcOrgUnit />
              <Typography variant="body2">Grid View</Typography>
            </Box>
          </ToggleButton>
          <ToggleButton value="table">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FcTimeline />
              <Typography variant="body2">Table View</Typography>
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Filters */}
      <Box sx={{ width: '100%' }}>
        <MulSelCom 
          selectedMockTests={selectedMockTests} 
          setSelectedMockTests={setSelectedMockTests} 
          selectedBatches={selectedBatches} 
          setSelectedBatches={setSelectedBatches} 
          successOnly={successOnly} 
          setSuccessOnly={setSuccessOnly} 
          loadAllData={loadAllData}
          setLoadAllData={setLoadAllData}
        />
      </Box>
         {/* Local Search Feature */}
         <Box sx={{ 
          width: { 
            xs: '100%', 
            sm: '50%', 
            md: '35%', 
            lg: '25%' 
          },
          minWidth: { xs: '100%', sm: '200px' }
        }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder={isMobile ? "Search..." : "Search loaded data..."}
            value={localSearchText || ''}
            onChange={(e) => setLocalSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BsSearch />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              }
            }}
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