import React, { useState, useRef, forwardRef } from 'react';
import {
    TextField, Grid, ButtonGroup, Button, Typography, Stack, CircularProgress, InputAdornment,
    Avatar, Chip, Box
} from '@mui/material';
import { BsSendPlus } from "react-icons/bs";
import MySnackbar from "../../Components/MySnackbar/MySnackbar";
import { mockTestService } from "../../services";
import { useImgUpload } from "@/app/hooks/auth/useImgUpload";

const SendEmailCom = forwardRef((props, ref) => {
    const snackRef = useRef();
    const subjectRef = useRef();
    const bodyRef = useRef();
    const [emailSubject, setEmailSubject] = useState("");
    const [emailBody, setEmailBody] = useState("");
    const [attachmentUrl, setAttachmentUrl] = useState("");
    const [loadingAttachment, setLoadingAttachment] = useState(false);

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
        props.setId("");
        setEmailSubject("");
        setEmailBody("");
        setAttachmentUrl("");
    };

    const attachmentUpload = async (e) => {
        setLoadingAttachment(true);
        const url = await useImgUpload(e);
        if (url) {
            setAttachmentUrl(url);
            setLoadingAttachment(false);
        } else {
            snackRef.current.handleSnack({ message: "Image Not Selected", info: "warning" });
            setLoadingAttachment(false);
        }
    };

    const handleSendEmail = async () => {
        try {
            for (const item of props.selectedItems) {
                const personalizedSubject = emailSubject
                    .replace(/{name}/g, `${item.user.firstName} ${item.user.lastName}`)
                    .replace(/{email}/g, item.user.email)
                    .replace(/{childName}/g, item.childId.childName)
                    .replace(/{batchDates}/g, item.selectedDates.join(', '))
                    .replace(/{courseTitle}/g, item.courseId.courseTitle);

                const personalizedBody = emailBody
                    .replace(/{name}/g, `${item.user.firstName} ${item.user.lastName}`)
                    .replace(/{email}/g, item.user.email)
                    .replace(/{childName}/g, item.childId.childName)
                    .replace(/{batchDates}/g, item.selectedDates.join(', '))
                    .replace(/{courseTitle}/g, item.courseId.courseTitle);

                const emailData = {
                    to: [{
                        email: item.user.email,
                        name: `${item.user.firstName} ${item.user.lastName}`,
                        id: item.user._id || null,
                    }],
                    emailSubject: personalizedSubject,
                    emailBody: personalizedBody,
                    attachmentUrl,
                };

                const response = await mockTestService.sendMultiEmail(emailData);

                if (response.variant !== "success") {
                    snackRef.current.handleSnack(response);
                    return;
                }
            }

            snackRef.current.handleSnack({ message: "Emails sent successfully.", variant: "success" });
            handleClear();
        } catch (error) {
            console.error("Error sending email:", error);
            snackRef.current.handleSnack({ message: "Failed to send email.", variant: "error" });
        }
    };

    const deleteAttachment = () => setAttachmentUrl("");

    const showAttachment = () => {
        if (attachmentUrl) {
            window.open(attachmentUrl, '_blank');
        }
    };

    return (
        <main style={{ background: "#fff", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius: "10px", padding: 20 }}>
            <Grid sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between" }}>
                <Typography color="secondary" style={{ fontFamily: 'Courgette' }} align='center' variant='h6'>Send Email</Typography>
                <ButtonGroup variant="text" aria-label="text button group">
                    <Button startIcon={<BsSendPlus />} onClick={handleSendEmail}>Send Email</Button>
                </ButtonGroup>
            </Grid>
            <Box my={2}>
                <Typography variant="subtitle1">Insert Dynamic Fields for Subject:</Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => insertAtCursor('{name}', subjectRef)}>{'{name}'}</Button>
                    <Button variant="outlined" onClick={() => insertAtCursor('{email}', subjectRef)}>{'{email}'}</Button>
                    <Button variant="outlined" onClick={() => insertAtCursor('{childName}', subjectRef)}>{'{childName}'}</Button>
                    <Button variant="outlined" onClick={() => insertAtCursor('{batchDates}', subjectRef)}>{'{batchDates}'}</Button>
                    <Button variant="outlined" onClick={() => insertAtCursor('{courseTitle}', subjectRef)}>{'{courseTitle}'}</Button>
                </Stack>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    To:
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {props.selectedItems.map((item, index) => (
                            <Chip key={index} avatar={<Avatar>{item.user.firstName.charAt(0)}</Avatar>} label={`${item.user.firstName} ${item.user.lastName} - ${item.user.email}`} />
                        ))}
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        ref={subjectRef}
                        id="email-subject"
                        fullWidth
                        label="Subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        inputProps={{ minLength: "2", maxLength: "250" }}
                        placeholder='Subject'
                        variant="outlined"
                        required
                    />
                </Grid>
            </Grid>
            <Box my={2}>
                <Typography variant="subtitle1">Insert Dynamic Fields for Body:</Typography>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={() => insertAtCursor('{name}', bodyRef)}>{'{name}'}</Button>
                    <Button variant="outlined" onClick={() => insertAtCursor('{email}', bodyRef)}>{'{email}'}</Button>
                    <Button variant="outlined" onClick={() => insertAtCursor('{childName}', bodyRef)}>{'{childName}'}</Button>
                    <Button variant="outlined" onClick={() => insertAtCursor('{batchDates}', bodyRef)}>{'{batchDates}'}</Button>
                    <Button variant="outlined" onClick={() => insertAtCursor('{courseTitle}', bodyRef)}>{'{courseTitle}'}</Button>
                </Stack>
            </Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        ref={bodyRef}
                        id="email-body"
                        label="Body"
                        value={emailBody}
                        inputProps={{ maxLength: "4000" }}
                        onChange={(e) => setEmailBody(e.target.value)}
                        placeholder="Write the email body"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    {!attachmentUrl ? (
                        <TextField
                            label="Add Attachment"
                            size="small"
                            required
                            disabled={loadingAttachment}
                            helperText="Upload attachment file here."
                            inputProps={{ accept: "image/*,pdf/*" }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">
                                        {loadingAttachment && <CircularProgress size={25} />}{" "}
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => attachmentUpload(e.target.files[0])}
                            type="file"
                            focused
                            fullWidth
                        />
                    ) : (
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="success" onClick={showAttachment}>Show File</Button>
                            <Button variant="outlined" color="error" onClick={deleteAttachment}>Delete File</Button>
                        </Stack>
                    )}
                </Grid>
            </Grid>
            <MySnackbar ref={snackRef} />
        </main>
    );
});

export default SendEmailCom;
