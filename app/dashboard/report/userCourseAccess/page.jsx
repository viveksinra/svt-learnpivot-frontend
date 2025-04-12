"use client"
import { useEffect, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Box,
  Paper,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import { dashboardService, registrationService, myCourseService } from "@/app/services";

const UserCourseAccess = () => {
  // State for users and courses
  const [allUsers, setAllUsers] = useState([]);
  const [courseDropDown, setCourseDropDown] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [parentAccessError, setParentAccessError] = useState(null);
  
  // State for selected values
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // State for parent course access
  const [onlySelectedParent, setOnlySelectedParent] = useState(true); // true = add, false = remove
  
  // State for configuration options
  const [restrictStartDateChange, setRestrictStartDateChange] = useState(false);
  const [forcefullBuyCourse, setForcefullBuyCourse] = useState(false);
  const [stopSkipSet, setStopSkipSet] = useState(false);
  const [allowBackDateBuy, setAllowBackDateBuy] = useState(false);
  const [backDayCount, setBackDayCount] = useState("0");
  const [restrictOnTotalSeat, setRestrictOnTotalSeat] = useState(false);
  const [totalSeat, setTotalSeat] = useState("0");
  const [hasCourseAccessFile, setHasCourseAccessFile] = useState("");

  // State for the save operation
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  // Fetch all users for dropdown
  const getAllUsers = async () => {
    setLoading(true);
    try {
      let res = await dashboardService.getAllUserForDropDown();
      if (res.variant === "success") {
        setAllUsers(res.data);
      } else {
        setError("Failed to fetch users");
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all courses for dropdown
  const fetchCourseDropDown = async () => {
    setLoading(true);
    try {
      let response = await registrationService.getCourseDropDown();
      if (response.variant === "success") {
        setCourseDropDown(response.data);
      } else {
        setError("Failed to fetch courses");
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError("An error occurred while fetching courses");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    getAllUsers();
    fetchCourseDropDown();
  }, []);

  const AddParentToCourseAccess = async () => {
    if (!selectedParent || !selectedCourse) {
      setError("Please select both parent and course");
      setParentAccessError("Please select both parent and course");
      setSaveError(true);
      return;
    }
    
    setLoading(true);
    let data = {
      userId: selectedParent._id,
      courseId: selectedCourse._id,
      addOrRemove: !onlySelectedParent ? "add" : "remove"
    }
    try {
      let res = await myCourseService.addParentToCourseAccessApi(data);
      if (res.variant === "success") {
        setSaveSuccess(true);
        setOnlySelectedParent(!onlySelectedParent);
      } else {
        setError(res.message || "Failed to update parent course access");
      setParentAccessError(res.message || "Failed to update parent course access");

        setSaveError(true);
      }
    } catch (error) {
      console.error('Error updating parent course access:', error);
      setError("An error occurred while updating parent course access");
      setSaveError(true);
    } finally {
      setLoading(false);
    }
  };
  
  const DoesParentHaveCourseAccess = async () => {
    if (!selectedParent || !selectedCourse) {
      setError("Please select both parent and course");
      return;
    }
    
    setLoading(true);
    let data = {
      userId: selectedParent._id,
      courseId: selectedCourse._id,
    }
    try {
      let res = await myCourseService.DoesParentHaveCourseAccessApi(data);
      if (res.variant === "success") {
        setOnlySelectedParent(res.hasAccess); // If they have access, default to remove

        return res.data;
      } else {
        setError(res.message || "Failed to check parent course access");
        return false;
      }
    } catch (error) {
      console.error('Error checking parent course access:', error);
      setError("An error occurred while checking parent course access");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const DeleteOneUserOneCourseAccess = async () => {
    if (!selectedParent || !selectedCourse) {
      setError("Please select both parent and course");
      setSaveError(true);
      return;
    }
    
    setLoading(true);
    let data = {
      userId: selectedParent._id,
      courseId: selectedCourse._id,
    }
    try {
      let res = await myCourseService.DeleteOneUserOneCourseAccessApi(data);
      if (res.variant === "success") {
        setSaveSuccess(true);
      } else {
        setError(res.message || "Failed to delete parent course access");
        setSaveError(true);
      }
    } catch (error) {
      console.error('Error deleting parent course access:', error);
      setError("An error occurred while deleting parent course access");
      setSaveError(true);
    } finally {
      setLoading(false);
    }
  };
  
  const GetOneUserOneCourseAccess = async () => {
    if (!selectedParent || !selectedCourse) {
      setError("Please select both parent and course");
      return;
    }
    
    setLoading(true);
    let data = {
      userId: selectedParent._id,
      courseId: selectedCourse._id,
    }
    try {
      let res = await myCourseService.GetOneUserOneCourseAccessApi(data);
      console.log(res);
      if (res.variant == "success") {
        // Update the state with the configuration from API
        if (res.hasCourseAccessFile === "yes" || res.hasCourseAccessFile === "no") {
            setHasCourseAccessFile(res.hasCourseAccessFile);
            
            // If it's "no", we should clear the configuration settings but keep hasCourseAccessFile value
            if (res.hasCourseAccessFile === "no") {
                clearConfigSettingsOnly();
            }
        }
        
        if(res.hasCourseAccessFile == "yes"){
            if (res.data) {
                const config = res.data;
                setRestrictStartDateChange(config.restrictStartDateChange || false);
                setForcefullBuyCourse(config.forcefullBuyCourse || false);
                setStopSkipSet(config.stopSkipSet || false);
                setAllowBackDateBuy(config.allowBackDateBuy || false);
                setBackDayCount((config.backDayCount || 0).toString());
                setRestrictOnTotalSeat(config.restrictOnTotalSeat || false);
                setTotalSeat((config.totalSeat || 0).toString());
            }
        } else if(res.hasCourseAccessFile != "yes" && res.hasCourseAccessFile != "no") {
            setHasCourseAccessFile("");
        }
       
      } else {
        setError(res.message || "Failed to fetch user course access");
      }
    } catch (error) {
      console.error('Error fetching user course access:', error);
      setError("An error occurred while fetching user course access");
    } finally {
      setLoading(false);
    }
  };

  // Function to clear just configuration settings, not the hasCourseAccessFile
  const clearConfigSettingsOnly = () => {
    setRestrictStartDateChange(false);
    setForcefullBuyCourse(false);
    setStopSkipSet(false);
    setAllowBackDateBuy(false);
    setBackDayCount("0");
    setRestrictOnTotalSeat(false);
    setTotalSeat("0");
  };

  // Function to clear all data including hasCourseAccessFile
  const clearAllConfigData = () => {
    clearConfigSettingsOnly();
    setHasCourseAccessFile("");
  };

  // Check if course is selected and load configuration
  useEffect(() => {
    if (selectedParent && selectedCourse) {
      GetOneUserOneCourseAccess();
      DoesParentHaveCourseAccess();
    }
  }, [selectedParent, selectedCourse]);

  // Handle save button click
  const handleSave = async () => {
    if (!selectedParent || !selectedCourse) {
      setError("Please select both parent and course");
      setSaveError(true);
      return;
    }

    setLoading(true);
    try {
      // Prepare data to save
      const dataToSave = {
        userId: selectedParent._id,
        courseId: selectedCourse._id,       
          restrictStartDateChange,
          forcefullBuyCourse,
          stopSkipSet,
          allowBackDateBuy,
          backDayCount: parseInt(backDayCount),
          restrictOnTotalSeat,
          totalSeat: parseInt(totalSeat)
       
      };

      // Call API to save data
      let res = await myCourseService.SaveOrUpdateOneCourseAccessApi(dataToSave);
      if (res.variant === "success") {
        setSaveSuccess(true);
      } else {
        setError(res.message || "Failed to save configuration");
        setSaveError(true);
      }
    } catch (error) {
      console.error('Error saving data:', error);
      setSaveError(true);
    } finally {
      setLoading(false);
    }
  };

  // Handle close of snackbar alerts
  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setSaveSuccess(false);
    setSaveError(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Course Access
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Step 1: Select Parent */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              id="parent-select"
              options={allUsers}
              value={selectedParent}
              onChange={(event, newValue) => {
                setSelectedParent(newValue);
              }}
              getOptionLabel={(option) => {
                const childrenNames = option.children?.map(child => child.childName).join(', ') || '';
                return `${option.firstName || ''} ${option.lastName || ''} (${option.email || ''}) ${childrenNames ? `[Children: ${childrenNames}]` : ''}`;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Parent"
                  placeholder="Search by name, email or mobile"
                  required
                />
              )}
              loading={loading}
              disabled={loading}
            />
          </Grid>

          {/* Step 2: Select Course */}
          <Grid item xs={12} md={6}>
            <Autocomplete
              id="course-select"
              options={courseDropDown}
              value={selectedCourse}
              onChange={(event, newValue) => {
                setSelectedCourse(newValue);
              }}
              getOptionLabel={(option) => option.courseTitle || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Course"
                  placeholder="Search course"
                  required
                />
              )}
              loading={loading}
              disabled={loading || !selectedParent}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Parent Course Access Toggle */}
      {selectedParent && selectedCourse && (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
           1. Parent Course Access 
          </Typography>
          <Typography variant="h6" gutterBottom>
           {onlySelectedParent ? "Parent has access to course" : "Parent does not have access to course"}
          </Typography>
          <Typography variant="h6" gutterBottom color="error">
          {parentAccessError}
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2} alignItems="center">
            
            <Grid item xs={12} md={6} sx={{ textAlign: 'right' }}>
              <Button
                variant="contained"
                color={!onlySelectedParent ? "primary" : "error"}
                onClick={AddParentToCourseAccess}
                disabled={loading}
                sx={{ mr: 2 }}
              >
                {!onlySelectedParent ? "Grant Access" : "Remove Access"}
              </Button>

            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Configuration Options */}
      {selectedParent && selectedCourse && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Access Configuration
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
      {(hasCourseAccessFile === "yes" || hasCourseAccessFile === "no") ? 
   (   <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={restrictStartDateChange}
                    onChange={() => setRestrictStartDateChange(!restrictStartDateChange)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Restrict Start Date Change"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={forcefullBuyCourse}
                    onChange={() => setForcefullBuyCourse(!forcefullBuyCourse)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Force Full Buy Course"
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={stopSkipSet}
                    onChange={() => setStopSkipSet(!stopSkipSet)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Force Continuous Set Buy"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={allowBackDateBuy}
                    onChange={() => setAllowBackDateBuy(!allowBackDateBuy)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Allow Back Date Buy"
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Back Days"
                type="number"
                value={backDayCount}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setBackDayCount(value.toString());
                }}
                inputProps={{ min: "0", step: "1" }}
                variant="outlined"
                disabled={!allowBackDateBuy}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={restrictOnTotalSeat}
                    onChange={() => setRestrictOnTotalSeat(!restrictOnTotalSeat)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                }
                label="Restrict On Total-Seat"
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                label="Total Seat"
                type="number"
                value={totalSeat}
                onChange={(e) => {
                  const value = Math.max(0, parseInt(e.target.value) || 0);
                  setTotalSeat(value.toString());
                }}
                inputProps={{ min: "0", step: "1" }}
                placeholder="Total Seat"
                variant="outlined"
                disabled={!restrictOnTotalSeat}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ mt: 3, textAlign: 'right' }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Configuration"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={DeleteOneUserOneCourseAccess}
                disabled={loading}
              >
                Delete All Access
              </Button>
            </Grid>
          </Grid>)
        :
       ( <>
                <Typography variant="h6" gutterBottom>Not able to fetch Access Configuration</Typography>
                <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={GetOneUserOneCourseAccess}
                disabled={loading}
                >
                Fetch Data ~ {hasCourseAccessFile}
                </Button>
        </>)
        }
        </Paper>
      )}

      {/* Success/Error Snackbars */}
      <Snackbar open={saveSuccess} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
          Configuration saved successfully!
        </Alert>
      </Snackbar>
      
      <Snackbar open={saveError} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
          {error || "Error saving configuration. Please try again."}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserCourseAccess;
