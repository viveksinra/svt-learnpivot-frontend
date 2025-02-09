import React, { useState, useEffect } from 'react';
import {
    Box, IconButton, Typography, CircularProgress,
    Paper, Stack, Alert, Tooltip, styled
} from '@mui/material';
import {
    AddPhotoAlternate as AddPhotoIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    DragIndicator as DragIcon,
    Warning as WarningIcon
} from '@mui/icons-material';

const IMAGE_PREVIEW_SIZE = 100;

const DraggableBox = styled(Paper)(({ theme, isDragging }) => ({
    width: IMAGE_PREVIEW_SIZE,
    height: IMAGE_PREVIEW_SIZE,
    position: 'relative',
    cursor: 'move',
    transition: theme.transitions.create(['box-shadow', 'transform']),
    ...(isDragging && {
        boxShadow: theme.shadows[10],
        transform: 'scale(1.02)',
    }),
}));

const ImageOverlay = styled(Box)(({ theme }) => ({
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing(1),
    opacity: 0,
    transition: theme.transitions.create(['background-color', 'opacity']),
    '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        opacity: 1,
    },
}));

const FileUploadBox = ({ 
    onFileSelect, 
    disabled, 
    required,
    isLoading,
    index 
}) => (
    <Tooltip title={disabled ? "Please upload previous image first" : "Click to upload image"}>
        <Paper
            component="label"
            sx={{
                width: IMAGE_PREVIEW_SIZE,
                height: IMAGE_PREVIEW_SIZE,
                border: 2,
                borderStyle: 'dashed',
                borderColor: disabled ? 'grey.300' : 'primary.main',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: disabled ? 'grey.50' : 'background.paper',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'border-color 0.2s',
                '&:hover': {
                    borderColor: disabled ? 'grey.300' : 'primary.dark',
                }
            }}
        >
            <input
                type="file"
                hidden
                accept="image/*"
                onChange={onFileSelect}
                disabled={disabled}
            />
            {isLoading ? (
                <CircularProgress size={24} />
            ) : (
                <Stack spacing={1} alignItems="center">
                    {index === 0 && required && (
                        <WarningIcon color="warning" fontSize="small" />
                    )}
                    <AddPhotoIcon color={disabled ? 'disabled' : 'primary'} />
                    <Typography 
                        variant="caption" 
                        color={disabled ? 'text.disabled' : 'primary'}
                    >
                        {index === 0 ? 'Upload Cover' : 'Add Image'}
                    </Typography>
                </Stack>
            )}
        </Paper>
    </Tooltip>
);

const ImagePreview = ({ 
    url, 
    onDelete, 
    onView,
    index,
    isDragging,
    onDragStart,
    onDragEnd,
    onDragOver 
}) => (
    <DraggableBox
        elevation={isDragging ? 8 : 1}
        isDragging={isDragging}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
    >
        <Box
            component="img"
            src={url}
            alt={`Image ${index + 1}`}
            sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 1,
            }}
        />
        
        <ImageOverlay>
            <IconButton 
                size="small" 
                onClick={onView}
                sx={{ color: 'white' }}
            >
                <ViewIcon />
            </IconButton>
            <IconButton 
                size="small" 
                onClick={onDelete}
                sx={{ color: 'white' }}
            >
                <DeleteIcon />
            </IconButton>
        </ImageOverlay>

        <Box
            sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 10,
                typography: 'caption',
            }}
        >
            {index === 0 ? 'Cover' : `Image ${index + 1}`}
        </Box>

        <DragIcon 
            sx={{
                position: 'absolute',
                top: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                opacity: 0,
                transition: 'opacity 0.2s',
                color: 'text.secondary',
                '.MuiPaper-root:hover &': {
                    opacity: 1,
                },
            }}
        />
    </DraggableBox>
);

const MultiImageUpload = ({ 
    images = [""], 
    onImagesChange, 
    uploadFunction,
    maxImages = 5,
    required = false,
    title = "Images",
    helperText
}) => {
    const [imageUrls, setImageUrls] = useState([""]); // Start with one empty slot
    const [loadingStates, setLoadingStates] = useState([false]);
    const [error, setError] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);

    useEffect(() => {
        // If images prop changes, update state
        const updatedImages = [...images];
        if (updatedImages.length === 0 || updatedImages[updatedImages.length - 1] !== "") {
            if (updatedImages.length < maxImages) {
                updatedImages.push("");
            }
        }
        setImageUrls(updatedImages);
        setLoadingStates(Array(updatedImages.length).fill(false));
    }, [images, maxImages]);

    const handleUpload = async (e, index) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setError("Image size should be less than 5MB");
            return;
        }

        const newLoadingStates = [...loadingStates];
        newLoadingStates[index] = true;
        setLoadingStates(newLoadingStates);
        setError(null);

        try {
            const url = await uploadFunction(file);
            if (url) {
                const newImageUrls = [...imageUrls];
                newImageUrls[index] = url;

                // Add new empty slot if we haven't reached maxImages
                if (newImageUrls.length < maxImages && !newImageUrls.includes("")) {
                    newImageUrls.push("");
                    newLoadingStates.push(false);
                }

                setImageUrls(newImageUrls);
                onImagesChange(newImageUrls.filter(url => url !== ""));
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            setError("Failed to upload image. Please try again.");
        } finally {
            newLoadingStates[index] = false;
            setLoadingStates(newLoadingStates);
        }
    };

    const handleDelete = (index) => {
        const newImageUrls = [...imageUrls];
        newImageUrls.splice(index, 1);

        // Ensure we always have at least one slot and add an empty slot if needed
        if (newImageUrls.length === 0 || 
            (newImageUrls.length < maxImages && newImageUrls[newImageUrls.length - 1] !== "")) {
            newImageUrls.push("");
        }

        setImageUrls(newImageUrls);
        setLoadingStates(Array(newImageUrls.length).fill(false));
        onImagesChange(newImageUrls.filter(url => url !== ""));
        setError(null);
    };

    const handleView = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.target.style.opacity = '0.7';
    };

    const handleDragEnd = (e) => {
        setDraggedIndex(null);
        e.target.style.opacity = '1';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const items = Array.from(imageUrls);
        const draggedItem = items[draggedIndex];
        items.splice(draggedIndex, 1);
        items.splice(index, 0, draggedItem);
        
        setImageUrls(items);
        setDraggedIndex(index);
        onImagesChange(items.filter(url => url !== ""));
    };

    return (
        <Box sx={{ mt: 2, mb: 4 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2 
            }}>
                <Typography variant="subtitle1" fontWeight="medium">
                    {title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {imageUrls.filter(url => url !== "").length} / {maxImages} images
                </Typography>
            </Box>

            {error && (
                <Alert 
                    severity="error" 
                    onClose={() => setError(null)}
                    sx={{ mb: 2 }}
                >
                    {error}
                </Alert>
            )}

            {helperText && (
                <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ display: 'block', mb: 1 }}
                >
                    {helperText}
                </Typography>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                {imageUrls.map((url, index) => (
                    <Box key={url || `empty-${index}`}>
                        {url ? (
                            <ImagePreview
                                url={url}
                                onDelete={() => handleDelete(index)}
                                onView={() => handleView(url)}
                                index={index}
                                isDragging={draggedIndex === index}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, index)}
                            />
                        ) : (
                            <FileUploadBox
                                onFileSelect={(e) => handleUpload(e, index)}
                                disabled={index > 0 && !imageUrls[index - 1]}
                                required={required && index === 0}
                                isLoading={loadingStates[index]}
                                index={index}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default MultiImageUpload;