"use client";
import React from 'react';
import {
  Avatar, 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Chip,
  Badge,
  Tooltip
} from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const MockAccessCom = ({ mockTestComparison, formatDate, formatTime, handleGiveAccess }) => {
  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        {mockTestComparison.available.length} available mock tests • {mockTestComparison.purchased.length} purchased with {
          mockTestComparison.purchased.reduce((total, test) => total + (test.purchasedBatches?.length || 0), 0)
        } batches
      </Typography>
      
      {mockTestComparison.available.length > 0 ? (
        <Grid container spacing={2}>
          {mockTestComparison.available.map((test) => {
            const isPurchased = test.isPurchased;
            const purchasedBatches = test.purchasedBatches || [];
            const availableBatches = test.batch || [];
            
            return (
              <Grid item xs={12} sm={6} key={test._id}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    borderColor: isPurchased ? 'success.main' : 'divider',
                    position: 'relative',
                    borderRadius: '10px'
                  }}
                >
                  {isPurchased && (
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        right: 10, 
                        top: 10, 
                        bgcolor: 'success.main',
                        color: 'white',
                        borderRadius: '50%',
                        p: 0.5,
                        zIndex: 1
                      }}
                    >
                      <CheckCircleIcon />
                    </Box>
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        variant="rounded" 
                        src={test.imageUrls?.[0]} 
                        sx={{ mr: 2, width: 40, height: 40 }}
                      >
                        <FactCheckIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" title={test.mockTestTitle}>
                          {test.mockTestTitle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {availableBatches.length || 0} available batches
                        </Typography>
                      </Box>
                    </Box>
                    
                    {isPurchased && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          {purchasedBatches.length} batch{purchasedBatches.length !== 1 ? 'es' : ''} purchased
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Batch-specific purchases for this child are highlighted below
                        </Typography>
                      </Box>
                    )}
                    
                    {/* Show available batches for this mock test */}
                    {availableBatches.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
                          Batches:
                        </Typography>
                        <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {availableBatches.map((batch, idx) => {
                            const isPurchasedBatch = isPurchased && 
                              purchasedBatches.some(pb => pb._id === batch._id);
                            
                            return (
                              <Box 
                                key={idx} 
                                sx={{ 
                                  p: 1.5, 
                                  mb: 1, 
                                  borderRadius: '8px',
                                  border: '1px solid',
                                  borderColor: isPurchasedBatch ? 'success.main' : 'divider',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start'
                                }}
                              >
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body2" fontWeight="bold">
                                    {formatDate(batch.date)}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
                                  </Typography>
                                  
                                  {batch.filled && (
                                    <Chip 
                                      size="small" 
                                      label="Full" 
                                      color="error" 
                                      variant="outlined"
                                      sx={{ mt: 1, mr: 1 }}
                                    />
                                  )}
                                  
                                  {batch.fillingFast && !batch.filled && (
                                    <Chip 
                                      size="small" 
                                      label="Filling Fast" 
                                      color="warning" 
                                      variant="outlined"
                                      sx={{ mt: 1, mr: 1 }}
                                    />
                                  )}
                                  
                                  {/* Display the children who purchased this batch */}
                                  {batch.children && batch.children.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                      {batch.children.map((child, childIdx) => (
                                        <Chip
                                          key={childIdx}
                                          size="small"
                                          label={child.childName}
                                          color="primary"
                                          variant="outlined"
                                          sx={{ mr: 0.5, mt: 0.5 }}
                                          icon={<ChildCareIcon fontSize="small" />}
                                        />
                                      ))}
                                    </Box>
                                  )}
                                </Box>
                                
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  {batch.oneBatchprice && (
                                    <Chip 
                                      size="small"
                                      label={`£${batch.oneBatchprice}`}
                                      color={isPurchasedBatch ? "success" : "default"}
                                      variant={isPurchasedBatch ? "filled" : "outlined"}
                                      sx={{ mr: 1 }}
                                    />
                                  )}
                                  
                                  {isPurchasedBatch ? (
                                    <Tooltip title="Purchased for this child">
                                      <CheckCircleIcon 
                                        color="success" 
                                        fontSize="small"
                                      />
                                    </Tooltip>
                                  ) : batch.children && batch.children.length > 0 ? (
                                    <Tooltip title={`${batch.children.length} child${batch.children.length > 1 ? 'ren' : ''} enrolled`}>
                                      <Badge 
                                        badgeContent={batch.children.length} 
                                        color="primary"
                                        max={99}
                                        sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: '16px', minWidth: '16px' } }}
                                      >
                                        <ChildCareIcon color="action" fontSize="small" />
                                      </Badge>
                                    </Tooltip>
                                  ) : null}
                                </Box>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
          
          {/* Add "Give Access" Card for Mock Tests */}
          {/* <Grid item xs={12} sm={6}>
            <Card 
              variant="outlined" 
              sx={{ 
                borderColor: 'primary.light',
                borderStyle: 'dashed',
                borderRadius: '10px',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                }
              }}
              onClick={() => handleGiveAccess('mocktest')}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <AddCircleIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h6" color="primary.main">
                  Give Mock Test Access
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Provide this user with access to a mock test
                </Typography>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography color="text.secondary">No mock test access available</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default MockAccessCom;
