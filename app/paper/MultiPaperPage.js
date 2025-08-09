"use client";
import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Typography } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import { paperService } from "../services";
import NoResult from "../Components/NoResult/NoResult";
import FilterDialog from "../Components/PublicPage/ClassMockComm/FilterDialog";
import FilterComponent from "../Components/PublicPage/ClassMockComm/FilterComponent";
import OnePaperSet from "../Components/PublicPage/Paper/OnePaperSet.jsx";

export default function MultiPaperPage() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [sortBy, setSort] = useState("newToOld");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [filterData, setFilterData] = useState([
    {
      title: "Year",
      link: "classLevel",
      tags: [
        { label: "Year 4", id: "4" },
        { label: "Year 5", id: "5" },
        { label: "Year 6", id: "6" },
      ]
    },
    {
      title: "Subject",
      link: "subject",
      tags: [
        { label: "Maths", id: "maths" },
        { label: "English", id: "english" },
        { label: "VR", id: "vr" },
        { label: "NVR", id: "nvr" },
        { label: "Other", id: "other" },
      ]
    }
  ]);
  const [selectedFilter, setSelectedFilter] = useState([
    { link: "classLevel", ids: [] },
    { link: "subject", ids: [] }
  ]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await paperService.publicGetAll({ selectedFilter, sortBy, rowsPerPage, page });
      setRows(response?.data || []);
      setLoading(false);
    }
    fetchData();
  }, [sortBy, rowsPerPage, page, selectedFilter]);

  if (loading) return (
    <div className="center" style={{flexDirection:"column", padding: "40px"}}>
      <CircularProgress size={40} sx={{ color: '#00c853' }}/>
      <Typography color="primary" sx={{ mt: 2 }}>Loading Papers...</Typography>
    </div>
  );

  if (!rows.length) return <NoResult label="No Paper Sets Available"/>;

  return (
    <Grid container>
      {fullScreen ? (
        <FilterDialog 
          filterData={filterData}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      ) : (
        <Grid item xs={2}>
          <FilterComponent 
            filterData={filterData}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
          />
        </Grid>
      )}
      <Grid item xs={fullScreen ? 12 : 10}>
        <Grid container spacing={2}>
          {rows.map((set) => (
            <Grid item xs={12} key={set._id}>
              <OnePaperSet data={set} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}


