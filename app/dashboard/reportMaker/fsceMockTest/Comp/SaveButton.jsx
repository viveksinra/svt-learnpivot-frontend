import { Box, Button, Tooltip, CircularProgress, useTheme } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const SaveButton = ({
  mockTestExists,
  showCreateForm,
  actionLoading,
  handleSave,
  handleSaveChanges,
  onCalculateRanks
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        position: { xs: 'static', sm: 'sticky' },
        bottom: 24,
        zIndex: 20,
        mb: 2,
      }}
    >
      <Button
        variant="outlined"
        color="secondary"
        onClick={onCalculateRanks}
        disabled={actionLoading}
        size="large"
        sx={{
          borderRadius: 8,
          px: 3,
          mr: 2,
          fontWeight: 'bold'
        }}
      >
        Calculate Ranks
      </Button>

      {mockTestExists ? (
        <Tooltip title="Save all scores for this mock test">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={actionLoading}
            size="large"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 8,
              px: 4,
              py: 1.5,
              boxShadow: 6,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px) scale(1.03)',
                boxShadow: 10,
              },
            }}
          >
            {actionLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                Saving...
              </>
            ) : (
              'Save Scores'
            )}
          </Button>
        </Tooltip>
      ) : showCreateForm && (
        <Tooltip title="Create new mock test report with these scores">
          <Button
            variant="contained"
            color="success"
            onClick={handleSaveChanges}
            disabled={actionLoading}
            size="large"
            startIcon={<SaveIcon />}
            sx={{
              borderRadius: 8,
              px: 4,
              py: 1.5,
              boxShadow: 6,
              fontWeight: 'bold',
              fontSize: '1.1rem',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px) scale(1.03)',
                boxShadow: 10,
              },
            }}
          >
            {actionLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                Creating...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </Tooltip>
      )}
    </Box>
  );
};

export default SaveButton; 