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
  Snackbar
} from '@mui/material';

const statusTabs = [
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' }
];

export default function CourseWaitingListAdmin() {
  const [status, setStatus] = useState('pending');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snack, setSnack] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await myCourseService.adminGetWaitingList({ status });
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

  useEffect(() => {
    fetchData();
  }, [status]);

  const handleAction = async (entryId, newStatus) => {
    try {
      const res = await myCourseService.adminUpdateWaitingStatus({ entryId, status: newStatus });
      setSnack({ message: res.message, severity: res.variant });
      fetchData();
    } catch (err) {
      setSnack({ message: 'Operation failed', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 2 }}>
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

      {loading ? (
        <Box className="center" sx={{ p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : rows.length === 0 ? (
        <Alert severity="info">No {status} requests.</Alert>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Course</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Child</TableCell>
              <TableCell>Date</TableCell>
              {status === 'pending' && <TableCell>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(r => (
              <TableRow key={r._id}>
                <TableCell>{r.courseId?.courseTitle}</TableCell>
                <TableCell>{`${r.user?.firstName} ${r.user?.lastName}`}</TableCell>
                <TableCell>{r.childId?.childName || '-'}</TableCell>
                <TableCell>{new Date(r.date).toLocaleDateString()}</TableCell>
                {status === 'pending' && (
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button size="small" color="success" variant="contained" onClick={() => handleAction(r._id, 'accepted')}>Accept</Button>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleAction(r._id, 'rejected')}>Reject</Button>
                    </Stack>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
