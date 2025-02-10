import { Box, Typography } from '@mui/material';
import { FcEmptyFilter } from "react-icons/fc";

export default function EmptyContent({ title = 'No Data' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        p: 3,
      }}
    >
      <FcEmptyFilter style={{ fontSize: 60, marginBottom: 16 }} />
      <Typography variant="body1" color="text.secondary">
        {title}
      </Typography>
    </Box>
  );
}
