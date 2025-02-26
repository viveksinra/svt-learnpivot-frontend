import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import FilterComponent from './FilterComponent';
import { DialogActions, DialogContent } from '@mui/material';
import { styled } from '@mui/material/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AnimatedAppBar = styled(AppBar)(({ theme }) => ({
  position: 'relative',
  backgroundColor: '#1976d2',
  transition: 'all 0.3s ease',
  '& .MuiToolbar-root': {
    padding: '0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {  // This ensures all direct children maintain their natural size
      flex: '0 0 auto'
    }
  },
  '& .MuiIconButton-root': {
    width: '48px',  // Fixed width for the icon button
    marginRight: '8px',
  },
  '& .MuiTypography-root': {
    flex: '1 1 auto !important',  // Only typography should grow
    marginLeft: '16px',
  },
  '& .MuiButton-root': {
    minWidth: 'fit-content',
    padding: '6px 16px',
    whiteSpace: 'nowrap'
  }
}));

export default function FilterDialog({filterData, selectedFilter, setSelectedFilter}) {
  const [open, setOpen] = React.useState(false);
  // Add this helper function to check if any filters are selected
  const hasSelectedFilters = React.useMemo(() => 
    selectedFilter.some(filter => filter.ids.length > 0),
    [selectedFilter]
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedFilter(prevState => 
      prevState.map(filter => ({
        ...filter,
        ids: []
      }))
    );
  };

  const AnimatedButton = styled('button')(({ theme, bgcolor, hovercolor, textcolor = 'white' }) => ({
    backgroundColor: bgcolor || '#F97316',
    color: textcolor,
    padding: '8px 20px', // Reduced padding
    borderRadius: '4px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    minWidth: 'fit-content',
    maxWidth: 'max-content',
    whiteSpace: 'nowrap', // Prevent text wrapping
    flex: '0 0 auto',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
      backgroundColor: hovercolor || '#E85D04',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: '0.5s',
    },
    '&:hover::after': {
      left: '100%',
    }
  }));

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      <AnimatedButton
        onClick={handleClickOpen}
        bgcolor="#1976d2"
        hovercolor="#1565c0"
      >
        Filter
      </AnimatedButton>
      {hasSelectedFilters && (
        <AnimatedButton
          onClick={handleClearFilters}
          bgcolor="#ef4444"
          hovercolor="#dc2626"
        >
          Clear Filters
        </AnimatedButton>
      )}
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AnimatedAppBar>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              Filter
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Apply
            </Button>
          </Toolbar>
        </AnimatedAppBar>
        <DialogContent style={{ padding: '16px' }}> {/* Add padding here */}
              <FilterComponent filterData={filterData} selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter}/>
            </DialogContent>
        <DialogActions>
              <Button variant="outlined" color="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleClose}>
                Apply
              </Button>
            </DialogActions>
      </Dialog>
    </Box>
  );
}