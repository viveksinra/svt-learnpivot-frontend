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
  useTheme
} from '@mui/material';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const SubjectOptions = [
  { value: 'math', label: 'Mathematics' },
  { value: 'english', label: 'English' }
];

const MaxScoresSection = ({ paperSections, handleUpdatePaperSections, actionLoading }) => {
  const theme = useTheme();
  
  const handleAddPaper = () => {
    const paperNumber = paperSections.length + 1;
    handleUpdatePaperSections([
      ...paperSections,
      {
        paperId: Date.now().toString(),
        paperName: `Paper ${paperNumber}`,
        sections: []
      }
    ]);
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
    const updatedPapers = paperSections.filter((_, idx) => idx !== paperIndex);
    // Rename papers if needed
    const renamedPapers = updatedPapers.map((paper, index) => ({
      ...paper,
      paperName: paper.paperName.startsWith('Paper ') ? `Paper ${index + 1}` : paper.paperName
    }));
    handleUpdatePaperSections(renamedPapers);
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

  return (
    <Card elevation={2} sx={{ mb: 4, borderRadius: 3, p: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <EmojiObjectsIcon color="warning" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold" color="text.primary">
            Exam Structure and Maximum Scores
          </Typography>
          <Tooltip title="Define papers, sections and maximum scores for each section" placement="right">
            <InfoOutlinedIcon color="info" sx={{ ml: 1 }} />
          </Tooltip>
        </Box>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<AddIcon />}
          onClick={handleAddPaper}
          disabled={actionLoading}
        >
          Add Paper
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {paperSections.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="text.secondary">
            No papers defined yet. Click "Add Paper" to create your exam structure.
          </Typography>
        </Box>
      ) : (
        paperSections.map((paper, paperIndex) => (
          <Box key={paper.paperId} sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <TextField
                label="Paper Name"
                value={paper.paperName}
                onChange={(e) => handlePaperNameChange(paperIndex, e.target.value)}
                variant="outlined"
                size="small"
                sx={{ width: '50%' }}
                disabled={actionLoading}
              />
              <IconButton 
                color="error" 
                onClick={() => handleDeletePaper(paperIndex)}
                disabled={actionLoading}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {paper.sections.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
                No sections added to this paper yet.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Section Name</Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Subject</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Max Score</Typography>
                </Grid>
                <Grid item xs={12} sm={1}>
                  {/* Empty header for delete button column */}
                </Grid>
                
                {paper.sections.map((section, sectionIndex) => (
                  <React.Fragment key={section.sectionId}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        placeholder="E.g., Comprehension, Spelling, etc."
                        value={section.sectionName}
                        onChange={(e) => handleSectionNameChange(paperIndex, sectionIndex, e.target.value)}
                        disabled={actionLoading}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <FormControl fullWidth size="small">
                        <Select
                          value={section.subject}
                          onChange={(e) => handleSubjectChange(paperIndex, sectionIndex, e.target.value)}
                          disabled={actionLoading}
                        >
                          {SubjectOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        fullWidth
                        type="number"
                        value={section.maxScore}
                        onChange={(e) => handleMaxScoreChange(paperIndex, sectionIndex, e.target.value)}
                        InputProps={{
                          inputProps: { min: 0 },
                        }}
                        disabled={actionLoading}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={1} sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        color="error" 
                        size="small"
                        onClick={() => handleDeleteSection(paperIndex, sectionIndex)}
                        disabled={actionLoading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => handleAddSection(paperIndex)}
                disabled={actionLoading}
              >
                Add Section
              </Button>
            </Box>
          </Box>
        ))
      )}
    </Card>
  );
};

export default MaxScoresSection; 