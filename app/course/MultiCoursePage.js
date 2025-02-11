"use client";
import React, { Suspense, useEffect, useState } from "react";
import "./classes.css";
import { Container, Typography, Grid, Breadcrumbs, Divider, Tabs, Tab, TablePagination, CircularProgress } from "@mui/material";
import Footer from "../Components/Footer/Footer";
import { useRouter } from "next/navigation";
import Enquiry from "@/app/Components/Enquiry/Enquiry";
import OneClass from "../Components/PublicPage/Classes/OneClass";
import { Dialog, useMediaQuery, useTheme, Button, DialogActions, DialogContent } from "@mui/material";
import Slide from '@mui/material/Slide';
import { myCourseService } from "../services";
import Loading from "../Components/Loading/Loading";
import NoResult from "../Components/NoResult/NoResult";
import Navbar from "../Components/ITStartup/Common/Navbar/Navbar";
import FilterComponent from "../Components/PublicPage/ClassMockComm/FilterComponent";
import FilterDialog from "../Components/PublicPage/ClassMockComm/FilterDialog";

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
        { label: "3 Months", id: "3months" },
        { label: "6 Months", id: "6months" },
        { label: "1 Years", id: "1years" },
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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [totalCount,setTotalCount] = useState(0)
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
          <Grid container spacing={3}>
  {rows.length === 0 && <>      {fullScreen? (
       
        <FilterDialog filterData={filterData} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter}/>
     
      ):(
        <Grid item xs={2}>
        <FilterComponent filterData={filterData} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter}/>
      </Grid>
      )}</>}
          <Grid item xs={fullScreen ? 12 : 10}>

        {loading ? 
        <div className="center" style={{flexDirection:"column"}}><CircularProgress size={30}/> <Typography color="slateblue" style={{fontFamily: 'Courgette'}} variant='h6' align='center'>Loading Courses...</Typography>  </div> : rows.length === 0 ? <NoResult label="Currently, there are no courses available."/> :  
            rows &&
              rows.map((p, j) => (
                <OneClass data={p} key={p._id} />
              ))
          }
</Grid>
        </Grid>
        <TablePagination
                rowsPerPageOptions={[5,10,15,100]}
                component="div"
                count={totalCount}
                sx={{overflowX:"hidden"}}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e,v)=>setPage(v)}
                onRowsPerPageChange={e=>{
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0)
                }}
              />
    </>
    
  );
}

export default MultiCoursePage;
