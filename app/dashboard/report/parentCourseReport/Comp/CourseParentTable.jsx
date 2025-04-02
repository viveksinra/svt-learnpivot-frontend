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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EmailIcon from '@mui/icons-material/Email';
import SendEmailParentReport from './SendEmailParentReport';

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

const CourseParentTable = ({ data: initialData, courseDropDown = [] }) => {
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [setPurchaseFilter, setSetPurchaseFilter] = useState("all");
  const [selectedRows, setSelectedRows] = useState([]);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [courseFilter, setCourseFilter] = useState("all");

  useEffect(() => {
    const processed = processData(initialData);
    setProcessedData(processed);
    setFilteredData(processed);
  }, [initialData]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, setPurchaseFilter, courseFilter);
  };

  const handleSetFilter = (e) => {
    const filter = e.target.value;
    setSetPurchaseFilter(filter);
    applyFilters(searchTerm, filter, courseFilter);
  };

  const handleCourseFilter = (e) => {
    const filter = e.target.value;
    setCourseFilter(filter);
    applyFilters(searchTerm, setPurchaseFilter, filter);
  };

  const applyFilters = (term, setFilter, course) => {
    let filtered = processedData;

    // Apply search term filter
    if (term) {
      const lowercaseTerm = term.toLowerCase();
      filtered = filtered.filter(row =>
        row.courseTitle.toLowerCase().includes(lowercaseTerm) ||
        row.parentEmail.toLowerCase().includes(lowercaseTerm) ||
        row.batchTime.toLowerCase().includes(lowercaseTerm)
      );
    }

    // Apply set purchase filter
    if (setFilter !== "all") {
      const [setIndex, purchaseStatus] = setFilter.split('-');
      const idx = parseInt(setIndex) - 1;
      const isPurchased = purchaseStatus === 'purchased';

      filtered = filtered.filter(row => {
        if (row.sortedDateSets.length <= idx) return false;
        return row.sortedDateSets[idx].isPurchased === isPurchased;
      });
    }
    // Apply course filter
    if (course !== "all") {
      filtered = filtered.filter(row => row.courseTitle === course);
    } else {
      filtered = filtered;
    }

    setFilteredData(filtered);
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<EmailIcon />}
            onClick={handleSendEmail}
            disabled={selectedRows.length === 0}
          >
            Send Email ({selectedRows.length})
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={() => exportToCSV(filteredData)}
          >
            Export to CSV
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>

        <FormControl size="small" sx={{ minWidth: '200px' }}>
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
        <FormControl size="small" sx={{ minWidth: '200px' }}>
          <InputLabel>Filter by Set</InputLabel>
          <Select
            value={setPurchaseFilter}
            onChange={handleSetFilter}
            label="Filter by Set"
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
          sx={{ minWidth: '250px' }}
        />
      </Box>

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
              <TableCell align="center">Purchased Classes</TableCell>
              <TableCell align="center">Total Classes</TableCell>
              <TableCell>Progress</TableCell>
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
              ) // Only include purchased dates
            }))}
            setId={() => setEmailDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CourseParentTable;