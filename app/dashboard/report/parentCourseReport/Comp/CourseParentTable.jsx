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
  Grid
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

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

const Row = ({ row }) => {
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
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <Typography variant="subtitle1">{row.courseTitle}</Typography>
          <Typography variant="caption" color="textSecondary">
            {row.batchTime}
          </Typography>
        </TableCell>
        <TableCell>{row.parentEmail}</TableCell>
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
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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

const CourseParentTable = ({ data: initialData }) => {
  const [processedData, setProcessedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [setPurchaseFilter, setSetPurchaseFilter] = useState("all");

  useEffect(() => {
    const processed = processData(initialData);
    setProcessedData(processed);
    setFilteredData(processed);
  }, [initialData]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, setPurchaseFilter);
  };

  const handleSetFilter = (e) => {
    const filter = e.target.value;
    setSetPurchaseFilter(filter);
    applyFilters(searchTerm, filter);
  };

  const applyFilters = (term, setFilter) => {
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

    setFilteredData(filtered);
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
          Course Parent Report
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
        <TextField
          label="Search"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{ minWidth: '250px' }}
        />
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
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Course Details</TableCell>
              <TableCell>Parent Email</TableCell>
              <TableCell align="center">Purchased Classes</TableCell>
              <TableCell align="center">Total Classes</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Set Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <Row key={index} row={row} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    No data found matching your filters
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CourseParentTable;