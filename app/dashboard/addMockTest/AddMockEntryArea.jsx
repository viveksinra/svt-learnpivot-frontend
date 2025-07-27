import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import {
    TextField, Grid, ButtonGroup, Button, Typography, Accordion, AccordionSummary, AccordionDetails,
    IconButton, Stack, Checkbox, FormControlLabel, Paper
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { FcNoIdea, FcOk, FcExpand } from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import MySnackbar from "../../Components/MySnackbar/MySnackbar";
import { dashboardService, mockTestService } from "../../services";
import { todayDate } from "../../Components/StaticData";
import { useImgUpload } from "@/app/hooks/auth/useImgUpload";
import MultiImageUpload from '@/app/Components/Common/MultiImageUpload';
import frontKey from "@/app/utils/frontKey";

const stripeKeys = frontKey.stripeKeys || (frontKey.default ? frontKey.default.stripeKeys : []);

const AddMockEntryArea = forwardRef((props, ref) => {
    const snackRef = useRef();
    const [isPublished, setIsPublished] = useState(false);
    const [mockTestTitle, setMockTestTitle] = useState("");
    const [mockTestLink, setMockTestLink] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [pincode, setPincode] = useState("");
    const [highlightedText, setHighlightedText] = useState("");
    const [blinkText, setBlinkText] = useState(null);
    const [testType, setTestType] = useState(null);
    const [location, setLocation] = useState(null);
    const [fullDescription, setFullDescription] = useState("");
    const [totalSeat, setTotalSeat] = useState("");
    const [imageUrls, setImageUrls] = useState([""]);
    const [batch, setBatch] = useState([{ 
        date: todayDate(), 
        startTime: "", 
        endTime: "", 
        totalSeat: 100, 
        oneBatchprice: 40, 
        filled: false,
        byPassBookingFull: false,
        allowWaitingList: false,
        selectedUsers: []
    }]);
    const [PAccordion, setPAccordion] = useState(false);
    const [privateAccordion, setPrivateAccordion] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [stripeAccount, setStripeAccount] = useState(null);
    const [allowWaitingList, setAllowWaitingList] = useState(false);

    const getAllUsers = async () => {
        let res = await dashboardService.getAllUserForDropDown();
        if (res.variant === "success") {
            setAllUsers(res.data);
        } else {
            snackRef.current.handleSnack(res);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    const AllBlinkText = [
        { label: "High Demand", id: "highDemand" },
         { label: "Few Seat Left", id: "fewSeatLeft" },
         { label: "Onsite Test", id: "onsiteTest" },
        ];
    const allTestType = [{ label: "FSCE", id: "fsce" }, { label: "CSSE", id: "csse" }];
    const allLocation = [
        { label: "Broomfield Village Hall 158 Main Rd, Broomfield, Chelmsford, CM1 7AH", id: "location1" },
    ];

    function convertToSlug(text) {
        return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }

    const onTitleChange = (e) => {
        setMockTestTitle(e.target.value);
        setMockTestLink(convertToSlug(e.target.value));
    };
    const findUserDetails = (userId) => {
        const user = allUsers.find(user => user._id === userId);
        return user || { 
            firstName: 'User',
            lastName: 'not found', 
            email: 'No email', 
            mobile: 'No mobile',
            _id: userId 
        };
    };
    useEffect(() => {
        async function getOneData() {
            try {
                const res = await mockTestService.getOne(props.id);
                if (res.variant === "success") {
                    const {
                        isPublished, mockTestTitle, mockTestLink, shortDescription, pincode, highlightedText,
                        blinkText, testType, location, stripeAccount: stripeAccountData, imageUrls, fullDescription, totalSeat, batch, allowWaitingList: waitingList,
                    } = res.data;
                    setIsPublished(isPublished);
                    setMockTestTitle(mockTestTitle);
                    setMockTestLink(mockTestLink);
                    setShortDescription(shortDescription);
                    setHighlightedText(highlightedText);
                    setPincode(pincode);
                    setBlinkText(blinkText);
                    setTestType(testType);
                    setLocation(location);
                    setStripeAccount(stripeAccountData || null);
                    setImageUrls(imageUrls?.length ? imageUrls : [""]);
                    setFullDescription(fullDescription);
                    setTotalSeat(totalSeat);
                    setBatch(batch.map(b => ({
                        ...b,
                        date: b.date.split('T')[0],
                        byPassBookingFull: b.byPassBookingFull || false,
                        allowWaitingList: b.allowWaitingList || false,
                        selectedUsers: b.selectedUsers || []
                    })));
                    setAllowWaitingList(waitingList || false);
                    setPAccordion(true);
                    snackRef.current.handleSnack(res);
                } else {
                    snackRef.current.handleSnack(res);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                snackRef.current.handleSnack({ fullDescription: "Failed to fetch data.", variant: "error" });
            }
        }

        if (props.id) {
            getOneData();
        }
    }, [props.id]);

    const handleClear = () => {
        props.setId("");
        setIsPublished(false);
        setMockTestTitle("");
        setMockTestLink("");
        setShortDescription("");
        setHighlightedText("");
        setPincode("");
        setBlinkText(null);
        setTestType(null);
        setLocation(null);
        setFullDescription("");
        setTotalSeat("");
        setImageUrls([""]);
        setBatch([{ 
            date: todayDate(), 
            startTime: "", 
            endTime: "", 
            totalSeat: 0, 
            oneBatchprice: 0, 
            filled: false,
            byPassBookingFull: false,
            allowWaitingList: false,
            selectedUsers: []
        }]);
        setStripeAccount(null);
        setAllowWaitingList(false);
        setPAccordion(true);
    };

    const handleDelete = async () => {
        try {
            const yes = window.confirm(`Do you really want to permanently delete ${mockTestTitle}?`);
            if (yes) {
                const response = await mockTestService.delete(`api/v1/publicMaster/mockTest/addMockTest/deleteOne/${props.id}`);
                if (response.variant === "success") {
                    snackRef.current.handleSnack(response);
                    handleClear();
                } else {
                    snackRef.current.handleSnack(response?.response?.data);
                }
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            snackRef.current.handleSnack({ fullDescription: "Failed to delete data.", variant: "error" });
        }
    };

    const handleBatchChange = (index, field, value) => {
        const updatedBatch = [...batch];
        updatedBatch[index][field] = value;
        setBatch(updatedBatch);
    };

    const addBatchEntry = () => {
        setBatch([...batch, { 
            date: todayDate(), 
            startTime: "", 
            endTime: "", 
            totalSeat: 0, 
            oneBatchprice: 0, 
            filled: false,
            byPassBookingFull: false,
            allowWaitingList: false,
            selectedUsers: []
        }]);
    };

    const removeBatchEntry = (index) => {
        if (window.confirm('Are you sure you want to delete this batch?')) {
            const updatedBatch = batch.filter((_, i) => i !== index);
            setBatch(updatedBatch);
        }
    };

    useImperativeHandle(ref, () => ({
        handleSubmit: async () => {
            try {
                const myMockTestData = {
                    _id: props.id,
                    mockTestTitle,
                    mockTestLink,
                    pincode,
                    highlightedText,
                    shortDescription,
                    blinkText,
                    testType,
                    location,
                    stripeAccount,
                    fullDescription,
                    totalSeat,
                    imageUrls,
                    isPublished,
                    allowWaitingList,
                    batch
                };
                const response = await mockTestService.add(props.id, myMockTestData);
                if (response.variant === "success") {
                    snackRef.current.handleSnack(response);
                    handleClear();
                } else {
                    snackRef.current.handleSnack(response);
                }
            } catch (error) {
                console.error("Error submitting data:", error);
                snackRef.current.handleSnack({ fullDescription: "Failed to submit data.", variant: "error" });
            }
        },
        handleClear: () => handleClear()
    }));

    const renderUserSelect = (batchIndex) => {
        // Sort users by firstName
        const sortedUsers = [...allUsers].sort((a, b) => {
            const nameA = (a.firstName || '').toLowerCase();
            const nameB = (b.firstName || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });

        return (
            <Autocomplete
                multiple
                id={`user-select-${batchIndex}`}
                options={sortedUsers}
                value={batch[batchIndex].selectedUsers.map(userId => findUserDetails(userId))
                    .sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''))}
                onChange={(event, newValue) => {
                    handleBatchChange(batchIndex, 'selectedUsers', newValue.map(user => user._id));
                }}
                getOptionLabel={(option) => 
                    `${option.firstName || ''} ${option.lastName || ''} (${option.email || ''}) (${option.mobile || ''})`
                }
                disableCloseOnSelect
                filterOptions={(options, { inputValue }) => {
                    const searchTerms = inputValue.toLowerCase().split(' ');
                    return options.filter(option => 
                        searchTerms.every(term =>
                            option.firstName?.toLowerCase().includes(term) ||
                            option.lastName?.toLowerCase().includes(term) ||
                            option.email?.toLowerCase().includes(term) ||
                            option.mobile?.toLowerCase().includes(term)
                        )
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Select Users"
                        placeholder="Search by name, email or mobile"
                    />
                )}
                renderOption={(props, option) => {
                    const isSelected = batch[batchIndex].selectedUsers.includes(option._id);
                    return (
                        <li {...props} key={option._id}>
                            <Checkbox
                                checked={isSelected}
                                style={{ marginRight: 8 }}
                            />
                            <Typography>
                                {option.firstName} {option.lastName}
                                <Typography component="span" color="textSecondary" sx={{ ml: 1 }}>
                                    ({option.mobile}) • {option.email}
                                </Typography>
                            </Typography>
                        </li>
                    );
                }}
                isOptionEqualToValue={(option, value) => option._id === value._id}
            />
        );
    };

    /* Stripe Account dropdown */
    const renderStripeAccountSelect = () => (
        <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                options={stripeKeys}
                value={stripeAccount}
                onChange={(e, v) => setStripeAccount(v)}
                renderOption={(props, option) => (
                    <li {...props} key={option.id}>{option.label}</li>
                )}
                renderInput={(params) => <TextField {...params} label="Stripe Account" variant="standard" fullWidth />}
            />
        </Grid>
    );

    return (
        <main style={{ background: "#fff", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius: "10px", padding: 20, maxWidth: '100vw', overflowX: 'hidden' }}>
            <Grid container spacing={2} sx={{ flexDirection: { xs: "column", md: "row" }, alignItems: { xs: "flex-start", md: "center" }, justifyContent: "space-between", mb: 2 }}>
                <Grid item xs={12} md={6}>
                    <Typography color="secondary" style={{ fontFamily: 'Courgette' }} align='center' variant='h6'>
                        Create MockTest
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, mt: { xs: 1, md: 0 } }}>
                    <ButtonGroup variant="text" aria-label="text button group">
                        <Button 
                            startIcon={isPublished ? <FcOk /> : <FcNoIdea />} 
                            onClick={() => setIsPublished(!isPublished)}
                            sx={{ minWidth: 120 }}
                        >
                            {isPublished ? "Published" : "Un-Publish"}
                        </Button>
                        <Button 
                            endIcon={<MdDeleteForever />} 
                            onClick={handleDelete} 
                            disabled={!props.id} 
                            color="error"
                            sx={{ minWidth: 120 }}
                        >
                            Delete
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="MockTest Title"
                        value={mockTestTitle}
                        onChange={onTitleChange}
                        inputProps={{ minLength: "2", maxLength: "30" }}
                        placeholder='MockTest Title'
                        variant="standard"
                        required={true}
                        sx={{ mb: { xs: 1, md: 0 } }}
                    />
                    <Typography variant="subtitle2" gutterBottom sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>Link- {mockTestLink}</Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Pin Code"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        inputProps={{ minLength: "2", maxLength: "100" }}
                        placeholder='Pin Code'
                        variant="standard"
                        sx={{ mb: { xs: 1, md: 0 } }}
                    />
                </Grid>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="highlighted Text"
                        value={ highlightedText}
                        onChange={(e) =>  setHighlightedText(e.target.value)}
                        inputProps={{ minLength: "2", maxLength: "100" }}
                        placeholder='Highlighted Text'
                        variant="standard"
                        sx={{ mb: { xs: 1, md: 0 } }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Short Description"
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        inputProps={{ minLength: "2", maxLength: "100" }}
                        placeholder='Short Description'
                        variant="standard"
                        sx={{ mb: { xs: 1, md: 0 } }}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={AllBlinkText}
                        value={blinkText}
                        onChange={(e, v) => setBlinkText(v)}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>{option.label}</li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Blink Text" variant="standard" fullWidth />}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={allTestType}
                        value={testType}
                        onChange={(e, v) => setTestType(v)}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>{option.label}</li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Test Type" variant="standard" fullWidth />}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={allLocation}
                        value={location}
                        onChange={(e, v) => setLocation(v)}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>{option.label}</li>
                        )}
                        renderInput={(params) => <TextField {...params} label="Location" variant="standard" fullWidth />}
                    />
                </Grid>
                {/* Stripe account selection */}
                {renderStripeAccountSelect()}
                <Grid item xs={12}>
                    <MultiImageUpload
                        images={imageUrls}
                        onImagesChange={setImageUrls}
                        uploadFunction={useImgUpload}
                        maxImages={5}
                        required={true}
                        title="Thumbnail Images"
                        helperText="Drag images to reorder. First image will be used as cover."
                    />
                </Grid>
            </Grid>

            <div style={{ margin: '30px 0' }}></div>
            <Accordion expanded={privateAccordion} style={{marginBottom:"30px"}} sx={{ width: '100%' }}>
                <AccordionSummary
                    expandIcon={<IconButton > <FcExpand /> </IconButton>}
                    aria-controls="PrivateInformation"
                    id="PrivateInformation"
                    onClick={() => setPrivateAccordion(!privateAccordion)}
                >
                    <Typography>Booking Rules</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle2" gutterBottom>
                        Booking rules are now configured individually for each batch below.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {batch.map((entry, index) => (
                <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, mb: 2, borderRadius: '10px', width: '100%', overflowX: 'auto' }} key={index}>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>Batch {index + 1}</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Date"
                                type="date"
                                value={entry.date}
                                onChange={(e) => handleBatchChange(index, 'date', e.target.value)}
                                fullWidth
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={2}>
                            <TextField
                                label="Start Time"
                                type="time"
                                value={entry.startTime}
                                onChange={(e) => handleBatchChange(index, 'startTime', e.target.value)}
                                fullWidth
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={2}>
                            <TextField
                                label="End Time"
                                type="time"
                                value={entry.endTime}
                                onChange={(e) => handleBatchChange(index, 'endTime', e.target.value)}
                                fullWidth
                                variant="standard"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={1}>
                            <TextField
                                label="Total Seats"
                                type="number"
                                value={entry.totalSeat}
                                onChange={(e) => handleBatchChange(index, 'totalSeat', e.target.value)}
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={6} sm={6} md={2}>
                            <TextField
                                label="One Batch Price"
                                type="number"
                                value={entry.oneBatchprice}
                                onChange={(e) => handleBatchChange(index, 'oneBatchprice', e.target.value)}
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={entry.filled}
                                        onChange={(e) => handleBatchChange(index, 'filled', e.target.checked)}
                                    />
                                }
                                label="Filled"
                            />
                        </Grid>
                        {batch.length > 1 && (
                            <Grid item xs={12} sm={6} md={1}>
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    onClick={() => removeBatchEntry(index)}
                                    fullWidth
                                    sx={{ mt: { xs: 1, md: 0 } }}
                                >
                                    Delete
                                </Button>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                                Booking Rules for Batch {index + 1}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControlLabel 
                                control={
                                    <Checkbox
                                        checked={entry.byPassBookingFull}
                                        onChange={(e) => handleBatchChange(index, 'byPassBookingFull', e.target.checked)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />               
                                } 
                                label={`By-Pass Booking Full`} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <FormControlLabel 
                                control={
                                    <Checkbox
                                        checked={entry.allowWaitingList}
                                        onChange={(e) => handleBatchChange(index, 'allowWaitingList', e.target.checked)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />               
                                } 
                                label={`Allow Waiting List`} 
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}>
                            {renderUserSelect(index)}
                        </Grid>
                    </Grid>
                </Paper>
            ))}

            <Grid container>
                <Grid item xs={12}>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={addBatchEntry}
                        fullWidth
                        sx={{ mt: 1, mb: 2 }}
                        disabled={!batch[batch.length - 1].date || 
                                 !batch[batch.length - 1].startTime || 
                                 !batch[batch.length - 1].endTime || 
                                 !batch[batch.length - 1].totalSeat}
                    >
                        Add Batch Entry
                    </Button>
                </Grid>
            </Grid>

            <Accordion expanded={PAccordion} onChange={() => setPAccordion(!PAccordion)} sx={{ width: '100%' }}>
                <AccordionSummary
                    expandIcon={<IconButton><FcExpand /></IconButton>}
                    aria-controls="ProspectInformation"
                    id="ProspectInformation"
                >
                    <Typography>Additional Optional Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <FormControlLabel 
                                control={
                                    <Checkbox
                                        checked={allowWaitingList}
                                        onChange={() => setAllowWaitingList(!allowWaitingList)}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />               
                                } 
                                label={`Allow Waiting List`} 
                            />
                            <Typography variant="caption" color="text.secondary" display="block">
                                Enable waiting list for full batches
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Full Description"
                                value={fullDescription}
                                inputProps={{ maxLength: "4000" }}
                                onChange={(e) => setFullDescription(e.target.value)}
                                placeholder="Write the Long Description about the MockTest"
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                sx={{ fontSize: { xs: '0.95rem', md: '1rem' } }}
                            />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <MySnackbar ref={snackRef} />
        </main>
    );
});

export default AddMockEntryArea;