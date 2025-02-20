import React, { useState } from 'react';
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
  LinearProgress
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const Row = ({ row }) => {
  const [open, setOpen] = useState(false);

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
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Class Dates
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.courseDateSets.map((set, setIndex) =>
                    set.dates.map((dateObj, dateIndex) => (
                      <TableRow key={`${setIndex}-${dateIndex}`}>
                        <TableCell>
                          {formatDate(dateObj.date)}
                        </TableCell>
                        <TableCell>
                          {renderDateStatus(dateObj)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CourseParentTable = ({ data }) => {
  return (
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
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <Row key={index} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CourseParentTable;
