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
import { dashboardService, registrationService } from "@/app/services";

const UserCourseAccess = () => {
  // State for users and courses
  const [allUsers, setAllUsers] = useState([]);
  const [courseDropDown, setCourseDropDown] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State for selected values
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // State for configuration options
  const [restrictStartDateChange, setRestrictStartDateChange] = useState(false);
  const [forcefullBuyCourse, setForcefullBuyCourse] = useState(false);
  const [stopSkipSet, setStopSkipSet] = useState(false);
  const [allowBackDateBuy, setAllowBackDateBuy] = useState(false);
  const [backDayCount, setBackDayCount] = useState("0");
  const [restrictOnTotalSeat, setRestrictOnTotalSeat] = useState(false);
  const [totalSeat, setTotalSeat] = useState("0");
  
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
        config: {
          restrictStartDateChange,
          forcefullBuyCourse,
          stopSkipSet,
          allowBackDateBuy,
          backDayCount: parseInt(backDayCount),
          restrictOnTotalSeat,
          totalSeat: parseInt(totalSeat)
        }
      };

      // Call API to save data (replace with your actual service method)
      // const response = await dashboardService.saveUserCourseAccess(dataToSave);
      
      // For now, just simulate a successful save
      console.log("Saving data:", dataToSave);
      
      // Show success message
      setSaveSuccess(true);
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

      {/* Configuration Options */}
      {selectedParent && selectedCourse && (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Access Configuration
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
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
            </Grid>
          </Grid>
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
