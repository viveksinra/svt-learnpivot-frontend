import React, { useState, useEffect } from 'react';
import { formatDate, isValidDate } from '@/app/utils/dateUtils';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Box,
  LinearProgress,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Checkbox,
  Dialog,
  DialogContent,
  Card,
  CardContent,
  CardActions,
  Switch,
  FormControlLabel,
  Badge,
  Divider,
  Stack,
  TableSortLabel,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EmailIcon from '@mui/icons-material/Email';
import SendEmailParentReport from './SendEmailParentReport';
import InfoIcon from '@mui/icons-material/Info';
import GridViewIcon from '@mui/icons-material/GridView';
import TableViewIcon from '@mui/icons-material/TableView';

// Process data to add set purchase information
const processData = (data) => {
  return data.map(row => {
    // Sort date sets by earliest date
    const sortedDateSets = [...row.courseDateSets]
      .map((set, index) => ({
        ...set,
        originalIndex: index,
        earliestDate: set.dates.reduce((earliest, curr) => {
          return !earliest || new Date(curr.date) < new Date(earliest) 
            ? curr.date 
            : earliest;
        }, null)
      }))
      .sort((a, b) => new Date(a.earliestDate) - new Date(b.earliestDate));

    // Check if each set is purchased (at least one date purchased in set)
    const setsWithPurchaseStatus = sortedDateSets.map(set => ({
      ...set,
      isPurchased: set.dates.some(dateObj => dateObj.purchased)
    }));

    // Calculate total dates and total purchased dates
    const totalDates = row.courseDateSets.reduce(
      (total, set) => total + set.dates.length, 0
    );

    // Calculate purchase percentage
    const purchasePercentage = ((row.totalPurchasedDates / totalDates) * 100).toFixed(1);

    return {
      ...row,
      totalDates,
      purchasePercentage,
      sortedDateSets: setsWithPurchaseStatus
    };
  });
};

