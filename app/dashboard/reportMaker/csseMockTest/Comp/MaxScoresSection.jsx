import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  TextField,
  Tooltip,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const MaxScoresSection = ({ 
  maxScores, 
  handleMaxScoreChange, 
  actionLoading, 
  boysThresholds, 
  handleBoysThresholdChange,
  girlsThresholds,
  handleGirlsThresholdChange 
}) => {
  const theme = useTheme();
  
  // Calculate total max score
  const totalMaxScore = parseInt(maxScores.math || 0) + parseInt(maxScores.english || 0);
  
  // Default values for boys if not provided
  const boysThresholdsData = boysThresholds || {
    kegs: {
      inside: { safe: 90, borderline: 70, concern: 69 },
      outside: { safe: 90, borderline: 70, concern: 69 }
    },
    colchester: {
      inside: { safe: 85, borderline: 65, concern: 64 },
      outside: { safe: 90, borderline: 70, concern: 69 }
    },
    westcliff: {
      inside: { safe: 90, borderline: 70, concern: 69 },
      outside: { safe: 90, borderline: 70, concern: 69 }
    },
    southend: {
      inside: { safe: 90, borderline: 70, concern: 69 },
      outside: { safe: 90, borderline: 70, concern: 69 }
    }
  };
  
  // Default values for girls if not provided
  const girlsThresholdsData = girlsThresholds || {
    colchester: {
      inside: { safe: 90, borderline: 70, concern: 69 },
      outside: { safe: 90, borderline: 70, concern: 69 }
    },
    westcliff: {
      inside: { safe: 90, borderline: 70, concern: 69 },
      outside: { safe: 90, borderline: 70, concern: 69 }
    },
    southend: {
      inside: { safe: 90, borderline: 70, concern: 69 },
      outside: { safe: 90, borderline: 70, concern: 69 }
    }
  };
  
  return (
    <>
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

      <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiObjectsIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Boys Score Thresholds (Out of {totalMaxScore})
          </Typography>
          <Tooltip title="Set the score thresholds for boys by school" placement="right">
            <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold' }}>KEGS</TableCell>
                <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold' }}>Colchester</TableCell>
                <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold' }}>Westcliff Boys</TableCell>
                <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold' }}>Southend Boys</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Out of {totalMaxScore}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Inside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Outside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Inside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Outside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Inside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Outside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Inside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Outside</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Safe Row */}
              <TableRow>
                <TableCell>Safe</TableCell>
                {/* KEGS */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.kegs.inside.safe}
                    onChange={(e) => handleBoysThresholdChange('kegs', 'inside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.kegs.outside.safe}
                    onChange={(e) => handleBoysThresholdChange('kegs', 'outside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Colchester */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.colchester.inside.safe}
                    onChange={(e) => handleBoysThresholdChange('colchester', 'inside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.colchester.outside.safe}
                    onChange={(e) => handleBoysThresholdChange('colchester', 'outside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Westcliff */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.westcliff.inside.safe}
                    onChange={(e) => handleBoysThresholdChange('westcliff', 'inside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.westcliff.outside.safe}
                    onChange={(e) => handleBoysThresholdChange('westcliff', 'outside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Southend */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.southend.inside.safe}
                    onChange={(e) => handleBoysThresholdChange('southend', 'inside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.southend.outside.safe}
                    onChange={(e) => handleBoysThresholdChange('southend', 'outside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              
              {/* Borderline Row */}
              <TableRow>
                <TableCell>Borderline</TableCell>
                {/* KEGS */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.kegs.inside.borderline}
                    onChange={(e) => handleBoysThresholdChange('kegs', 'inside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.kegs.outside.borderline}
                    onChange={(e) => handleBoysThresholdChange('kegs', 'outside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Colchester */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.colchester.inside.borderline}
                    onChange={(e) => handleBoysThresholdChange('colchester', 'inside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.colchester.outside.borderline}
                    onChange={(e) => handleBoysThresholdChange('colchester', 'outside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Westcliff */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.westcliff.inside.borderline}
                    onChange={(e) => handleBoysThresholdChange('westcliff', 'inside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.westcliff.outside.borderline}
                    onChange={(e) => handleBoysThresholdChange('westcliff', 'outside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Southend */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.southend.inside.borderline}
                    onChange={(e) => handleBoysThresholdChange('southend', 'inside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.southend.outside.borderline}
                    onChange={(e) => handleBoysThresholdChange('southend', 'outside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              
              {/* Concern Row */}
              <TableRow>
                <TableCell>Concern</TableCell>
                {/* KEGS */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.kegs.inside.concern}
                    onChange={(e) => handleBoysThresholdChange('kegs', 'inside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.kegs.outside.concern}
                    onChange={(e) => handleBoysThresholdChange('kegs', 'outside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Colchester */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.colchester.inside.concern}
                    onChange={(e) => handleBoysThresholdChange('colchester', 'inside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.colchester.outside.concern}
                    onChange={(e) => handleBoysThresholdChange('colchester', 'outside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Westcliff */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.westcliff.inside.concern}
                    onChange={(e) => handleBoysThresholdChange('westcliff', 'inside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.westcliff.outside.concern}
                    onChange={(e) => handleBoysThresholdChange('westcliff', 'outside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Southend */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.southend.inside.concern}
                    onChange={(e) => handleBoysThresholdChange('southend', 'inside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={boysThresholdsData.southend.outside.concern}
                    onChange={(e) => handleBoysThresholdChange('southend', 'outside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Girls Score Thresholds */}
      <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiObjectsIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Girls Score Thresholds (Out of {totalMaxScore})
          </Typography>
          <Tooltip title="Set the score thresholds for girls by school" placement="right">
            <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold' }}>Colchester Girls</TableCell>
                <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold' }}>Westcliff Girls</TableCell>
                <TableCell colSpan={2} align="center" sx={{ fontWeight: 'bold' }}>Southend Girls</TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Out of {totalMaxScore}</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Inside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Outside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Inside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Outside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Inside</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Outside</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Safe Row */}
              <TableRow>
                <TableCell>Safe</TableCell>
                {/* Colchester */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.colchester.inside.safe}
                    onChange={(e) => handleGirlsThresholdChange('colchester', 'inside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.colchester.outside.safe}
                    onChange={(e) => handleGirlsThresholdChange('colchester', 'outside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Westcliff */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.westcliff.inside.safe}
                    onChange={(e) => handleGirlsThresholdChange('westcliff', 'inside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.westcliff.outside.safe}
                    onChange={(e) => handleGirlsThresholdChange('westcliff', 'outside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Southend */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.southend.inside.safe}
                    onChange={(e) => handleGirlsThresholdChange('southend', 'inside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.southend.outside.safe}
                    onChange={(e) => handleGirlsThresholdChange('southend', 'outside', 'safe', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              
              {/* Borderline Row */}
              <TableRow>
                <TableCell>Borderline</TableCell>
                {/* Colchester */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.colchester.inside.borderline}
                    onChange={(e) => handleGirlsThresholdChange('colchester', 'inside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.colchester.outside.borderline}
                    onChange={(e) => handleGirlsThresholdChange('colchester', 'outside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Westcliff */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.westcliff.inside.borderline}
                    onChange={(e) => handleGirlsThresholdChange('westcliff', 'inside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.westcliff.outside.borderline}
                    onChange={(e) => handleGirlsThresholdChange('westcliff', 'outside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Southend */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.southend.inside.borderline}
                    onChange={(e) => handleGirlsThresholdChange('southend', 'inside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.southend.outside.borderline}
                    onChange={(e) => handleGirlsThresholdChange('southend', 'outside', 'borderline', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
              
              {/* Concern Row */}
              <TableRow>
                <TableCell>Concern</TableCell>
                {/* Colchester */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.colchester.inside.concern}
                    onChange={(e) => handleGirlsThresholdChange('colchester', 'inside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.colchester.outside.concern}
                    onChange={(e) => handleGirlsThresholdChange('colchester', 'outside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Westcliff */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.westcliff.inside.concern}
                    onChange={(e) => handleGirlsThresholdChange('westcliff', 'inside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.westcliff.outside.concern}
                    onChange={(e) => handleGirlsThresholdChange('westcliff', 'outside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                {/* Southend */}
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.southend.inside.concern}
                    onChange={(e) => handleGirlsThresholdChange('southend', 'inside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    size="small"
                    type="number"
                    value={girlsThresholdsData.southend.outside.concern}
                    onChange={(e) => handleGirlsThresholdChange('southend', 'outside', 'concern', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: totalMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    fullWidth
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

export default MaxScoresSection; 