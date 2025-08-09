import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
    TextField, Grid, ButtonGroup, Button, Typography, Stack, CircularProgress, InputAdornment,
    Avatar, Chip, Box, Paper, Divider, IconButton
} from '@mui/material';
import { BsSendPlus } from "react-icons/bs";
import { FaFilePdf, FaRegImage, FaRegFileAlt, FaEye, FaTrashAlt } from "react-icons/fa";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import MySnackbar from "@/app/Components/MySnackbar/MySnackbar";
import { mockTestService } from "@/app/services";
import { useImgUpload } from "@/app/hooks/auth/useImgUpload";

const EmailMainCom = forwardRef(({ 
    selectedItems, 
    onClear, 
    title = "Send Email",
    subjectDynamicFields = [], 
    bodyDynamicFields = [],
    formatEmailData,
}, ref) => {
    const snackRef = useRef();
    const subjectRef = useRef();
    const bodyRef = useRef();
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [attachmentUrls, setAttachmentUrls] = useState([]);
    const [loadingAttachment, setLoadingAttachment] = useState(false);
    const [loading, setLoading] = useState(false);
    // Expose imperative methods for parent components (Clear/Send)
    useImperativeHandle(ref, () => ({
        handleClear: () => handleClear(),
        handleSubmit: () => handleSendEmail(),
        handleSendEmail: () => handleSendEmail(),
    }));

    const insertAtCursor = (field, ref) => {
        const textarea = ref.current.querySelector('input, textarea');
        if (textarea && textarea.setSelectionRange) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = textarea.value;
            const before = text.substring(0, start);
            const after = text.substring(end, text.length);
            textarea.value = (before + field + after);
            textarea.setSelectionRange(start + field.length, start + field.length);
            textarea.focus();
            
            // Update state based on the ref used
            if (ref === subjectRef) {
                setEmailSubject(textarea.value);
            } else if (ref === bodyRef) {
                setEmailBody(textarea.value);
            }
        }
    };

    const handleClear = () => {
        if (onClear) onClear();
        setEmailSubject("");
        setEmailBody("");
        setAttachmentUrls([]);
    };

    const attachmentUpload = async (e) => {
        setLoadingAttachment(true);
        try {
            const url = await useImgUpload(e);
            if (url) {
                setAttachmentUrls(prev => [...prev, url]);
            } else {
                snackRef.current.handleSnack({ message: "File Not Selected", variant: "warning" });
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            snackRef.current.handleSnack({ message: "Failed to upload file", variant: "error" });
        } finally {
            setLoadingAttachment(false);
        }
    };

    const handleSendEmail = async () => {
        if (!emailSubject || !emailBody) {
            snackRef.current.handleSnack({ message: "Subject and body are required", variant: "warning" });
            return;
        }

        setLoading(true);
        try {
            for (const item of selectedItems) {
                // If a formatter function is provided, use it for personalization
                const emailData = formatEmailData ? 
                    formatEmailData(item, emailSubject, emailBody, attachmentUrls) : 
                    {
                        to: [{
                            email: item.user.email,
                            name: `${item.user.firstName} ${item.user.lastName}`,
                            id: item.user._id || null,
                        }],
                        emailSubject,
                        emailBody,
                        attachmentUrls,
                    };

                const response = await mockTestService.sendOneEmail(emailData);

                if (response.variant !== "success") {
                    snackRef.current.handleSnack(response);
                    setLoading(false);
                    return;
                }
            }

            snackRef.current.handleSnack({ message: "Emails sent successfully.", variant: "success" });
            handleClear();
        } catch (error) {
            console.error("Error sending email:", error);
            snackRef.current.handleSnack({ message: "Failed to send email.", variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    const deleteAttachment = (index) => {
        setAttachmentUrls(prev => prev.filter((_, i) => i !== index));
    };

    const showAttachment = (url) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    const getAttachmentType = (url) => {
        if (!url) return 'file';
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
            return 'image';
        } else if (extension === 'pdf') {
            return 'pdf';
        } else {
            return 'file';
        }
    };

    const AttachmentIcon = ({ url }) => {
        const type = getAttachmentType(url);
        switch (type) {
            case 'image':
                return <FaRegImage size={24} color="#2196f3" />;
            case 'pdf':
                return <FaFilePdf size={24} color="#f44336" />;
            default:
                return <FaRegFileAlt size={24} color="#757575" />;
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", alignItems: "center" }}>
                    <Typography 
                        color="secondary" 
                        style={{ fontFamily: 'Courgette' }} 
                        variant='h6'
                    >
                        {title}
                    </Typography>
                    <ButtonGroup variant="contained" size="small" sx={{ mt: { xs: 2, md: 0 } }}>
                        <Button 
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <BsSendPlus />} 
                            onClick={handleSendEmail}
                            disabled={loading || !emailSubject || !emailBody}
                            color="primary"
                        >
                            {loading ? "Sending..." : "Send Email"}
                        </Button>
                    </ButtonGroup>
                </Grid>

                <Grid item xs={12}>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>Recipients:</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                        {selectedItems.map((item, index) => (
                            <Chip 
                                key={index} 
                                avatar={<Avatar>{item.user.firstName.charAt(0)}</Avatar>} 
                                label={`${item.user.firstName} ${item.user.lastName} - ${item.user.email}`}
                                sx={{ mb: 1 }}
                            />
                        ))}
                    </Stack>
                </Grid>

                {subjectDynamicFields.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Insert Dynamic Fields for Subject:</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ my: 1 }}>
                            {subjectDynamicFields.map((field, index) => (
                                <Button 
                                    key={index} 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => insertAtCursor(field, subjectRef)}
                                    sx={{ mb: 1 }}
                                >
                                    {field}
                                </Button>
                            ))}
                        </Stack>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <TextField
                        ref={subjectRef}
                        id="email-subject"
                        fullWidth
                        label="Subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        inputProps={{ minLength: "2", maxLength: "250" }}
                        placeholder='Enter email subject'
                        variant="outlined"
                        required
                        error={!emailSubject}
                        helperText={!emailSubject ? "Subject is required" : ""}
                    />
                </Grid>

                {bodyDynamicFields.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">Insert Dynamic Fields for Body:</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ my: 1 }}>
                            {bodyDynamicFields.map((field, index) => (
                                <Button 
                                    key={index} 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => insertAtCursor(field, bodyRef)}
                                    sx={{ mb: 1 }}
                                >
                                    {field}
                                </Button>
                            ))}
                        </Stack>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <TextField
                        ref={bodyRef}
                        id="email-body"
                        label="Email Body"
                        value={emailBody}
                        inputProps={{ maxLength: "4000" }}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Write the email body"
                        fullWidth
                        multiline
                        rows={5}
                        variant="outlined"
                        required
                        error={!emailBody}
                        helperText={!emailBody ? "Email body is required" : ""}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Box sx={{ mb: 2 }}>
                        <input
                            type="file"
                            id="attachment-upload"
                            style={{ display: 'none' }}
                            onChange={(e) => attachmentUpload(e.target.files[0])}
                            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            disabled={loadingAttachment || loading}
                        />
                        <Paper
                            variant="outlined"
                            component="label"
                            htmlFor="attachment-upload"
                            sx={{
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 1,
                                borderStyle: 'dashed',
                                borderColor: 'primary.main',
                                bgcolor: 'background.paper',
                                cursor: loadingAttachment || loading ? 'not-allowed' : 'pointer',
                                opacity: loadingAttachment || loading ? 0.7 : 1,
                                transition: 'all 0.2s ease-in-out',
                                height: 80,
                                '&:hover': {
                                    bgcolor: 'action.hover',
                                    transform: loadingAttachment || loading ? 'none' : 'translateY(-2px)',
                                    boxShadow: loadingAttachment || loading ? 'none' : '0 4px 8px rgba(0,0,0,0.1)',
                                },
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center">
                                {loadingAttachment ? (
                                    <CircularProgress size={24} />
                                ) : (
                                    <MdOutlineAddCircleOutline size={24} color="#1976d2" />
                                )}
                                <Typography color="primary.main" variant="subtitle1">
                                    {loadingAttachment ? "Uploading..." : "Add Attachment"}
                                </Typography>
                            </Stack>
                        </Paper>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Upload images, PDFs or other files
                        </Typography>
                    </Box>
                    
                    {attachmentUrls.length > 0 && (
                        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2 }}>Attachments ({attachmentUrls.length})</Typography>
                            <Stack spacing={2}>
                                {attachmentUrls.map((url, index) => {
                                    const type = getAttachmentType(url);
                                    const fileName = url.split('/').pop();
                                    
                                    return (
                                        <Paper 
                                            key={index} 
                                            variant="outlined" 
                                            sx={{ 
                                                p: 2, 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between',
                                                borderRadius: 1
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, overflow: 'hidden' }}>
                                                <AttachmentIcon url={url} />
                                                <Typography variant="body2" noWrap title={fileName}>
                                                    {fileName}
                                                </Typography>
                                            </Box>
                                            
                                            {type === 'image' && (
                                                <Box 
                                                    sx={{ 
                                                        width: 40, 
                                                        height: 40, 
                                                        borderRadius: 1, 
                                                        overflow: 'hidden',
                                                        mr: 2,
                                                        display: { xs: 'none', sm: 'block' }
                                                    }}
                                                >
                                                    <img 
                                                        src={url} 
                                                        alt="Preview" 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    />
                                                </Box>
                                            )}
                                            
                                            <Box>
                                                <IconButton 
                                                    color="primary" 
                                                    onClick={() => showAttachment(url)}
                                                    size="small"
                                                    title="View attachment"
                                                >
                                                    <FaEye />
                                                </IconButton>
                                                <IconButton 
                                                    color="error" 
                                                    onClick={() => deleteAttachment(index)}
                                                    size="small"
                                                    title="Remove attachment"
                                                >
                                                    <FaTrashAlt />
                                                </IconButton>
                                            </Box>
                                        </Paper>
                                    );
                                })}
                            </Stack>
                        </Paper>
                    )}
                </Grid>
            </Grid>
            <MySnackbar ref={snackRef} />
        </Paper>
    );
});

export default EmailMainCom;
