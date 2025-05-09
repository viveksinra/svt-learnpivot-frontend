import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  TextField,
  Tooltip,
  useTheme
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const MaxScoresSection = ({ maxScores, handleMaxScoreChange, actionLoading }) => {
  const theme = useTheme();
  
  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <EmojiObjectsIcon color="warning" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          Maximum Scores
        </Typography>
        <Tooltip title="Set the maximum possible scores for each subject" placement="right">
          <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
        </Tooltip>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Maximum Math Score"
            type="number"
            value={maxScores.math}
            onChange={(e) => handleMaxScoreChange('math', e.target.value)}
            InputProps={{
              inputProps: { min: 0 },
              sx: { borderRadius: 2 },
            }}
            disabled={actionLoading}
            variant="outlined"
            helperText="Highest possible score for Math"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Maximum English Score"
            type="number"
            value={maxScores.english}
            onChange={(e) => handleMaxScoreChange('english', e.target.value)}
            InputProps={{
              inputProps: { min: 0 },
              sx: { borderRadius: 2 },
            }}
            disabled={actionLoading}
            variant="outlined"
            helperText="Highest possible score for English"
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default MaxScoresSection; 