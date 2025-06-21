"use client"
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
  Alert,
  Stack,
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  IconButton,
  Collapse,
  Paper,
  CircularProgress,
  Snackbar
} from "@mui/material";
import { ExpandMore, ExpandLess, Person, Email, Phone } from '@mui/icons-material';
import { myCourseService } from "@/app/services";

const CourseWiseView = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [courseList, setCourseList] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [accessData, setAccessData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedUsers, setExpandedUsers] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(false);

  /* -------------------------------- Courses -------------------------------- */
  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      const response = await myCourseService.publicGetAll({ sortBy: "newToOld", page: 0, rowsPerPage: 1000, searchText: "", totalCount: 0 });
      if (response.variant === "success") {
        setCourseList(response.data || []);
      } else {
        setError(response.message || "Failed to fetch courses");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  /* ----------------------------- Parent Access Data ----------------------------- */
  const fetchCourseAccessData = async (courseId) => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await myCourseService.GetAllUserOfCourseWithAccessApi({ courseId });
      if (res.variant === "success") {
        setCourseData(res.data.course);
        setAccessData(res.data.accessData || []);
      } else {
        setError(res.message || "Failed to fetch course access data");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching course access data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseAccessData(selectedCourse._id);
    } else {
      setCourseData(null);
      setAccessData([]);
    }
  }, [selectedCourse]);

  /* ----------------------------- User Config Updates ----------------------------- */
  const updateUserConfig = (userId, field, value) => {
    setAccessData(prev => prev.map(user => 
      user.userId === userId ? { ...user, [field]: value } : user
    ));
  };

  const grantOrRemoveAccess = async (user) => {
    if (!selectedCourse || !user.userId) return;
    
    setLoading(true);
    try {
      const data = {
        userId: user.userId,
        courseId: selectedCourse._id,
        addOrRemove: user.isSelectedUser ? "remove" : "add"
      };

      const res = await myCourseService.addParentToCourseAccessApi(data);
      if (res.variant === "success") {
        setSaveSuccess(true);
        fetchCourseAccessData(selectedCourse._id);
      } else {
        setError(res.message || "Failed to update parent course access");
        setSaveError(true);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating parent course access");
      setSaveError(true);
    } finally {
      setLoading(false);
    }
  };

  const saveUserConfig = async (user) => {
    if (!selectedCourse || !user.userId) return;
    
    setLoading(true);
    try {
      const dataToSave = {
        userId: user.userId,
        courseId: selectedCourse._id,
        restrictStartDateChange: user.restrictStartDateChange || false,
        forcefullBuyCourse: user.forcefullBuyCourse || false,
        stopSkipSet: user.stopSkipSet || false,
        allowBackDateBuy: user.allowBackDateBuy || false,
        enableSeperateUserAccessForCourse: user.enableSeperateUserAccessForCourse || false,
        backDayCount: parseInt(user.backDayCount) || 0,
        restrictOnTotalSeat: user.restrictOnTotalSeat || false,
        totalSeat: parseInt(user.totalSeat) || 0
      };

      const res = await myCourseService.SaveOrUpdateOneCourseAccessApi(dataToSave);
      if (res.variant === "success") {
        setSaveSuccess(true);
        fetchCourseAccessData(selectedCourse._id);
      } else {
        setError(res.message || "Failed to save configuration");
        setSaveError(true);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while saving configuration");
      setSaveError(true);
    } finally {
      setLoading(false);
    }
  };

  const removeUserAccess = async (user) => {
    if (!selectedCourse || !user.userId) return;
    
    setLoading(true);
    try {
      const res = await myCourseService.DeleteOneUserOneCourseAccessApi({ 
        courseId: selectedCourse._id, 
        userId: user.userId 
      });
      if (res.variant === "success") {
        setSaveSuccess(true);
        fetchCourseAccessData(selectedCourse._id);
      } else {
        setError(res.message || "Failed to remove access");
        setSaveError(true);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while removing access");
      setSaveError(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUsers(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') return;
    setSaveSuccess(false);
    setSaveError(false);
  };

  /* --------------------------------- Stats --------------------------------- */
  const totalUsers = accessData.length;
  const usersWithCustomConfig = accessData.filter(user => user._id || user.enableSeperateUserAccessForCourse).length;
  const regularAccessUsers = accessData.filter(user => !user._id && !user.enableSeperateUserAccessForCourse).length;

  return (
    <Container maxWidth="lg" sx={{ px: { xs: 1.5, sm: 2, md: 3 }, overflow: 'hidden' }}>
      <Box sx={{ py: { xs: 2, sm: 2.5, md: 3, lg: 4 } }}>
        {/* Course Selector */}
        <Card elevation={3} sx={{ mb: { xs: 2.5, sm: 3, md: 4 }, overflow: 'visible' }}>
          <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Typography 
              variant={isMobile ? "subtitle1" : "h6"} 
              gutterBottom 
              color="text.secondary" 
              sx={{ mb: { xs: 1.5, sm: 2, md: 3 } }}
            >
              Select Course
            </Typography>
            <Grid container spacing={isMobile ? 1.5 : 2.5}>
              <Grid item xs={12} md={4}>
                <TextField
                  select
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                  label="Course"
                  value={selectedCourse ? selectedCourse._id : ''}
                  onChange={(e) => {
                    const selected = courseList.find(c => c._id === e.target.value);
                    setSelectedCourse(selected || null);
                  }}
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  size={isMobile ? 'small' : 'medium'}
                  sx={{ '& .MuiInputBase-root': { fontSize: { xs: '0.875rem', sm: '1rem' } } }}
                >
                  <option value="">Select a course</option>
                  {courseList.map(course => (
                    <option key={course._id} value={course._id}>{course.courseTitle}</option>
                  ))}
                </TextField>
              </Grid>

              {courseData && (
                <Grid item xs={12} md={8}>
                  <Stack direction={isMobile ? 'column' : 'row'} spacing={1} alignItems={isMobile ? 'flex-start' : 'flex-end'}>
                    <Chip label={`${totalUsers} Total Parents`} color="default" variant="outlined" size="small" />
                    <Chip label={`${usersWithCustomConfig} Custom Config`} color="primary" variant="outlined" size="small" />
                    <Chip label={`${regularAccessUsers} Regular Access`} color="success" variant="outlined" size="small" />
                  </Stack>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        {/* Course Info */}
        {courseData && (
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography variant="h6" gutterBottom>{courseData.courseTitle}</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Chip label={courseData.courseClass?.label || 'N/A'} color="info" size="small" />
                <Chip label={courseData.courseType?.label || 'N/A'} color="secondary" size="small" />
                <Chip 
                  label={courseData.onlySelectedParent ? "Restricted Access" : "Open Access"} 
                  color={courseData.onlySelectedParent ? "warning" : "success"} 
                  size="small" 
                />
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* User Access List */}
        {accessData.length > 0 && (
          <Stack spacing={3}>
            {accessData.map((user) => (
              <Card key={user.userId} elevation={3}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
                  {/* User Header - Clickable */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      p: 1,
                      borderRadius: 1,
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => toggleUserExpansion(user.userId)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" />
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Stack direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 0.5 : 2} sx={{ mt: 0.5 }}>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Email fontSize="small" />
                            {user.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Phone fontSize="small" />
                            {user.mobile}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      {/* Configuration Chips */}
                      {user._id ? (
                        <Chip label="Custom Config" color="primary" size="small" />
                      ) : (
                        <Chip label="Regular Access" color="success" size="small" />
                      )}
                      
                      {/* Show config chips when collapsed */}
                      {!expandedUsers[user.userId] && (
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {user.restrictStartDateChange && <Chip label="Restrict Date" color="warning" size="small" variant="outlined" />}
                          {user.forcefullBuyCourse && <Chip label="Force Buy" color="error" size="small" variant="outlined" />}
                          {user.stopSkipSet && <Chip label="Continuous" color="info" size="small" variant="outlined" />}
                          {user.allowBackDateBuy && <Chip label={`Back ${user.backDayCount || 0}d`} color="secondary" size="small" variant="outlined" />}
                          {user.restrictOnTotalSeat && <Chip label={`Seat ${user.totalSeat || 0}`} color="default" size="small" variant="outlined" />}
                        </Stack>
                      )}
                      
                      <IconButton size="small">
                        {expandedUsers[user.userId] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Expandable Configuration - Same style as ParentWiseView */}
                  <Collapse in={expandedUsers[user.userId]}>
                    <Divider sx={{ mb: { xs: 1.5, sm: 2, md: 3 } }} />
                    
                    {/* Parent Course Access Section */}
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
                            label={user.isSelectedUser ? "Has Access" : "No Access"} 
                            color={user.isSelectedUser ? "success" : "error"} 
                            variant="filled" 
                            sx={{ 
                              fontWeight: 'medium', 
                              mt: isMobile ? 0.5 : 0,
                              fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              height: { xs: '28px', sm: '32px' }
                            }}
                          />
                        </Stack>
                        
                        <Divider sx={{ mb: { xs: 1.5, sm: 2, md: 3 } }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            variant="contained"
                            color={user.isSelectedUser ? "error" : "primary"}
                            onClick={() => grantOrRemoveAccess(user)}
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
                            {user.isSelectedUser ? "Remove Access" : "Grant Access"}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                    
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      color="text.secondary"
                      sx={{ mb: { xs: 1, sm: 1.5, md: 2 } }}
                    >
                      2. Access Configuration
                    </Typography>
                    
                    <Box sx={{
                      border: user.enableSeperateUserAccessForCourse ? "1px solid #4caf50" : "1px solid #f44336",
                      borderRadius: "12px",
                      p: { xs: 1.5, sm: 2, md: 3 },
                      backgroundColor: user.enableSeperateUserAccessForCourse ? "rgba(76, 175, 80, 0.05)" : "rgba(244, 67, 54, 0.05)",
                      transition: "all 0.3s ease",
                    }}>
                      <Grid container spacing={isMobile ? 1 : 2}>
                        <Grid item xs={12}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={user.enableSeperateUserAccessForCourse || false}
                                onChange={(e) => updateUserConfig(user.userId, 'enableSeperateUserAccessForCourse', e.target.checked)}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                                Enable Separate User Access
                              </Typography>
                            }
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={user.restrictStartDateChange || false}
                                onChange={(e) => updateUserConfig(user.userId, 'restrictStartDateChange', e.target.checked)}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                                Restrict Start Date Change
                              </Typography>
                            }
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={user.forcefullBuyCourse || false}
                                onChange={(e) => updateUserConfig(user.userId, 'forcefullBuyCourse', e.target.checked)}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                                Force Full Buy Course
                              </Typography>
                            }
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={user.stopSkipSet || false}
                                onChange={(e) => updateUserConfig(user.userId, 'stopSkipSet', e.target.checked)}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                                Force Continuous Set Buy
                              </Typography>
                            }
                          />
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Divider sx={{ my: { xs: 0.75, sm: 1, md: 2 } }} />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={user.allowBackDateBuy || false}
                                onChange={(e) => updateUserConfig(user.userId, 'allowBackDateBuy', e.target.checked)}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                                Allow Back Date Buy
                              </Typography>
                            }
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={8}>
                          <TextField
                            fullWidth
                            label="Back Days"
                            type="number"
                            value={user.backDayCount || 0}
                            onChange={(e) => {
                              const value = Math.max(0, parseInt(e.target.value) || 0);
                              updateUserConfig(user.userId, 'backDayCount', value);
                            }}
                            inputProps={{ min: "0", step: "1" }}
                            variant="outlined"
                            disabled={!user.allowBackDateBuy}
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
                        
                        <Grid item xs={12} sm={6} md={4}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={user.restrictOnTotalSeat || false}
                                onChange={(e) => updateUserConfig(user.userId, 'restrictOnTotalSeat', e.target.checked)}
                                color="primary"
                                size={isMobile ? "small" : "medium"}
                              />
                            }
                            label={
                              <Typography sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' } }}>
                                Restrict Total Seat
                              </Typography>
                            }
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={6} md={8}>
                          <TextField
                            fullWidth
                            label="Total Seat"
                            type="number"
                            value={user.totalSeat || 0}
                            onChange={(e) => {
                              const value = Math.max(0, parseInt(e.target.value) || 0);
                              updateUserConfig(user.userId, 'totalSeat', value);
                            }}
                            inputProps={{ min: "0", step: "1" }}
                            variant="outlined"
                            disabled={!user.restrictOnTotalSeat}
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
                            {user._id && (
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => removeUserAccess(user)}
                                disabled={loading}
                                fullWidth={isMobile}
                                sx={{ 
                                  borderRadius: 2,
                                  fontSize: { xs: '0.8rem', sm: '0.875rem', md: '1rem' }
                                }}
                              >
                                Delete All Access
                              </Button>
                            )}
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => saveUserConfig(user)}
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
                              {loading ? "Saving..." : user._id ? "Update Configuration" : "Save Configuration"}
                            </Button>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        {/* No Data Message */}
        {selectedCourse && accessData.length === 0 && !loading && (
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No parents have access to this course
              </Typography>
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

export default CourseWiseView;