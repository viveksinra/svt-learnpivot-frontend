"use client";
import React from 'react';
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
  Divider,
  Stack,
  Card,
  CardContent,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

const UserTransactionReportMain = ({ reportData }) => {
  if (!reportData) return null;

  const { user, statement } = reportData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
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

  // Generate tooltip content for transaction details
  const getTransactionDetails = (transaction) => {
    const details = [
      `Transaction ID: ${transaction.transactionId}`,
      `Payment Method: ${transaction.paymentMethod || 'N/A'}`,
      `Added By: ${transaction.addedBy || 'N/A'}`
    ];
    
    if (transaction.usedInPurchase) details.push(`Used In Purchase: ${transaction.usedInPurchase}`);
    if (transaction.usedInModel) details.push(`Used In Model: ${transaction.usedInModel}`);
    if (transaction.refundFor) details.push(`Refund For: ${transaction.refundFor}`);
    if (transaction.refundForModel) details.push(`Refund For Model: ${transaction.refundForModel}`);
    
    return details.join('\n');
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* User Information Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '12px' }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Stack direction="row" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                <EmailIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                {user.email}
              </Typography>
              {user.phone && (
                <Typography variant="body2" color="text.secondary">
                  <PhoneIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                  {user.phone}
                </Typography>
              )}
            </Stack>
            {user._id && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                User ID: {user._id}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* Balance Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccountBalanceWalletIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Current Balance</Typography>
              </Box>
              <Typography variant="h4">
                {formatCurrency(statement.closingBalance)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Credits</Typography>
              </Box>
              <Typography variant="h4">
                {formatCurrency(statement.summary.totalCredits)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', bgcolor: 'error.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingDownIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Debits</Typography>
              </Box>
              <Typography variant="h4">
                {formatCurrency(statement.summary.totalDebits)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transaction History */}
      <Paper elevation={2} sx={{ borderRadius: '12px' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Transaction History
          </Typography>
          <TableContainer>
            <Table>
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
                  <Tooltip 
                    key={transaction.transactionId}
                    title={getTransactionDetails(transaction)}
                    arrow
                    placement="top"
                  >
                    <TableRow hover>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.type}
                          color={transaction.type === 'deposit' ? 'success' : 'error'}
                          size="small"
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
                  </Tooltip>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserTransactionReportMain;