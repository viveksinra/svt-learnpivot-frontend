"use client";
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Stack,
  Card,
  CardContent,
  Tooltip,
  useTheme,
  useMediaQuery,
  IconButton,
  Collapse,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const TransactionCard = styled(Card)(({ theme, type }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `4px solid ${type === 'deposit' 
    ? theme.palette.success.main 
    : theme.palette.error.main}`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: theme.shadows[6],
  }
}));

const SummaryCard = styled(Card)(({ theme, bgcolor }) => ({
  height: '100%',
  background: `linear-gradient(135deg, ${bgcolor} 0%, ${bgcolor}dd 100%)`,
  color: 'white',
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[4],
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  }
}));

const UserTransactionReportMain = ({ reportData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [expandedTransactions, setExpandedTransactions] = useState({});
  
  if (!reportData) return null;

  const { user, statement } = reportData;

  const formatCurrency = (amount) => {
    const formattedNumber = new Intl.NumberFormat('en-GB').format(amount);
    return `${formattedNumber} ${amount === 1 ? 'coin' : 'coins'}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpand = (id) => {
    setExpandedTransactions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };



  return (
    <Box sx={{ width: '100%', px: { xs: 1, sm: 2 } }}>
      {/* User Information Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3, 
          borderRadius: '16px',
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: 6
          }
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm="auto">
            <Avatar 
              sx={{ 
                width: { xs: 56, sm: 64 }, 
                height: { xs: 56, sm: 64 }, 
                bgcolor: 'primary.main',
                boxShadow: 2
              }}
            >
              <PersonIcon sx={{ fontSize: { xs: 28, sm: 32 } }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant={isMobile ? "h6" : "h5"} gutterBottom fontWeight="bold">
              {user.name}
            </Typography>
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={{ xs: 1, sm: 2 }}
              sx={{ mb: 1 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              {user.phone && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhoneIcon sx={{ fontSize: 16, mr: 0.5, color: 'primary.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    {user.phone}
                  </Typography>
                </Box>
              )}
            </Stack>
            {user._id && (
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                User ID: {user._id}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Balance Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <SummaryCard bgcolor={theme.palette.primary.main}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalanceWalletIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="medium">Current Super Coins </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(statement.closingBalance)}
              </Typography>
            </CardContent>
          </SummaryCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard bgcolor={theme.palette.success.main}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="medium">Total Credits</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(statement.summary.totalCredits)}
              </Typography>
            </CardContent>
          </SummaryCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard bgcolor={theme.palette.error.main}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingDownIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="medium">Total Debits</Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(statement.summary.totalDebits)}
              </Typography>
            </CardContent>
          </SummaryCard>
        </Grid>
      </Grid>

      {/* Transaction History */}
      <Paper elevation={3} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Super Coins History
          </Typography>
          
          {/* Desktop Table View */}
          {!isMobile && (
            <TableContainer sx={{ maxHeight: '70vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Date</StyledTableCell>
                    <StyledTableCell>Type</StyledTableCell>
                    <StyledTableCell>Payment Method</StyledTableCell>
                    <StyledTableCell align="right">Credit</StyledTableCell>
                    <StyledTableCell align="right">Debit</StyledTableCell>
                    <StyledTableCell align="right">Balance</StyledTableCell>
                    <StyledTableCell>Remarks</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statement.transactions.map((transaction) => (
        
                      <TableRow 
                        hover
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor: theme.palette.action.hover,
                          }
                        }}
                      >
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                        <TableCell>
                          <Chip
                            label={transaction.type}
                            color={transaction.type === 'deposit' ? 'success' : 'error'}
                            size="small"
                            icon={transaction.type === 'deposit' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                          />
                        </TableCell>
                        <TableCell>{transaction.paymentMethod || 'N/A'}</TableCell>
                        <TableCell align="right">
                          {transaction.credit > 0 && formatCurrency(transaction.credit)}
                        </TableCell>
                        <TableCell align="right">
                          {transaction.debit > 0 && formatCurrency(transaction.debit)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(transaction.runningBalance)}
                        </TableCell>
                        <TableCell>{transaction.remark}</TableCell>
                      </TableRow>
              
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          
          {/* Mobile Card View */}
          {isMobile && (
            <Box>
              {statement.transactions.map((transaction) => (
                <TransactionCard 
                  key={transaction.transactionId}
                  type={transaction.type}
                  elevation={2}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={8}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(transaction.date)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4} sx={{ textAlign: 'right' }}>
                        <Chip
                          label={transaction.type}
                          color={transaction.type === 'deposit' ? 'success' : 'error'}
                          size="small"
                          icon={transaction.type === 'deposit' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                        />
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 1 }}>
                        <Typography variant="h6" color={transaction.type === 'deposit' ? 'success.main' : 'error.main'}>
                          {transaction.type === 'deposit' 
                            ? formatCurrency(transaction.credit) 
                            : `-${formatCurrency(transaction.debit)}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2">
                            Balance: {formatCurrency(transaction.runningBalance)}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => toggleExpand(transaction.transactionId)}
                            sx={{ ml: 1 }}
                          >
                            {expandedTransactions[transaction.transactionId] 
                              ? <ExpandLessIcon /> 
                              : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                    
                    <Collapse in={expandedTransactions[transaction.transactionId] || false}>
                      <Divider sx={{ my: 1.5 }} />
                      <List dense disablePadding>
                        {transaction.remark && (
                          <ListItem disablePadding sx={{ pb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <ReceiptIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Remark" 
                              secondary={transaction.remark}
                              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                            />
                          </ListItem>
                        )}
                        {transaction.paymentMethod && (
                          <ListItem disablePadding sx={{ pb: 1 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <PaymentIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText 
                              primary="Payment Method" 
                              secondary={transaction.paymentMethod}
                              primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                            />
                          </ListItem>
                        )}
                      
                        <ListItem disablePadding>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <ReceiptIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Transaction ID" 
                            secondary={transaction.transactionId}
                            primaryTypographyProps={{ variant: 'caption', color: 'text.secondary' }}
                          />
                        </ListItem>
                      </List>
                    </Collapse>
                  </CardContent>
                </TransactionCard>
              ))}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default UserTransactionReportMain;