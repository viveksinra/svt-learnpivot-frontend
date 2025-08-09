"use client";

import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Chip,
  Box,
  Button,
  Tooltip,
  Collapse,
  useTheme,
  alpha
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PersonIcon from '@mui/icons-material/Person';

export default function PaperSelectionGrid({
  data,
  isMobile,
  selectedPapers,
  onTogglePaper,
  onToggleExtra,
  disabledIndexes = [],
  totalAmount = 0,
  onProceed,
  proceedDisabled
}) {
  const papers = data?.papers || [];
  const theme = useTheme();
  const [expandedCards, setExpandedCards] = React.useState({});

  const priceOf = (paper) => {
    const base = (paper && paper.priceOverride != null) ? Number(paper.priceOverride) : Number(data.onePaperPrice || 0);
    return base;
  };

  const toggleExpanded = (idx) => {
    setExpandedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 3, textAlign: 'left' }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            fontWeight: 700, 
            color: '#082952',
            mb: 1
          }}
        >
          {data?.setTitle}
        </Typography>
        {!!data?.shortDescription && (
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#64748b',
              maxWidth: '800px',
              mx: 0
            }}
          >
            {data.shortDescription}
          </Typography>
        )}
      </Box>

      {/* Papers Grid */}
      <Grid container spacing={2}>
        {papers.map((paper, idx) => {
          const selected = selectedPapers.find((sp) => sp.index === idx);
          const disabled = disabledIndexes.includes(idx);
          const isExpanded = expandedCards[idx] || false;
          
          return (
            <Grid item xs={12} key={idx}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: disabled ? 0.7 : 1,
                  border: selected ? `2px solid ${theme.palette.primary.main}` : '1px solid #e2e8f0',
                  bgcolor: selected ? alpha(theme.palette.primary.main, 0.02) : 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: disabled ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
                    transform: disabled ? 'none' : 'translateY(-2px)'
                  }
                }}
              >
                <CardContent sx={{ flex: 1, p: 2.5 }}>
                  {/* Paper Title and Price */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#1e293b',
                          flex: 1,
                          pr: 1
                        }}
                      >
                        {paper.title}
                      </Typography>
                      {disabled && (
                        <Chip 
                          icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                          label="Purchased" 
                          size="small" 
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        mb: 2
                      }}
                    >
                      £{priceOf(paper)}
                    </Typography>
                  </Box>

                  {/* Selection Checkbox */}
                  <Tooltip title={disabled ? 'Already purchased for this child' : ''} placement="top">
                    <Box 
                      sx={{ 
                        p: 1.5,
                        bgcolor: selected ? alpha(theme.palette.primary.main, 0.08) : '#f8fafc',
                        borderRadius: 2,
                        border: `1px solid ${selected ? theme.palette.primary.main : '#e2e8f0'}`
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={!!selected} 
                            disabled={disabled} 
                            onChange={() => onTogglePaper(idx)}
                            color="primary"
                          />
                        }
                        label={
                          <Typography sx={{ fontWeight: selected ? 600 : 400 }}>
                            {selected ? 'Selected' : 'Select this paper'}
                          </Typography>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </Box>
                  </Tooltip>

                  {/* Additional Services */}
                  {selected && (paper.allowCheckingService || paper.allowOneOnOneService) && (
                    <>
                      <Button
                        onClick={() => toggleExpanded(idx)}
                        endIcon={isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        sx={{ 
                          mt: 1.5, 
                          color: '#64748b',
                          textTransform: 'none',
                          fontWeight: 500
                        }}
                      >
                        Additional Services
                      </Button>
                      
                      <Collapse in={isExpanded}>
                        <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {paper.allowCheckingService && (
                            <Box 
                              sx={{ 
                                p: 1.5,
                                bgcolor: selected.extras?.checking ? alpha(theme.palette.secondary.main, 0.08) : '#f8fafc',
                                borderRadius: 1,
                                border: `1px solid ${selected.extras?.checking ? theme.palette.secondary.main : '#e2e8f0'}`
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox 
                                    checked={!!selected.extras?.checking} 
                                    onChange={() => onToggleExtra(idx, 'checking')}
                                    color="secondary"
                                  />
                                }
                                label={
                                  <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <AssignmentTurnedInIcon sx={{ fontSize: 20, color: '#64748b' }} />
                                      <Typography sx={{ fontWeight: 500 }}>Checking Service</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                                      +£{paper.checkingServicePrice || 0}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ m: 0, alignItems: 'flex-start' }}
                              />
                            </Box>
                          )}
                          
                          {paper.allowOneOnOneService && (
                            <Box 
                              sx={{ 
                                p: 1.5,
                                bgcolor: selected.extras?.oneOnOne ? alpha(theme.palette.secondary.main, 0.08) : '#f8fafc',
                                borderRadius: 1,
                                border: `1px solid ${selected.extras?.oneOnOne ? theme.palette.secondary.main : '#e2e8f0'}`
                              }}
                            >
                              <FormControlLabel
                                control={
                                  <Checkbox 
                                    checked={!!selected.extras?.oneOnOne} 
                                    onChange={() => onToggleExtra(idx, 'oneOnOne')}
                                    color="secondary"
                                  />
                                }
                                label={
                                  <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <PersonIcon sx={{ fontSize: 20, color: '#64748b' }} />
                                      <Typography sx={{ fontWeight: 500 }}>1:1 Explanation</Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ color: '#64748b', mt: 0.5 }}>
                                      +£{paper.oneOnOnePrice || 0}
                                    </Typography>
                                  </Box>
                                }
                                sx={{ m: 0, alignItems: 'flex-start' }}
                              />
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Sticky Bottom Section */}
      <Box 
        sx={{ 
          position: 'sticky', 
          bottom: 0, 
          zIndex: 100, 
          mt: 3,
          bgcolor: 'white', 
          borderTop: '1px solid #e2e8f0'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: 2,
            p: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 0.5 }}>
                Total Amount
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>
                £{Number(totalAmount || 0).toFixed(2)}
              </Typography>
            </Box>
            {selectedPapers.length > 0 && (
              <Chip
                icon={<ShoppingCartIcon />}
                label={`${selectedPapers.length} paper${selectedPapers.length > 1 ? 's' : ''} selected`}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
          
          <Button 
            variant="contained" 
            size={isMobile ? 'medium' : 'large'}
            startIcon={<ShoppingCartIcon />}
            onClick={onProceed} 
            disabled={!!proceedDisabled}
            sx={{
              px: 3,
              py: 1.2,
              fontWeight: 600
            }}
          >
            Proceed to Pay
          </Button>
        </Box>
      </Box>
    </Box>
  );
}


