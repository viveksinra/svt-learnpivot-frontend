'use client';
import React, { useEffect, useState } from 'react';
import { myCourseService } from '@/app/services';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Snackbar,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Divider,
  TextField,
  IconButton,
  Autocomplete,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { MdOutlineClose, MdFileDownload } from 'react-icons/md';

const statusTabs = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' }
];

export default function CourseWaitingListAdmin() {
  const [status, setStatus] = useState('pending');
  const [rows, setRows] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("dateDesc");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snack, setSnack] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchAllCourses = async () => {
    const resp = await myCourseService.publicGetAll({ page: 0, rowsPerPage: 1000, sortBy: "newToOld", searchText: "" });
    if (resp.variant === "success") setCourses(resp.data);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { status, sort: sortBy };
      if (selectedCourse) params.courseId = selectedCourse._id;
      if (debouncedSearch) params.search = debouncedSearch;
      const res = await myCourseService.adminGetWaitingList(params);
      if (res.variant === 'success') {
        setRows(res.data);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllCourses(); }, []);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchText), 500);
    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    fetchData();
  }, [status, selectedCourse, debouncedSearch, sortBy]);

  const handleAction = async (entryId, newStatus) => {
    try {
      const res = await myCourseService.adminUpdateWaitingStatus({ entryId, status: newStatus });
      setSnack({ message: res.message, severity: res.variant });
      fetchData();
    } catch (err) {
      setSnack({ message: 'Operation failed', severity: 'error' });
    }
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const exportToCSV = () => {
    if (rows.length === 0) {
      setSnack({ message: 'No data to export', severity: 'warning' });
      return;
    }

    // Create CSV headers
    const headers = [
      'Course Title',
      'Parent Name', 
      'Email',
      'Mobile',
      'Child Name',
      'Date',
      'Status'
    ];

    // Convert data to CSV format
    const csvData = rows.map(row => [
      row.courseId?.courseTitle || '',
      `${row.user?.firstName || ''} ${row.user?.lastName || ''}`.trim(),
      row.user?.email || '',
      row.user?.mobile || '',
      row.childId ? row.childId.childName : (row.children?.join(', ') || ''),
      formatDate(row.date),
      status.charAt(0).toUpperCase() + status.slice(1) // Capitalize first letter
    ]);

    // Combine headers and data
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // Generate filename with status and timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const courseName = selectedCourse ? `_${selectedCourse.courseTitle.replace(/[^a-zA-Z0-9]/g, '_')}` : '';
    link.setAttribute('download', `course_waiting_list_${status}${courseName}_${timestamp}.csv`);
    
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setSnack({ message: 'Export completed successfully', severity: 'success' });
  };

  return (
    <Box sx={{ p: 2, pb: 60 }}>
      <Typography variant="h5" color="primary" gutterBottom>
        Course Waiting List
      </Typography>
      <Tabs
        value={status}
        onChange={(e, v) => setStatus(v)}
        sx={{ mb: 2 }}
        variant="scrollable"
      >
        {statusTabs.map(t => (
          <Tab key={t.value} label={t.label} value={t.value} />
        ))}
      </Tabs>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Autocomplete
          sx={{ minWidth: 200 }}
          size="small"
          options={courses}
          getOptionLabel={(o) => o.courseTitle}
          value={selectedCourse}
          onChange={(e, v) => setSelectedCourse(v)}
          renderInput={(params) => <TextField {...params} label="Filter by Course" variant="outlined" />}
        />

        <TextField
          label="Search"
          size="small"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton size="small" sx={{ display: searchText ? 'block' : 'none' }} onClick={() => setSearchText('')}>
                <MdOutlineClose />
              </IconButton>
            ),
          }}
        />

        <FormControl size="small">
          <InputLabel id="sort-label">Sort</InputLabel>
          <Select labelId="sort-label" value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
            <MenuItem value="dateDesc">Newest First</MenuItem>
            <MenuItem value="dateAsc">Oldest First</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          startIcon={<MdFileDownload />}
          onClick={exportToCSV}
          disabled={loading || rows.length === 0}
          sx={{ minWidth: 120 }}
        >
          Export
        </Button>
      </Box>

      {loading ? (
        <Box className="center" sx={{ p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : rows.length === 0 ? (
        <Alert severity="info">No {status} requests.</Alert>
      ) : (
        isMobile ? (
          <Box>
            {rows.map(r => (
              <Card key={r._id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>{r.courseId?.courseTitle}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Parent: {r.user?.firstName} {r.user?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {r.childId ? `Child: ${r.childId.childName}` : r.children?.length ? `Children: ${r.children.join(', ')}` : 'Children: -'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(r.date)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {r.user?.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mobile: {r.user?.mobile || '-'}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  {status === 'pending' && (
                    <Stack direction="row" spacing={1}>
                      <Button size="small" fullWidth color="success" variant="contained" onClick={() => handleAction(r._id, 'accepted')}>Accept</Button>
                      <Button size="small" fullWidth color="error" variant="outlined" onClick={() => handleAction(r._id, 'rejected')}>Reject</Button>
                    </Stack>
                  )}
                  {status === 'accepted' && (
                    <Stack direction="row" spacing={1}>
                      <Button size="small" fullWidth variant="outlined" onClick={() => handleAction(r._id, 'pending')}>Move to Pending</Button>
                      <Button size="small" fullWidth color="error" variant="outlined" onClick={() => handleAction(r._id, 'rejected')}>Reject</Button>
                    </Stack>
                  )}
                  {status === 'rejected' && (
                    <Stack direction="row" spacing={1}>
                      <Button size="small" fullWidth variant="outlined" onClick={() => handleAction(r._id, 'pending')}>Move to Pending</Button>
                      <Button size="small" fullWidth color="success" variant="contained" onClick={() => handleAction(r._id, 'accepted')}>Accept</Button>
                    </Stack>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Parent</TableCell>
                <TableCell>Child</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                {(status === 'pending' || status === 'accepted' || status === 'rejected') && <TableCell>Action</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r => (
                <TableRow key={r._id}>
                  <TableCell>{r.courseId?.courseTitle}</TableCell>
                  <TableCell>{`${r.user?.firstName} ${r.user?.lastName}`}</TableCell>
                  <TableCell>{r.childId ? r.childId.childName : (r.children?.join(', ') || '-')}</TableCell>
                  <TableCell>{formatDate(r.date)}</TableCell>
                  <TableCell>{r.user?.email}</TableCell>
                  <TableCell>{r.user?.mobile || '-'}</TableCell>
                  <TableCell>
                    {status === 'pending' && (
                      <Stack direction="row" spacing={1}>
                        <Button size="small" color="success" variant="contained" onClick={() => handleAction(r._id, 'accepted')}>Accept</Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => handleAction(r._id, 'rejected')}>Reject</Button>
                      </Stack>
                    )}
                    {status === 'accepted' && (
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" onClick={() => handleAction(r._id, 'pending')}>Move to Pending</Button>
                        <Button size="small" color="error" variant="outlined" onClick={() => handleAction(r._id, 'rejected')}>Reject</Button>
                      </Stack>
                    )}
                    {status === 'rejected' && (
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" onClick={() => handleAction(r._id, 'pending')}>Move to Pending</Button>
                        <Button size="small" color="success" variant="contained" onClick={() => handleAction(r._id, 'accepted')}>Accept</Button>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      )}
      <Snackbar
        open={!!snack}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        message={snack?.message}
      />
    </Box>
  );
}
