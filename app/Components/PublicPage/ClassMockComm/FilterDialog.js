import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import FilterComponent from './FilterComponent';
import { DialogActions, DialogContent } from '@mui/material';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FilterDialog({filterData, selectedFilter, setSelectedFilter}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Filter
          </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }} >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Filter
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Apply
            </Button>
          </Toolbar>
        </AppBar>
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
    </React.Fragment>
  );
}