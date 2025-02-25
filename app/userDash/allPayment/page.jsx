'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Collapse,
  Stack,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import moment from 'moment';
import ChildSelectorDropDown from '../../Components/Common/ChildSelectorDropDown';
import { reportService } from '@/app/services';
import DownReceipt from '@/app/Components/pdf/DownReceipt';

const formatPaymentData = (myBuyCourse = [], myBuyMock = []) => {
  const coursePayments = myBuyCourse.map(payment => ({
    ...payment,
    id: payment._id,
    type: 'course',
    description: payment.courseDescription,
    dates: payment.selectedDates ? 
      payment.selectedDates.map(date => moment(date).format('DD MMM YYYY')).join(', ') : '',
    duration: payment.courseDuration || '',
  }));

  const mockPayments = myBuyMock.map(payment => ({
    ...payment,
    id: payment._id,
    type: 'mock',
    courseName: 'Mock Test',
  }));

  return [...coursePayments, ...mockPayments].sort((a, b) => 
    new Date(b.paymentDate) - new Date(a.paymentDate)
  );
};

const StatusChip = ({ status }) => {
  const displayStatus = status.toLowerCase() === 'formfilled' ? 'Failed' : status;
  return (
    <Chip
      label={displayStatus}
      size="small"
      sx={{
        backgroundColor: status.toLowerCase() === 'succeeded' ? '#e3f2fd' : '#fff3e0',
        color: status.toLowerCase() === 'succeeded' ? '#1976d2' : '#ed6c02',
        fontWeight: 500
      }}
    />
  );
};

const PaymentListItem = ({ payment, expanded, onToggle }) => {
  const handleReceiptClick = (e) => {
    e.stopPropagation(); // Prevent the collapse toggle from triggering
  };

  return (
    <Card className="mb-2 shadow-sm">
      <ListItem
        button
        onClick={onToggle}
        className="hover:bg-gray-50"
        sx={{ flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box className="w-full">
          <Stack direction="row" spacing={2} alignItems="center" className="mb-2">
            {payment.type === 'course' ? (
              <SchoolIcon color="primary" />
            ) : (
              <AssignmentIcon color="secondary" />
            )}
            <Box flex={1}>
              <Typography variant="subtitle1" className="font-semibold">
                {payment.courseName}
              </Typography>
         
            </Box>
            {/* <StatusChip status={payment.paymentStatus} /> */}
          </Stack>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {moment(payment.paymentDate).format('DD MMM YYYY')}
            </Typography>
            <Typography variant="subtitle2" className="font-semibold">
              £{payment.amountPaid.toFixed(2)}
            </Typography>
          </Stack>

          <Collapse in={expanded} timeout="auto" unmountOnExit className="mt-4">
            <Stack spacing={2} className="px-2 py-3">
              {payment.type === 'course' && (
                <>
                  {payment.description && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body2">{payment.description}</Typography>
                    </Box>
                  )}
                  {payment.dates && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Class Dates
                      </Typography>
                      <Typography variant="body2">{payment.dates}</Typography>
                    </Box>
                  )}
                  {payment.duration && (
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        Duration
                      </Typography>
                      <Typography variant="body2">{payment.duration}</Typography>
                    </Box>
                  )}
                  <Divider />
                </>
              )}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Student Details
                </Typography>
                <Typography variant="body2">
                  {payment.childName}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                  {payment.parentName} • {payment.email}
                </Typography> */}
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                  Payment ID
                </Typography>
                <Typography variant="body2" className="break-all font-mono">
                  {payment.paymentIntent}
                </Typography>
              </Box>
              {payment.invoiceLink && (
                <Box 
                  onClick={handleReceiptClick}
                  sx={{ '& button': { width: { xs: '100%', sm: 'auto' } } }}
                >
                  <DownReceipt data={payment.invoiceLink} />
                </Box>
              )}
            </Stack>
          </Collapse>
        </Box>
        <IconButton 
          edge="end" 
          onClick={onToggle}
          className="absolute right-2 top-2"
        >
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </ListItem>
    </Card>
  );
};

