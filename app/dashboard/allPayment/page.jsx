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
  CircularProgress,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import moment from 'moment';
import { reportService } from '@/app/services';
import DownReceipt from '@/app/Components/pdf/DownReceipt';

const formatPaymentData = (myBuyCourse = [], myBuyMock = []) => {
  const coursePayments = myBuyCourse.map(payment => ({
    ...payment,
    id: payment._id,
    type: 'course',
    description: payment.description,
    dates: payment.selectedDates ? 
      payment.selectedDates.map(date => moment(date).format('DD MMM YYYY')).join(', ') : '',
    duration: payment.courseDuration || '',
  }));

  const mockPayments = myBuyMock.map(payment => ({
    ...payment,
    id: payment._id,
    type: 'mock',
  }));

  return [...coursePayments, ...mockPayments].sort((a, b) => 
    new Date(b.paymentDate) - new Date(a.paymentDate)
  );
};

const exportToCSV = (payments) => {
  const headers = [
    'Type',
    'Date & Time',
    'Total Amount',
    'Paid Amount',
    'Balance Amount',
    'Status',
    'Course/Test Name',
    'Student',
    'Parent Name',
    'Email',
    'Payment ID'
  ];

  const csvData = payments.map(payment => [
    payment.type === 'course' ? 'Course' : 'Mock Test',
    moment(payment.paymentDate).format('DD MMM YYYY, HH:mm:ss'),
    `£${payment.amountPaid.toFixed(2)}`,
    `£${(payment.amountFromStripe || 0).toFixed(2)}`,
    `£${(payment.amountFromBalance || 0).toFixed(2)}`,
    payment.paymentStatus,
    payment.title || 'Mock Test',
    payment.childName,
    payment.parentName,
    payment.email,
    payment.paymentIntent
  ]);

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `payment_history_${moment().format('YYYY-MM-DD')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

const PaymentListItem = ({ payment, expanded, onToggle }) => (
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
            <QuizIcon color="secondary" />
          )}
          <Box flex={1}>
            <Typography variant="subtitle1" className="font-semibold">
              {payment.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {payment.year}
            </Typography>
          </Box>
          <StatusChip status={payment.paymentStatus === "succeeded"? "Paid" : payment.paymentStatus} />
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
              <Typography variant="body2" color="text.secondary">
                {payment.parentName} • {payment.email}
              </Typography>
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
        <DownReceipt data={payment.invoiceLink} />


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
          <QuizIcon color="secondary" />
        )}
        <span>{params.value === 'course' ? 'Course' : 'Mock Test'}</span>
      </Stack>
    ),
  },
  {
    field: 'paymentDate',
    headerName: 'Date & Time',
    width: 180,
    valueGetter: (params) => moment(params.value).format('DD MMM YYYY, HH:mm:ss'),
  },
  {
    field: 'amountPaid',
    headerName: 'Amount',
    width: 100,
    valueGetter: (params) => `£${params.value.toFixed(2)}`,
  },
  {
    field: 'paymentStatus',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => <StatusChip status={params.value} />,
  },
  {
    field: 'title',
    headerName: 'Title',
    width: 150,
    valueGetter: (params) => params.value || 'Mock Test',
  },
  {
    field: 'childName',
    headerName: 'Student',
    width: 130,
    renderCell: (params) => (
        <Typography variant="body2">{params.value} {params.row.year}</Typography>
                
    ),
  },
  {
    field: 'parentName',
    headerName: 'Parent Name',
    width: 120,
    renderCell: (params) => (
                
                <Typography variant="caption" color="text.secondary">{params.row.parentName} </Typography>
    ),
  },
  {
    field: 'email',
      headerName: 'Student',
    width: 120,
    renderCell: (params) => (
    
                
                <Typography variant="caption" color="text.secondary"> {params.row.email} </Typography>
    ),
  },

  {
    field: 'paymentIntent',
    headerName: 'Payment ID',
    width: 300,
  },
  {
    field: 'invoiceLink',
    headerName: 'Invoice',
    width: 180,
    renderCell: (params) => (
      <DownReceipt data={params.value} />

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
      const response = await reportService.getAdminAllPayment({ childId: selectedChild });
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
    <Box className="p-4" style={{width: '99.9%', PaddingRight: '100px'}}>
      <Card className="shadow-md rounded-xl">
        <CardContent>
          <Grid container spacing={2} alignItems="center" className="mb-4">
            <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h1" className="font-bold">
                Payment History
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="flex justify-end">
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => exportToCSV(filteredPayments)}
                  disabled={loading || filteredPayments.length === 0}
                >
                  Export
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            className="mb-4 border-b border-gray-200"
          >
            <Tab label="Succeeded" value="succeeded" />
            <Tab label="All" value="all" />

            <Tab label="Other" value="other" />
          </Tabs>

          {loading ? (
            <Box className="flex justify-center items-center p-8">
              <CircularProgress />
            </Box>
          ) : filteredPayments.length === 0 ? (
            <Alert severity="info" className="mt-4">
              No payments found for the selected filter.
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
            <Box className="h-[600px] " style={{maxWidth: 1200}}>
              <DataGrid
                rows={filteredPayments}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 25, page: 0 },
                  },
                }}
                pageSizeOptions={[10, 25, 50, 100,1000,10000,50000]}
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