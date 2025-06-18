import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  Divider,
  TextField,
  Tooltip,
  IconButton,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Chip,
  Alert,
  Paper,
  alpha,
  Collapse,
  FormControlLabel,
  Switch
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const SubjectOptions = [
  { value: 'math', label: 'Mathematics', color: '#2196F3', icon: '🔢' },
  { value: 'english', label: 'English', color: '#00897B', icon: '📚' },
  { value: 'creativeWriting', label: 'Creative Writing', color: '#FF9800', icon: '✍️' },
];

const MaxScoresSection = ({ paperSections, handleUpdatePaperSections, actionLoading, isPublished, handleIsPublishedChange }) => {
  const theme = useTheme();
  const [expandedPapers, setExpandedPapers] = useState({});
  
  // Initialize all papers as expanded
  useEffect(() => {
    const initialExpanded = {};
    paperSections.forEach((paper, index) => {
      initialExpanded[paper.paperId] = true;
    });
    setExpandedPapers(initialExpanded);
  }, [paperSections]);
  
  const togglePaperExpansion = (paperId) => {
    setExpandedPapers(prev => ({
      ...prev,
      [paperId]: !prev[paperId]
    }));
  };

  const handleAddPaper = () => {
    const paperNumber = paperSections.length + 1;
    const newPaperId = Date.now().toString();
    handleUpdatePaperSections([
      ...paperSections,
      {
        paperId: newPaperId,
        paperName: `Paper ${paperNumber}`,
        sections: []
      }
    ]);
    // Expand the new paper
    setExpandedPapers(prev => ({
      ...prev,
      [newPaperId]: true
    }));
  };

  const handleAddSection = (paperIndex) => {
    const updatedPapers = [...paperSections];
    const sections = updatedPapers[paperIndex].sections;
    updatedPapers[paperIndex].sections = [
      ...sections,
      {
        sectionId: Date.now().toString(),
        sectionName: '',
        subject: 'english', // Default subject
        maxScore: 10
      }
    ];
    handleUpdatePaperSections(updatedPapers);
  };

  const handleDeletePaper = (paperIndex) => {
    const paperToDelete = paperSections[paperIndex];
    const updatedPapers = paperSections.filter((_, idx) => idx !== paperIndex);
    // Rename papers if needed
    const renamedPapers = updatedPapers.map((paper, index) => ({
      ...paper,
      paperName: paper.paperName.startsWith('Paper ') ? `Paper ${index + 1}` : paper.paperName
    }));
    handleUpdatePaperSections(renamedPapers);
    
    // Remove from expanded state
    setExpandedPapers(prev => {
      const newState = { ...prev };
      delete newState[paperToDelete.paperId];
      return newState;
    });
  };

  const handleDeleteSection = (paperIndex, sectionIndex) => {
    const updatedPapers = [...paperSections];
    updatedPapers[paperIndex].sections = updatedPapers[paperIndex].sections.filter((_, idx) => idx !== sectionIndex);
    handleUpdatePaperSections(updatedPapers);
  };

  const handleSectionNameChange = (paperIndex, sectionIndex, value) => {
    const updatedPapers = [...paperSections];
    updatedPapers[paperIndex].sections[sectionIndex].sectionName = value;
    handleUpdatePaperSections(updatedPapers);
  };

  const handleMaxScoreChange = (paperIndex, sectionIndex, value) => {
    const numericValue = value === '' ? 0 : Number(value);
    const updatedPapers = [...paperSections];
    updatedPapers[paperIndex].sections[sectionIndex].maxScore = numericValue;
    handleUpdatePaperSections(updatedPapers);
  };

  const handleSubjectChange = (paperIndex, sectionIndex, value) => {
    const updatedPapers = [...paperSections];
    updatedPapers[paperIndex].sections[sectionIndex].subject = value;
    handleUpdatePaperSections(updatedPapers);
  };

  const handlePaperNameChange = (paperIndex, value) => {
    const updatedPapers = [...paperSections];
    updatedPapers[paperIndex].paperName = value;
    handleUpdatePaperSections(updatedPapers);
  };

  // Calculate total sections and max scores for summary
  const getTotalSections = () => {
    return paperSections.reduce((total, paper) => total + paper.sections.length, 0);
  };

  const getTotalMaxScore = () => {
    return paperSections.reduce((total, paper) => 
      total + paper.sections.reduce((paperTotal, section) => paperTotal + section.maxScore, 0), 0
    );
  };

  const getSubjectBreakdown = () => {
    const breakdown = {};
    paperSections.forEach(paper => {
      paper.sections.forEach(section => {
        if (!breakdown[section.subject]) {
          breakdown[section.subject] = { count: 0, totalScore: 0 };
        }
        breakdown[section.subject].count++;
        breakdown[section.subject].totalScore += section.maxScore;
      });
    });
    return breakdown;
  };

  return (
    <Card elevation={0} sx={{ mb: 2, borderRadius: 2, p: 2, bgcolor: 'transparent' }}>
      {/* Summary Section */}
      {paperSections.length > 0 && (
        <Alert 
          severity="info" 
          variant="outlined"
          sx={{ 
            mb: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.info.main, 0.05)
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" fontWeight="medium">
              📊 Summary:
            </Typography>
            <Chip 
              label={`${paperSections.length} Papers`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              label={`${getTotalSections()} Sections`} 
              size="small" 
              color="secondary" 
              variant="outlined"
            />
            <Chip 
              label={`${getTotalMaxScore()} Total Points`} 
              size="small" 
              color="success" 
              variant="outlined"
            />
            {Object.entries(getSubjectBreakdown()).map(([subject, data]) => {
              const subjectInfo = SubjectOptions.find(opt => opt.value === subject);
              return (
                <Chip 
                  key={subject}
                  label={`${subjectInfo?.icon || '📝'} ${data.count} (${data.totalScore}pts)`}
                  size="small"
                  sx={{ 
                    backgroundColor: alpha(subjectInfo?.color || '#666', 0.1),
                    color: subjectInfo?.color || '#666',
                    borderColor: subjectInfo?.color || '#666'
                  }}
                  variant="outlined"
                />
              );
            })}
          </Box>
        </Alert>
      )}

      {paperSections.map((paper, paperIndex) => (
        <Paper 
          key={paper.paperId} 
          elevation={1}
          sx={{ 
            mb: 2, 
            borderRadius: 2, 
            overflow: 'hidden',
            border: `1px solid ${alpha(theme.palette.divider, 0.12)}`
          }}
        >
          {/* Paper Header */}
          <Box 
            sx={{ 
              p: 2, 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.primary.main}10 100%)`,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.12)}`
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                <TextField
                  label="Paper Name"
                  value={paper.paperName}
                  onChange={(e) => handlePaperNameChange(paperIndex, e.target.value)}
                  variant="outlined"
                  size="small"
                  disabled={actionLoading}
                  sx={{ 
                    minWidth: 200,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white'
                    }
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`${paper.sections.length} sections`} 
                    size="small" 
                    color="primary"
                    variant="outlined"
                  />
                  <Chip 
                    label={`${paper.sections.reduce((sum, s) => sum + s.maxScore, 0)} points`} 
                    size="small" 
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  size="small"
                  onClick={() => togglePaperExpansion(paper.paperId)}
                  sx={{ color: theme.palette.primary.main }}
                >
                  {expandedPapers[paper.paperId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <IconButton 
                  color="error" 
                  size="small"
                  onClick={() => handleDeletePaper(paperIndex)}
                  disabled={actionLoading}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
          
          <Collapse in={expandedPapers[paper.paperId]}>
            <Box sx={{ p: 2 }}>
              {paper.sections.length === 0 ? (
                <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">
                      No sections added to this paper yet. Add your first section to define scoring areas.
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddSection(paperIndex)}
                      disabled={actionLoading}
                      sx={{ ml: 2 }}
                    >
                      Add Section
                    </Button>
                  </Box>
                </Alert>
              ) : (
                <>
                  {/* Section Headers */}
                  <Grid container spacing={2} sx={{ mb: 1 }}>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                        Section Name
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                        Subject
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                        Max Score
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                        Progress
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      {/* Actions header */}
                    </Grid>
                  </Grid>
                  
                  {/* Section Rows */}
                  {paper.sections.map((section, sectionIndex) => (
                    <Grid container spacing={2} key={section.sectionId} sx={{ mb: 2, alignItems: 'center' }}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          placeholder="E.g., Comprehension, Spelling, etc."
                          value={section.sectionName}
                          onChange={(e) => handleSectionNameChange(paperIndex, sectionIndex, e.target.value)}
                          disabled={actionLoading}
                          size="small"
                          variant="outlined"
                          error={!section.sectionName}
                          helperText={!section.sectionName ? "Name required" : ""}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl fullWidth size="small">
                          <Select
                            value={section.subject}
                            onChange={(e) => handleSubjectChange(paperIndex, sectionIndex, e.target.value)}
                            disabled={actionLoading}
                            renderValue={(value) => {
                              const subject = SubjectOptions.find(opt => opt.value === value);
                              return (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>{subject?.icon}</span>
                                  <span>{subject?.label}</span>
                                </Box>
                              );
                            }}
                          >
                            {SubjectOptions.map(option => (
                              <MenuItem key={option.value} value={option.value}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <span>{option.icon}</span>
                                  <span>{option.label}</span>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          type="number"
                          value={section.maxScore}
                          onChange={(e) => handleMaxScoreChange(paperIndex, sectionIndex, e.target.value)}
                          InputProps={{
                            inputProps: { min: 0, max: 100 },
                          }}
                          disabled={actionLoading}
                          size="small"
                          error={section.maxScore <= 0}
                          helperText={section.maxScore <= 0 ? "Must be > 0" : ""}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: alpha(theme.palette.divider, 0.3),
                              position: 'relative'
                            }}
                          >
                            <Box
                              sx={{
                                width: section.sectionName && section.maxScore > 0 ? '100%' : '30%',
                                height: '100%',
                                borderRadius: 3,
                                backgroundColor: section.sectionName && section.maxScore > 0 
                                  ? theme.palette.success.main 
                                  : theme.palette.warning.main,
                                transition: 'all 0.3s ease'
                              }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {section.sectionName && section.maxScore > 0 ? '✓' : '⚠️'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={1} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <IconButton 
                          color="error" 
                          size="small"
                          onClick={() => handleDeleteSection(paperIndex, sectionIndex)}
                          disabled={actionLoading}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </>
              )}
              
              {/* Add Section Button */}
              {paper.sections.length > 0 && (
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddSection(paperIndex)}
                    disabled={actionLoading}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Section to {paper.paperName}
                  </Button>
                </Box>
              )}
            </Box>
          </Collapse>
        </Paper>
      ))}

      {paperSections.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <AutoFixHighIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Exam Structure Defined
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first paper to get started with defining the exam structure.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddPaper}
            disabled={actionLoading}
            size="large"
            sx={{ borderRadius: 2 }}
          >
            Create First Paper
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={handleAddPaper}
            disabled={actionLoading}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            Add Paper
          </Button>
        </Box>
      )}

      {/* Publish Toggle */}
      <Card elevation={2} sx={{ p: 2, mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isPublished}
              onChange={(e) => handleIsPublishedChange(e.target.checked)}
              color="success"
              disabled={actionLoading}
            />
          }
          label={
            <Box>
              <Typography variant="body2" fontWeight="medium">
                Publish Report to Students
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Toggle to make this report visible in student dashboards.
              </Typography>
            </Box>
          }
        />
      </Card>
    </Card>
  );
};

export default MaxScoresSection; 