// Export data to CSV
const exportToCSV = (data) => {
  // Create headers
  const headers = [
    'Course Title',
    'Batch Time',
    'Parent Email',
    'Child Name',
    'Child Gender',
    'Child Year',
    'Purchased Classes',
    'Total Classes',
    'Purchase Percentage',
    'Set 1 Purchased',
    'Set 2 Purchased',
    'Set 3 Purchased'
  ];

  // Create rows
  const rows = data.map(row => {
    const setCols = [false, false, false]; // Default for 3 sets
    row.sortedDateSets.forEach((set, idx) => {
      if (idx < 3) {
        setCols[idx] = set.isPurchased;
      }
    });

    return [
      row.courseTitle,
      row.batchTime,
      row.parentEmail,
      row.childName || '',
      row.childGender || '',
      row.childYear || '',
      row.totalPurchasedDates,
      row.totalDates,
      row.purchasePercentage,
      setCols[0] ? 'Yes' : 'No',
      setCols[1] ? 'Yes' : 'No',
      setCols[2] ? 'Yes' : 'No'
    ];
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `course_parent_report_${new Date().toISOString().slice(0,10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Grid Item Component for Mobile View
const GridItem = ({ row, onSelectRow, isSelected, onToggleDetails }) => {
  return (
    <Card 
      sx={{ 
        mb: 2, 
        border: isSelected ? '2px solid #1976d2' : 'none',
        position: 'relative'
      }}
      variant="outlined"
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelectRow(row, e.target.checked)}
          />
        </Box>
        
        <Typography variant="h6" sx={{ mb: 1, pr: 4 }}>
          {row.courseTitle}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {row.batchTime}
        </Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Grid container spacing={1} sx={{ mb: 1 }}>
          <Grid item xs={12}>
            <Typography variant="body2">
              <strong>Parent:</strong> {row.parentEmail}
            </Typography>
            {row.firstName && (
              <Typography variant="body2">
                <strong>Name:</strong> {row.firstName} {row.lastName}
              </Typography>
            )}
          </Grid>
          
          {row.childName && (
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Child:</strong> {row.childName} 
                {row.childGender && row.childYear && (
                  <span> | {row.childGender} | {row.childYear}</span>
                )}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ my: 1 }} />
        
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="body2">
              <strong>Classes:</strong> {row.totalPurchasedDates}/{row.totalDates}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={parseFloat(row.purchasePercentage)}
                sx={{ flexGrow: 1 }}
              />
              <Typography variant="body2">{row.purchasePercentage}%</Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Set Status:</strong></Typography>
          <Stack direction="row" spacing={0.5} flexWrap="wrap">
            {row.sortedDateSets.map((set, idx) => (
              <Chip
                key={idx}
                label={`Set ${idx + 1}: ${set.isPurchased ? "✓" : "✕"}`}
                color={set.isPurchased ? "success" : "default"}
                size="small"
                sx={{ my: 0.2 }}
              />
            ))}
          </Stack>
        </Box>
      </CardContent>
      
      <CardActions>
        <Button 
          size="small" 
          startIcon={<InfoIcon />}
          onClick={() => onToggleDetails(row)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

const Row = ({ row, onSelectRow, isSelected }) => {
  const [open, setOpen] = useState(false);

  const renderSetStatus = (set, index) => {
    return (
      <Chip
        label={`Set ${index + 1}: ${set.isPurchased ? "Purchased" : "Not Purchased"}`}
        color={set.isPurchased ? "success" : "default"}
        size="small"
        sx={{ margin: '2px' }}
      />
    );
  };

  const renderDateStatus = (dateObj) => {
    if (!dateObj || !isValidDate(dateObj.date)) {
      return (
        <Chip
          label="Invalid Date"
          color="error"
          size="small"
        />
      );
    }

    return (
      <Chip
        label={dateObj.purchased ? "Purchased" : "Not Purchased"}
        color={dateObj.purchased ? "success" : "default"}
        size="small"
      />
    );
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelectRow(row, e.target.checked)}
          />
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="subtitle1">{row.courseTitle}</Typography>
          <Typography variant="caption" color="textSecondary">
            {row.batchTime}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{row.parentEmail}</Typography>
          {row.firstName && (
            <Typography variant="caption" color="textSecondary" display="block">
              {row.firstName} {row.lastName}
            </Typography>
          )}
        </TableCell>
        <TableCell>
          {row.childName && (
            <>
              <Typography variant="body2">{row.childName}</Typography>
              {row.childGender && row.childYear && (
                <Typography variant="caption" color="textSecondary">
                  {row.childGender} | {row.childYear}
                </Typography>
              )}
            </>
          )}
        </TableCell>
        <TableCell align="center">{row.totalPurchasedDates}</TableCell>
        <TableCell align="center">{row.totalDates}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LinearProgress
              variant="determinate"
              value={parseFloat(row.purchasePercentage)}
              sx={{ width: 100 }}
            />
            <Typography variant="body2">{row.purchasePercentage}%</Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {row.sortedDateSets.map((set, idx) => renderSetStatus(set, idx))}
          </Box>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Class Dates
              </Typography>
              <Grid container spacing={2}>
                {row.sortedDateSets.map((set, setIndex) => (
                  <Grid item xs={12} md={4} key={setIndex}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                        Set {setIndex + 1} {set.isPurchased ? "(Purchased)" : "(Not Purchased)"}
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {set.dates.map((dateObj, dateIndex) => (
                            <TableRow key={dateIndex}>
                              <TableCell>
                                {formatDate(dateObj.date)}
                              </TableCell>
                              <TableCell>
                                {renderDateStatus(dateObj)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CourseParentTable = ({ data: initialData, courseDropDown = [], isMobile }) => {
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [setPurchaseFilter, setSetPurchaseFilter] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState("all");
  const [viewMode, setViewMode] = useState(isMobile ? "grid" : "table");
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedRowForDetails, setSelectedRowForDetails] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const processed = processData(initialData);
    setProcessedData(processed);
    setFilteredData(processed);
  }, [initialData]);

  useEffect(() => {
    setViewMode(isMobile ? "grid" : "table");
  }, [isMobile]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, setPurchaseFilter, courseFilter, sortConfig);
  };

  const handleSetFilter = (e) => {
    const filters = e.target.value;
    setSetPurchaseFilter(filters);
    applyFilters(searchTerm, filters, courseFilter, sortConfig);
  };

  const handleCourseFilter = (e) => {
    const filter = e.target.value;
    setCourseFilter(filter);
    applyFilters(searchTerm, setPurchaseFilter, filter, sortConfig);
  };

  const sortData = (data, sortCfg) => {
    if (!sortCfg || !sortCfg.key) return data;

    const { key, direction } = sortCfg;

    return [...data].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === 'purchasePercentage') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const applyFilters = (term, setFilters, course, sortCfg = sortConfig) => {
    let filtered = processedData;

    if (term) {
      const lowercaseTerm = term.toLowerCase();
      filtered = filtered.filter(row =>
        row.courseTitle.toLowerCase().includes(lowercaseTerm) ||
        row.parentEmail.toLowerCase().includes(lowercaseTerm) ||
        row.batchTime.toLowerCase().includes(lowercaseTerm) ||
        (row.childName && row.childName.toLowerCase().includes(lowercaseTerm)) ||
        (row.childGender && row.childGender.toLowerCase().includes(lowercaseTerm)) ||
        (row.childYear && row.childYear.toString().toLowerCase().includes(lowercaseTerm))
      );
    }

    if (setFilters.length > 0 && !setFilters.includes("all")) {
      filtered = filtered.filter(row => {
        return setFilters.some(filter => {
          const [setIndex, purchaseStatus] = filter.split('-');
          const idx = parseInt(setIndex) - 1;
          const isPurchased = purchaseStatus === 'purchased';

          if (row.sortedDateSets.length <= idx) return false;
          return row.sortedDateSets[idx].isPurchased === isPurchased;
        });
      });
    }
    
    if (course !== "all") {
      filtered = filtered.filter(row => row.courseTitle === course);
    } else {
      filtered = filtered;
    }

    const sorted = sortData(filtered, sortCfg);
    setFilteredData(sorted);
  };

  const handleSelectRow = (row, isSelected) => {
    setSelectedRows(prev => {
      if (isSelected) {
        return [...prev, row];
      }
      return prev.filter(item => item !== row);
    });
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedRows(filteredData);
    } else {
      setSelectedRows([]);
    }
  };

  const isAllSelected = filteredData.length > 0 && selectedRows.length === filteredData.length;

  const handleSendEmail = () => {
    if (selectedRows.length > 0) {
      setEmailDialogOpen(true);
    }
  };

  const handleToggleViewMode = () => {
    setViewMode(prev => prev === "table" ? "grid" : "table");
  };

  const handleToggleDetails = (row) => {
    setSelectedRowForDetails(row);
    setDetailsDialogOpen(true);
  };

  const renderDateDetails = (row) => {
    if (!row) return null;
    
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="h6" gutterBottom>
          {row.courseTitle} - {row.batchTime}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {row.parentEmail}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {row.sortedDateSets.map((set, setIndex) => (
            <Grid item xs={12} sm={6} md={4} key={setIndex}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Set {setIndex + 1} {set.isPurchased ? "(Purchased)" : "(Not Purchased)"}
                </Typography>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {set.dates.map((dateObj, dateIndex) => (
                      <TableRow key={dateIndex}>
                        <TableCell>
                          {formatDate(dateObj.date)}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={dateObj.purchased ? "Purchased" : "Not Purchased"}
                            color={dateObj.purchased ? "success" : "default"}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </Box>
      </Box>
    );
  };

  const handleSort = (key) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
    const newSortConfig = { key, direction: isAsc ? 'desc' : 'asc' };
    setSortConfig(newSortConfig);
    applyFilters(searchTerm, setPurchaseFilter, courseFilter, newSortConfig);
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Parent Course Report
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Badge badgeContent={selectedRows.length} color="primary" sx={{ mr: 1 }}>
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={handleSendEmail}
              disabled={selectedRows.length === 0}
              size={isMobile ? "small" : "medium"}
            >
              Send Email
            </Button>
          </Badge>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => exportToCSV(filteredData)}
            size={isMobile ? "small" : "medium"}
          >
            Export CSV
          </Button>
          {!isMobile && (
            <IconButton 
              onClick={handleToggleViewMode}
              color="primary"
            >
              {viewMode === "table" ? <GridViewIcon /> : <TableViewIcon />}
            </IconButton>
          )}
        </Box>
      </Box>

      <Box sx={{ 
        mb: 3, 
        display: 'flex', 
        gap: 1, 
        flexDirection: isMobile ? 'column' : 'row',
        flexWrap: isMobile ? 'nowrap' : 'wrap' 
      }}>
        <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : '200px' }}>
          <InputLabel>Filter by Course</InputLabel>
          <Select
            value={courseFilter}
            onChange={handleCourseFilter}
            label="Filter by Course"
          >
            <MenuItem value="all">All Courses</MenuItem>
            {courseDropDown.map((course) => (
              <MenuItem key={course.courseLink} value={course.courseTitle}>
                {course.courseTitle}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: isMobile ? '100%' : '200px' }}>
          <InputLabel>Filter by Set</InputLabel>
          <Select
            multiple
            value={setPurchaseFilter}
            onChange={handleSetFilter}
            label="Filter by Set"
            renderValue={(selected) => {
              if (selected.length === 0) {
                return 'All Sets';
              }
              return selected.map(value => {
                const [setNum, status] = value.split('-');
                return `Set ${setNum} - ${status === 'purchased' ? 'Purchased' : 'Not Purchased'}`;
              }).join(', ');
            }}
          >
            <MenuItem value="all">All Sets</MenuItem>
            <MenuItem value="1-purchased">Set 1 - Purchased</MenuItem>
            <MenuItem value="1-not">Set 1 - Not Purchased</MenuItem>
            <MenuItem value="2-purchased">Set 2 - Purchased</MenuItem>
            <MenuItem value="2-not">Set 2 - Not Purchased</MenuItem>
            <MenuItem value="3-purchased">Set 3 - Purchased</MenuItem>
            <MenuItem value="3-not">Set 3 - Not Purchased</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ minWidth: isMobile ? '100%' : '250px' }}
        />
        {!isMobile && (
          <FormControlLabel
            control={
              <Switch 
                checked={viewMode === "grid"} 
                onChange={handleToggleViewMode} 
              />
            }
            label={viewMode === "grid" ? "Grid View" : "Table View"}
          />
        )}
      </Box>

      {viewMode === "table" ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Course Details</TableCell>
                <TableCell>Parent Info</TableCell>
                <TableCell>Child Info</TableCell>
                <TableCell align="center">
                  <TableSortLabel
                    active={sortConfig.key === 'totalPurchasedDates'}
                    direction={sortConfig.key === 'totalPurchasedDates' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('totalPurchasedDates')}
                  >
                    Purchased Classes
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">Total Classes</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'purchasePercentage'}
                    direction={sortConfig.key === 'purchasePercentage' ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort('purchasePercentage')}
                  >
                    Progress
                  </TableSortLabel>
                </TableCell>
                <TableCell>Set Status</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <Row 
                    key={index} 
                    row={row} 
                    onSelectRow={handleSelectRow}
                    isSelected={selectedRows.includes(row)}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No data found matching your filters
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            {filteredData.length > 0 && (
              <Button 
                size="small" 
                onClick={handleSelectAll}
                variant="outlined"
              >
                {isAllSelected ? "Deselect All" : "Select All"}
              </Button>
            )}
            <Typography variant="body2" color="text.secondary">
              {filteredData.length} item{filteredData.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <GridItem 
                    row={row} 
                    onSelectRow={handleSelectRow}
                    isSelected={selectedRows.includes(row)}
                    onToggleDetails={handleToggleDetails}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1">
                    No data found matching your filters
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      <Dialog
        open={emailDialogOpen}
        onClose={() => setEmailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <SendEmailParentReport
            selectedItems={selectedRows.map(row => ({
              user: {
                email: row.parentEmail,
                firstName: row.firstName || row.parentEmail.split('@')[0],
                lastName: row.lastName || '',
                _id: row.parentId || row._id
              },
              childId: {
                childName: row.childName || 'Student',
                childGender: row.childGender || '',
                childYear: row.childYear || ''
              },
              courseId: {
                courseTitle: row.courseTitle,
                courseLink: row.courseLink || '',
                batchTime: row.batchTime || ''
              },
              selectedDates: row.sortedDateSets.flatMap(set => 
                set.dates.filter(d => d.purchased).map(d => formatDate(d.date))
              )
            }))}
            setId={() => setEmailDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {renderDateDetails(selectedRowForDetails)}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CourseParentTable;