const columns = [
  {
    field: 'type',
    headerName: 'Type',
    width: 120,
    renderCell: (params) => (
      <Stack direction="row" spacing={1} alignItems="center">
        {params.value === 'course' ? (
          <SchoolIcon color="primary" />
        ) : (
          <AssignmentIcon color="secondary" />
        )}
        <span>{params.value === 'course' ? 'Course' : 'Mock Test'}</span>
      </Stack>
    ),
  },
  {
    field: 'paymentDate',
    headerName: 'Date',
    width: 160,
    valueGetter: (params) => moment(params.value).format('DD MMM YYYY'),
  },
  {
    field: 'amountPaid',
    headerName: 'Amount',
    width: 120,
    valueGetter: (params) => `£${params.value.toFixed(2)}`,
  },
  // {
  //   field: 'paymentStatus',
  //   headerName: 'Status',
  //   width: 140,
  //   renderCell: (params) => <StatusChip status={params.value} />,
  // },
  {
    field: 'courseName',
    headerName: 'Course/Test',
    width: 250,
    valueGetter: (params) => params.value || 'Mock Test',
  },
  {
    field: 'childName',
    headerName: 'Student',
    width: 150,
    renderCell: (params) => (
      <Stack>
        <Typography variant="body2">{params.value} </Typography>
        {/* <Typography variant="body2">{params.value} {params.row.year}</Typography> */}
                
                {/* <Typography variant="caption" color="text.secondary">{params.row.parentName} • {params.row.email} </Typography> */}
      </Stack>
    ),
  },
  // {
  //   field: 'paymentIntent',
  //   headerName: 'Payment ID',
  //   width: 220,
  // },
  {
    field: 'invoiceLink',
    headerName: 'Invoice',
    width: 140,
    renderCell: (params) => (
      params.value && (
        <DownReceipt data={params.value} />
      )
    ),
  },
];

export default function PaymentsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = useState('succeeded');
  const [selectedChild, setSelectedChild] = useState('all');
  const [payments, setPayments] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const snackRef = useRef();

  useEffect(() => {
    handleGetAllPayment();
  }, [selectedChild]);

  const handleGetAllPayment = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getMyAllPayment({ childId: selectedChild });
      if (response?.myData) {
        const { myBuyCourse, myBuyMock } = response.myData;

        const formattedPayments = await formatPaymentData(myBuyCourse, myBuyMock);
        setPayments(formattedPayments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch payment history. Please try again later.');
      snackRef.current?.handleSnack({ 
        message: 'Failed to fetch payment history.', 
        variant: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setExpandedItem(null); // Reset expanded item when changing tabs
  };

  const filteredPayments = payments.filter(payment => {
    if (tabValue === 'all') return true;
    if (tabValue === 'other') return ['formfilled', 'processing', 'canceled'].includes(payment.paymentStatus.toLowerCase());

    return tabValue === payment.paymentStatus.toLowerCase();
  });


  if (error) {
    return (
      <Box className="p-4">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="p-4">
      <Card className="shadow-md rounded-xl">
        <CardContent>
          <Grid container spacing={2} alignItems="center" className="mb-4">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h1" className="font-bold">
                Payment History
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="flex justify-center md:justify-end">
                <ChildSelectorDropDown
                  selectedChild={selectedChild}
                  setSelectedChild={setSelectedChild}
                />
              </Box>
            </Grid>
          </Grid>

          {loading ? (
            <Box className="flex justify-center items-center p-8">
              <CircularProgress />
            </Box>
          ) : filteredPayments.length === 0 ? (
            <Alert severity="info" className="mt-4">
              No payment History found.
            </Alert>
          ) : isMobile ? (
            <List className="p-0">
              {filteredPayments.map((payment) => (
                <PaymentListItem
                  key={payment.id}
                  payment={payment}
                  expanded={expandedItem === payment.id}
                  onToggle={() => setExpandedItem(expandedItem === payment.id ? null : payment.id)}
                />
              ))}
            </List>
          ) : (
            <Box className="h-[600px] " style={{width: '90%'}}>
              <DataGrid
                rows={filteredPayments}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                className="border-none"
                sx={{
                  '& .MuiDataGrid-cell': {
                    borderBottom: '1px solid #f0f0f0',
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f5f5f5',
                    borderBottom: 'none',
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}