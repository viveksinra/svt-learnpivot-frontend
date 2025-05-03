import React from 'react';
import { 
  Grid, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton, 
  Tooltip, 
  Tab 
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Typography 
          color="primary" 
          variant='h5' 
          gutterBottom
          sx={{ fontFamily: 'Courgette', fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          All Purchased Mock Tests
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} sx={{display:"flex", justifyContent:"end", marginBottom:"20px", flexWrap: "wrap"}}>
        <ToggleButtonGroup 
          aria-label="ViewMode" 
          sx={{display: "flex", marginLeft:"10px", marginRight:"10px"}}
        >
          <Tooltip arrow title="Grid View">
            <ToggleButton 
              value="grid" 
              selected={!tabular}
              onClick={()=>setView(false)} 
              aria-label="gridView"
            >
              <FcOrgUnit/>
            </ToggleButton>
          </Tooltip>
          <Tooltip arrow title="Table View">
            <ToggleButton 
              value="list" 
              selected={tabular}
              onClick={()=>setView(true)} 
              aria-label="listView"
            >
              <FcTimeline />
            </ToggleButton>
          </Tooltip>
        </ToggleButtonGroup>
      </Grid>
      
      <Grid item xs={12}>
        <MulSelCom 
          selectedMockTests={selectedMockTests} 
          setSelectedMockTests={setSelectedMockTests} 
          selectedBatches={selectedBatches} 
          setSelectedBatches={setSelectedBatches} 
          successOnly={successOnly} 
          setSuccessOnly={setSuccessOnly} 
        />
      </Grid>
      <Grid item xs={12} sx={{maxWidth: { xs: 350, sm: 480, md: 700 }, marginBottom:"10px"}}>
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
      </Grid>
    </Grid>
  );
};

export default FilterControls; 