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
  Paper,
  FormControlLabel,
  Switch
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const MaxScoresSection = ({ 
  maxScores, 
  handleMaxScoreChange, 
  standardizationParams,
  handleStandardizationParamChange,
  hideStandardisedScore,
  handleHideStandardisedScoreChange,
  isPublished,
  handleIsPublishedChange,
  performanceBoundaries,
  handlePerformanceBoundaryChange,
  actionLoading, 
  boysThresholds, 
  handleBoysThresholdChange,
  girlsThresholds,
  handleGirlsThresholdChange 
}) => {
  const theme = useTheme();
  
  // Calculate total max standardized score using the new formula
  const mathMaxScore = parseInt(maxScores.math || 0);
  const englishMaxScore = parseInt(maxScores.english || 0);
  const englishMean = parseFloat(standardizationParams?.englishMean || 34.35675165);
  const englishStdDev = parseFloat(standardizationParams?.englishStdDev || 7.757773879);
  const mathsMean = parseFloat(standardizationParams?.mathsMean || 27.49480642);
  const mathsStdDev = parseFloat(standardizationParams?.mathsStdDev || 11.77128731);
  
  // New standardization formula: Standardised score = (((raw score - μ) ÷ σ) × 15) + 100
  const englishMaxStandardized = (((englishMaxScore - englishMean) / englishStdDev) * 15) + 100;
  const mathMaxStandardized = (((mathMaxScore - mathsMean) / mathsStdDev) * 15) + 100;
  
  // Total score = 1.5 × (standardised English + standardised Mathematics)
  const totalMaxStandardizedScore = 1.5 * (englishMaxStandardized + mathMaxStandardized);
  
  // Default values for boys if not provided (scaled for max score of 450)
  const boysThresholdsData = boysThresholds || {
    kegs: {
      inside: { safe: 338, borderline: 263 },
      outside: { safe: 328, borderline: 263 }
    },
    colchester: {
      inside: { safe: 319, borderline: 244 },
      outside: { safe: 338, borderline: 263 }
    },
    westcliff: {
      inside: { safe: 338, borderline: 263 },
      outside: { safe: 338, borderline: 263 }
    },
    southend: {
      inside: { safe: 338, borderline: 263 },
      outside: { safe: 338, borderline: 263 }
    }
  };
  
  // Default values for girls if not provided (scaled for max score of 450)
  const girlsThresholdsData = girlsThresholds || {
    colchester: {
      inside: { safe: 338, borderline: 263 },
      outside: { safe: 338, borderline: 263 }
    },
    westcliff: {
      inside: { safe: 338, borderline: 263 },
      outside: { safe: 338, borderline: 263 }
    },
    southend: {
      inside: { safe: 338, borderline: 263 },
      outside: { safe: 338, borderline: 263 }
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
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="English Mean"
              type="number"
              value={standardizationParams?.englishMean || 34.35675165}
              onChange={(e) => handleStandardizationParamChange('englishMean', e.target.value)}
              InputProps={{
                inputProps: { min: 0 },
                sx: { borderRadius: 2 },
              }}
              disabled={actionLoading}
              variant="outlined"
              helperText="Mean for English score in standardized calculation"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="English Standard Deviation"
              type="number"
              value={standardizationParams?.englishStdDev || 7.757773879}
              onChange={(e) => handleStandardizationParamChange('englishStdDev', e.target.value)}
              InputProps={{
                inputProps: { min: 0 },
                sx: { borderRadius: 2 },
              }}
              disabled={actionLoading}
              variant="outlined"
              helperText="Standard deviation for English score in standardized calculation"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Maths Mean"
              type="number"
              value={standardizationParams?.mathsMean || 27.49480642}
              onChange={(e) => handleStandardizationParamChange('mathsMean', e.target.value)}
              InputProps={{
                inputProps: { min: 0 },
                sx: { borderRadius: 2 },
              }}
              disabled={actionLoading}
              variant="outlined"
              helperText="Mean for Math score in standardized calculation"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Maths Standard Deviation"
              type="number"
              value={standardizationParams?.mathsStdDev || 11.77128731}
              onChange={(e) => handleStandardizationParamChange('mathsStdDev', e.target.value)}
              InputProps={{
                inputProps: { min: 0 },
                sx: { borderRadius: 2 },
              }}
              disabled={actionLoading}
              variant="outlined"
              helperText="Standard deviation for Math score in standardized calculation"
            />
          </Grid>
        </Grid>
        
        {/* Display standardized score calculation */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>CSSE Standardized Score Formula:</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            • Individual Subject: (((raw score - μ) ÷ σ) × 15) + 100
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            • Total Score: 1.5 × (standardised English + standardised Mathematics)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <strong>Maximum Standardized Score:</strong> {totalMaxStandardizedScore.toFixed(1)}
          </Typography>
          
          {/* Hide Standardised Score Toggle */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={hideStandardisedScore}
                  onChange={(e) => handleHideStandardisedScoreChange(e.target.checked)}
                  disabled={actionLoading}
                  color="warning"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Hide Standardised Score from Students
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    When enabled, students will not see their standardized scores in reports
                  </Typography>
                </Box>
              }
            />
          </Box>

          {/* Publish Toggle */}
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublished}
                  onChange={(e) => handleIsPublishedChange(e.target.checked)}
                  disabled={actionLoading}
                  color="success"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight="medium">
                    Publish Report to Students
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Toggle to make this report visible to students in their dashboard
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Box>
      </Card>

      {/* Performance Marking Table */}
      <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiObjectsIcon color="success" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Performance Marking Boundaries
          </Typography>
          <Tooltip title="Set the grade boundaries for individual subject performance" placement="right">
            <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
          </Tooltip>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <TableContainer component={Paper} elevation={0}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Excellent</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Good</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Average</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Maths</TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={performanceBoundaries?.math?.excellent || 45}
                    onChange={(e) => handlePerformanceBoundaryChange('math', 'excellent', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: mathMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    sx={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={performanceBoundaries?.math?.good || 35}
                    onChange={(e) => handlePerformanceBoundaryChange('math', 'good', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: mathMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    sx={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={performanceBoundaries?.math?.average || 25}
                    onChange={(e) => handlePerformanceBoundaryChange('math', 'average', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: mathMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    sx={{ width: '80px' }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>English</TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={performanceBoundaries?.english?.excellent || 40}
                    onChange={(e) => handlePerformanceBoundaryChange('english', 'excellent', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: englishMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    sx={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={performanceBoundaries?.english?.good || 30}
                    onChange={(e) => handlePerformanceBoundaryChange('english', 'good', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: englishMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    sx={{ width: '80px' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <TextField
                    size="small"
                    type="number"
                    value={performanceBoundaries?.english?.average || 20}
                    onChange={(e) => handlePerformanceBoundaryChange('english', 'average', e.target.value)}
                    InputProps={{ inputProps: { min: 0, max: englishMaxScore } }}
                    disabled={actionLoading}
                    variant="outlined"
                    sx={{ width: '80px' }}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> These boundaries are used to categorize individual subject performance. 
            Students scoring at or above these thresholds will be marked as Excellent, Good, or Average in each subject.
          </Typography>
        </Box>
      </Card>

      <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiObjectsIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Boys Score Thresholds (Out of {totalMaxStandardizedScore.toFixed(1)})
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
                <TableCell sx={{ fontWeight: 'bold' }}>Out of {totalMaxStandardizedScore.toFixed(1)}</TableCell>
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
            Girls Score Thresholds (Out of {totalMaxStandardizedScore.toFixed(1)})
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
                <TableCell sx={{ fontWeight: 'bold' }}>Out of {totalMaxStandardizedScore.toFixed(1)}</TableCell>
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
                    InputProps={{ inputProps: { min: 0, max: totalMaxStandardizedScore } }}
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
