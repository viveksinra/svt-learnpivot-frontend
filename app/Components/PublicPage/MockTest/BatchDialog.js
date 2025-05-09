import React, { useEffect, useRef, useState } from "react";
import { 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Box
} from "@mui/material";
import Link from "next/link";
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import moment from 'moment';
import { mockTestService } from "@/app/services";

const BatchDialog = ({ open, onClose, data, loading: externalLoading }) => {
    const [loading, setLoading] = useState(true);
    const [oneData, setOneData] = useState({});
    const snackRef = useRef();
  // Format date for display
  const formatDateDisplay = (dateString) => {
    return moment(dateString).format('Do MMM YYYY');
  };

  // Format time for display
  const formatTimeDisplay = (time) => {
    return moment(time, 'HH:mm').format('h:mm A');
  };

  useEffect(() => {
    // If loading is controlled externally, use that value
    if (externalLoading !== undefined) {
      setLoading(externalLoading);
      // If not loading and we have data from parent, use it
      if (!externalLoading && data) {
        setOneData(data);
      }
      return;
    }

    // Otherwise, handle loading internally
    if (open) {
      async function getOneMockTest() {
        setLoading(true);
        try {
          let res = await mockTestService.publicGetOne(`${data._id}`);
          if (res.variant === "success") {
            setOneData(res.data);
          } else {
            if (snackRef.current) {
              snackRef.current.handleSnack(res);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }   
        setLoading(false);
      }
      getOneMockTest();
    }
  }, [open, data, externalLoading]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ 
        backgroundColor: '#F3F4F6',
        color: '#1F2937',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {loading ? "Loading Batches..." : `${oneData?.testType?.label || 'Mock Test'} Batches`}
        <CloseIcon 
          onClick={onClose} 
          sx={{ cursor: 'pointer', color: '#1F2937' }} 
        />
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            flexDirection: 'column',
            gap: 2
          }}>
            <CircularProgress color="primary" />
            <Typography variant="body2" color="text.secondary">
              Loading batch details...
            </Typography>
          </Box>
        ) : (
          <div style={{ marginTop: '16px' }}>
            {oneData?.batch?.map((batch, index) => (
              <div key={index} style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#F9FAFB',
                padding: '16px',
                borderRadius: '4px',
                marginBottom: '8px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <CalendarMonthIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                    <Typography variant="body1" sx={{ color: '#4B5563', fontWeight: 'medium' }}>
                      {formatDateDisplay(batch.date)}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AccessTimeIcon sx={{ color: '#6B7280', fontSize: '1rem' }} />
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {formatTimeDisplay(batch.startTime)} - {formatTimeDisplay(batch.endTime)}
                    </Typography>
                  </div>
                </div>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: batch.filled ? '#DC2626' : '#059669', 
                    fontWeight: 'bold', 
                    fontSize: batch.filled ? '0.875rem' : '1rem' 
                  }}
                >
                  {batch.filled ? 'Booking Full' : `£${batch.oneBatchprice}`}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: 'white', 
            backgroundColor: 'red', 
            '&:hover': { backgroundColor: 'darkred' },
            flex: 1,
            marginRight: '8px'
          }}
        >
          Close
        </Button>
        {!loading && (
          <Link href={"/mockTest/buy/" + oneData?._id} style={{ flex: 1, textDecoration: 'none' }}>
            <Button 
              onClick={onClose}
              sx={{ 
                color: 'white', 
                backgroundColor: 'green', 
                '&:hover': { backgroundColor: 'darkgreen' },
                width: '100%'
              }}
            >
              Buy Now
            </Button>
          </Link>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BatchDialog;
