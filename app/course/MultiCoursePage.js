"use client";
import React, { Suspense, useEffect, useState } from "react";
import "./classes.css";
import { Container, Typography, Grid, TablePagination, CircularProgress } from "@mui/material";
import { useMediaQuery, useTheme } from "@mui/material";
import OneClass from "../Components/PublicPage/Classes/OneClass";
import { myCourseService } from "../services";
import NoResult from "../Components/NoResult/NoResult";
import FilterDialog from "../Components/PublicPage/ClassMockComm/FilterDialog";
import FilterComponent from "../Components/PublicPage/ClassMockComm/FilterComponent";

function MultiCoursePage() {
  const [filterData, setFilterData] = useState([
    {
      title: "Class",
      link:"courseClass",
      tags: [
        { label: "Class 4", id: "4" },
        { label: "Class 5", id: "5" },
        { label: "Class 6", id: "6" },
      ]
    },
    {
      title: "Type",
      link:"courseType",

      tags: [
        { label: "Full Course", id: "fullCourse" },
        { label: "Crash Course", id: "crashCourse" },
      ]
    },
    {
      title: "Duration",
      link:"duration",
      tags: [
        { label: "< 1 Month", id: "lessThan1Month" },
        { label: "1-3 Months", id: "1to3Months" },
        { label: "3-6 Months", id: "3to6Months" },
        { label: "6+ Months", id: "moreThan6Months" },
      ]
    },
  ]);
  const [selectedFilter, setSelectedFilter] = useState([
    {
      link:"courseClass",
      ids:[]
    },
    {
      link:"courseType",
      ids:[]
    },
    {
      link:"duration",
      ids:[]
    },

  ]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [sortBy, setSort]= useState("newToOld");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true)
      let response = await myCourseService.publicGetAll(
        {sortBy,page,rowsPerPage,searchText,totalCount,selectedFilter}
        );
     console.log(response)
      if(response.variant === "success"){
        setLoading(false)
        setRows(response.data)
        setTotalCount(response.totalCount)
      }else {console.log(response); setLoading(false)}
    }
    fetchAllData()
  }, [rowsPerPage,page,searchText,sortBy,selectedFilter])

  return (
    <>
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
          {loading ? (
            <div className="center" style={{flexDirection:"column"}}>
              <CircularProgress size={30}/>
              <Typography 
                color="slateblue" 
                style={{fontFamily: 'Courgette'}} 
                variant='h6' 
                align='center'
              >
                Loading Courses...
              </Typography>
            </div>
          ) : rows.length === 0 ? (
            <NoResult label="No Courses Available"/>
          ) : (
            rows.map((p) => (
              <OneClass data={p} key={p._id} />
            ))
          )}
        </Grid>
      </Grid>
      
      {/* <TablePagination
        rowsPerPageOptions={[5,10,15,100]}
        component="div"
        count={totalCount}
        sx={{overflowX:"hidden"}}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e,v) => setPage(v)}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      /> */}
    </>
  );
}

export default MultiCoursePage;
