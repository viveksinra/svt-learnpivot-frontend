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
  Alert,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { dashboardService, registrationService, myCourseService } from "@/app/services";

const ParentWiseView = () => {
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down('xs'));
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  
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
  const [enableSeperateUserAccessForCourse, setEnableSeperateUserAccessForCourse] = useState(false);

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

  // Load data on component mount
  useEffect(() => {
    getAllUsers();
    
  }, []);

    // Fetch all users for dropdown
    const checkOneUserAllCourseAccess = async () => {
      // If no parent is selected, don't do anything and don't set loading state
      if (!selectedParent) {
        return;
      }
      
      setLoading(true);
      
      try {
        const userId = selectedParent._id;

        let res = await myCourseService.GetOneUserAllCourseAccessApi({userId});
        if (res.variant === "success") {

          setCourseDropDown(res.data);
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

    useEffect(() => {
      if (selectedParent) {
        checkOneUserAllCourseAccess();
      } else {
        // If no parent is selected, ensure courseDropDown is empty
        setCourseDropDown([]);
      }
    }, [selectedParent]);

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
        checkOneUserAllCourseAccess();
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
        checkOneUserAllCourseAccess();
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
                setEnableSeperateUserAccessForCourse(config.enableSeperateUserAccessForCourse || false);
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
    setParentAccessError(null);
    setEnableSeperateUserAccessForCourse(false);
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
      setParentAccessError(null);
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
          enableSeperateUserAccessForCourse,
          backDayCount: parseInt(backDayCount),
          restrictOnTotalSeat,
          totalSeat: parseInt(totalSeat)
       
      };

      // Call API to save data
      let res = await myCourseService.SaveOrUpdateOneCourseAccessApi(dataToSave);
      if (res.variant === "success") {
        setSaveSuccess(true);
        GetOneUserOneCourseAccess();
        checkOneUserAllCourseAccess();
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
    <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 }, overflow: 'hidden' }}>
      <Box sx={{ py: { xs: 2, sm: 2.5, md: 3, lg: 4 } }}>

        
        <Card elevation={3} sx={{ mb: { xs: 2.5, sm: 3, md: 4 }, overflow: 'visible' }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              gutterBottom 
              color="text.secondary" 
              sx={{ mb: { xs: 1.5, sm: 2, md: 3 } }}
            >
              Select User and Course
            </Typography>
            
            <Grid container spacing={isMobile ? 1.5 : 2.5}>
              {/* Step 1: Select Parent */}
              <Grid item xs={12} md={6}>
                <Autocomplete
                  id="parent-select"
                  options={allUsers}
                  value={selectedParent}
                  onChange={(event, newValue) => {
                    
                    // If parent is cleared, clear course and config data
                    if (!newValue) {
                      setSelectedCourse(null);
                      clearAllConfigData();
                      setCourseDropDown([]); // Clear course dropdown options
                      setLoading(false); // Ensure loading is false when parent is cleared
                    }
                    
                    // Always update the parent selection last
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
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      sx={{ 
                        '& .MuiInputBase-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }
                      }}
                    />
                  )}
                  loading={loading}
                  disabled={false} // Always enable the parent dropdown
                  loadingText="Loading users..."
                  noOptionsText="No users found"
                  clearOnBlur={false}
                  clearOnEscape
                  ListboxProps={{ 
                    style: { 
                      maxHeight: isMobile ? '150px' : '200px' 
                    } 
                  }}
                  popupIcon={<span style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>▼</span>}
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
                    if (!newValue) {
                      // Clear configuration data
                      clearAllConfigData();
                    }
                  }}
                  getOptionLabel={(option) => option.courseTitle || ''}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        width: '100%',
                        py: { xs: 0.5, sm: 0.75 }
                      }}>
                        <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                          {option.courseTitle}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          mt: 0.5, 
                          flexWrap: 'wrap',
                          justifyContent: isMobile ? 'flex-start' : undefined
                        }}>
                          <Chip 
                            label={option.isCourseAccess ? "Access" : "No Access"} 
                            color={option.isCourseAccess ? "success" : "error"} 
                            size="small"
                            variant="outlined"
                            sx={{ height: isMobile ? '24px' : '32px', fontSize: isMobile ? '0.7rem' : '0.75rem' }}
                          />
                          <Chip 
                            label={option.isSeperateUserAccess ? "Custom Config" : "Default Config"} 
                            color={option.isSeperateUserAccess ? "primary" : "default"} 
                            size="small"
                            variant="outlined"
                            sx={{ height: isMobile ? '24px' : '32px', fontSize: isMobile ? '0.7rem' : '0.75rem' }}
                          />
                        </Box>
                      </Box>
                    </li>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Select Course"
                      placeholder="Search course"
                      required
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                      size={isMobile ? "small" : "medium"}
                      sx={{ 
                        '& .MuiInputBase-root': {
                          fontSize: { xs: '0.875rem', sm: '1rem' }
                        }
                      }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                     
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  loading={loading}
                  disabled={loading || !selectedParent}
                  loadingText="Loading courses..."
                  noOptionsText={selectedParent ? "No courses found" : "Please select a parent first"}
                  clearOnBlur={false}
                  clearOnEscape
                  ListboxProps={{ 
                    style: { 
                      maxHeight: isMobile ? '150px' : '200px' 
                    } 
                  }}
                  popupIcon={<span style={{ fontSize: isMobile ? '0.8rem' : '1rem' }}>▼</span>}
                />
              </Grid>
            </Grid>
          </CardContent>
          
          {courseDropDown.length > 0 && selectedParent && (
            <Box sx={{ 
              p: { xs: 1, sm: 1.5, md: 2 }, 
              bgcolor: 'action.hover', 
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              overflowX: 'auto'  
            }}>
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={isMobile ? 0.75 : 1.5} 
                justifyContent={isMobile ? "flex-start" : "flex-end"}
                alignItems={isMobile ? "flex-start" : "center"}
                sx={{ minWidth: { xs: '100%', md: 'auto' } }}
              >
                <Chip 
                  label={`${courseDropDown.filter(c => c.isCourseAccess).length} Courses with Access`} 
                  color="success"
                  size="small"
                  variant="outlined"
                  sx={{ 
                    my: isMobile ? 0.5 : 0,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    height: { xs: '24px', sm: '32px' }
                  }}
                />
                <Chip 
                  label={`${courseDropDown.filter(c => c.isSeperateUserAccess).length} with Custom Config`} 
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{ 
                    my: isMobile ? 0.5 : 0,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    height: { xs: '24px', sm: '32px' }
                  }}
                />
                <Chip 
                  label={`${courseDropDown.length} Total Courses`} 
                  color="default"
                  size="small"
                  variant="outlined"
                  sx={{ 
                    my: isMobile ? 0.5 : 0,
                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                    height: { xs: '24px', sm: '32px' }
                  }}
                />
              </Stack>
            </Box>
          )}
        </Card>

        {/* Parent Course Access Toggle */}
        {selectedParent && selectedCourse && (
          <Card elevation={3} sx={{ mb: { xs: 2.5, sm: 3, md: 4 }, overflow: 'visible' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Stack 
                direction={isMobile ? "column" : "row"} 
                justifyContent="space-between" 
                alignItems={isMobile ? "flex-start" : "center"} 
                spacing={isMobile ? 1 : 0}
                sx={{ mb: { xs: 1.5, sm: 2 } }}
              >
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  1. Parent Course Access 
                </Typography>
                <Chip 
                  label={onlySelectedParent ? "Has Access" : "No Access"} 
                  color={onlySelectedParent ? "success" : "error"} 
                  variant="filled" 
                  sx={{ 
                    fontWeight: 'medium', 
                    mt: isMobile ? 0.5 : 0,
                    fontSize: { xs: '0.7rem', sm: '0.8rem' },
                    height: { xs: '28px', sm: '32px' }
                  }}
                />
              </Stack>
              
              {parentAccessError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 2,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {parentAccessError}
                </Alert>
              )}
              
              <Divider sx={{ mb: { xs: 1.5, sm: 2, md: 3 } }} />
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color={!onlySelectedParent ? "primary" : "error"}
                  onClick={AddParentToCourseAccess}
                  disabled={loading}
                  fullWidth={isMobile}
                  sx={{ 
                    px: { xs: 1.5, sm: 2, md: 3 }, 
                    py: { xs: 0.5, sm: 0.75, md: 1 },
                    borderRadius: 2,
                    boxShadow: 2,
                    fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' },
                    whiteSpace: 'nowrap'
                  }}
                  startIcon={loading ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : null}
                >
                  {!onlySelectedParent ? "Grant Access" : "Remove Access"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Configuration Options */}
        {selectedParent && selectedCourse && (
          <Card elevation={3}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
              <Stack 
                direction={isMobile ? "column" : "row"} 
                justifyContent="space-between" 
                alignItems={isMobile ? "flex-start" : "center"}
                spacing={isMobile ? 1 : 0}
                sx={{ mb: { xs: 1, sm: 1.5, md: 2 } }}
              >
                <Typography 
                  variant={isMobile ? "subtitle1" : "h6"} 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                >
                  2. Access Configuration
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={enableSeperateUserAccessForCourse}
                      onChange={() => setEnableSeperateUserAccessForCourse(!enableSeperateUserAccessForCourse)}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                      Enable Separate User Access
                    </Typography>
                  }
                  sx={{ 
                    mr: 0,
                    '& .MuiFormControlLabel-label': { 
                      fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } 
                    }
                  }}
                />
              </Stack>
              
              <Divider sx={{ mb: { xs: 1.5, sm: 2, md: 3 } }} />
              
              {(hasCourseAccessFile === "yes" || hasCourseAccessFile === "no") ? (
                <Box sx={{
                  border: enableSeperateUserAccessForCourse ? "1px solid #4caf50" : "1px solid #f44336",
                  borderRadius: "12px",
                  p: { xs: 1.5, sm: 2, md: 3 },
                  backgroundColor: enableSeperateUserAccessForCourse ? "rgba(76, 175, 80, 0.05)" : "rgba(244, 67, 54, 0.05)",
                  transition: "all 0.3s ease",
                }}>
                  <Grid container spacing={isMobile ? 1 : 2}>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={restrictStartDateChange}
                            onChange={() => setRestrictStartDateChange(!restrictStartDateChange)}
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                            Restrict Start Date Change
                          </Typography>
                        }
                        sx={{ 
                          '& .MuiFormControlLabel-label': { 
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } 
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={forcefullBuyCourse}
                            onChange={() => setForcefullBuyCourse(!forcefullBuyCourse)}
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                            Force Full Buy Course
                          </Typography>
                        }
                        sx={{ 
                          '& .MuiFormControlLabel-label': { 
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } 
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={stopSkipSet}
                            onChange={() => setStopSkipSet(!stopSkipSet)}
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                            Force Continuous Set Buy
                          </Typography>
                        }
                        sx={{ 
                          '& .MuiFormControlLabel-label': { 
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } 
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Divider sx={{ my: { xs: 0.75, sm: 1, md: 2 } }} />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={allowBackDateBuy}
                            onChange={() => setAllowBackDateBuy(!allowBackDateBuy)}
                            color="primary"
                            size={isMobile ? "small" : "medium"}
                          />
                        }
                        label={
                          <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                            Allow Back Date Buy
                          </Typography>
                        }
                        sx={{ 
                          '& .MuiFormControlLabel-label': { 
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } 
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={8}>
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
                        size={isMobile ? "small" : "medium"}
                        sx={{ 
                          '& .MuiInputBase-root': {
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          },
                          '& .MuiInputLabel-root': {
                            fontSize: { xs: '0.875rem', sm: '1rem' }
                          }
                        }}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Stack 
                        direction={isMobile ? "column" : "row"} 
                        spacing={isMobile ? 1 : 2} 
                        justifyContent="flex-end" 
                        sx={{ mt: { xs: 1.5, sm: 2, md: 3 } }}
                      >
                        {hasCourseAccessFile === "yes" && <Button
                          variant="outlined"
                          color="error"
                          onClick={DeleteOneUserOneCourseAccess}
                          disabled={loading}
                          fullWidth={isMobile}
                          sx={{ 
                            borderRadius: 2,
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' }
                          }}
                        >
                          Delete All Access
                        </Button>}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSave}
                          disabled={loading}
                          fullWidth={isMobile}
                          sx={{ 
                            px: { xs: 1.5, sm: 2, md: 3 }, 
                            borderRadius: 2,
                            boxShadow: 2,
                            fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' }
                          }}
                          startIcon={loading ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : null}
                        >
                          {loading ? "Saving..." : hasCourseAccessFile === "yes" ? "Update Configuration" : "Save Configuration"}
                        </Button>
                      </Stack>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  p: { xs: 2, sm: 3, md: 5 },
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  borderRadius: 2
                }}>
                  <Typography 
                    variant="body1" 
                    gutterBottom 
                    color="text.secondary" 
                    sx={{ 
                      mb: { xs: 1.5, sm: 2 },
                      textAlign: 'center',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    Not able to fetch Access Configuration
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={GetOneUserOneCourseAccess}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={isMobile ? 16 : 20} color="inherit" /> : null}
                    sx={{ 
                      borderRadius: 2,
                      fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' }
                    }}
                    fullWidth={isMobile}
                  >
                    Fetch Data ~ {hasCourseAccessFile}
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Success/Error Snackbars */}
        <Snackbar 
          open={saveSuccess} 
          autoHideDuration={4000} 
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
          sx={{ bottom: { xs: 16, sm: 24 } }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity="success" 
            variant="filled" 
            sx={{ 
              width: '100%',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            Configuration saved successfully!
          </Alert>
        </Snackbar>
        
        <Snackbar 
          open={saveError} 
          autoHideDuration={6000} 
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'bottom', horizontal: isMobile ? 'center' : 'right' }}
          sx={{ bottom: { xs: 16, sm: 24 } }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity="error" 
            variant="filled" 
            sx={{ 
              width: '100%',
              fontSize: { xs: '0.75rem', sm: '0.875rem' }
            }}
          >
            {error || "Error saving configuration. Please try again."}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ParentWiseView;
