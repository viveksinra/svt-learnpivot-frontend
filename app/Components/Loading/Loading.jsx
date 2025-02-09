import {CircularProgress,Box} from '@mui/material/';

function Loading() {
  return (
    <Box sx={{ display: 'flex', justifyContent:"center",alignItems:"center", }}>
    <CircularProgress color="success" />
  </Box>
  )
} 

export default Loading