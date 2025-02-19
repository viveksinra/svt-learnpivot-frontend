import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { TextField, Grid, ButtonGroup, Button, Typography, Accordion, AccordionSummary, AccordionDetails, IconButton, InputAdornment, CircularProgress, Stack, Checkbox, FormControlLabel, FormControl, InputLabel, OutlinedInput, FilledInput, Switch } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { FcNoIdea, FcOk, FcExpand } from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import MySnackbar from "../../Components/MySnackbar/MySnackbar";
import { dashboardService, myCourseService } from "../../services";
import { useImgUpload } from "@/app/hooks/auth/useImgUpload";
import DateSelector from './dateSelector';
import MultiImageUpload from '@/app/Components/Common/MultiImageUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { FiCopy } from "react-icons/fi"; // Add this import at the top

const EntryArea = forwardRef((props, ref) => {
    const snackRef = useRef();
    const [isPublished, setIsPublished] = useState(false);
    const [allBatch, setAllBatch] = useState([{
        oneBatch: [''],
        hide: false,
        bookingFull: false
    }]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [courseTitle, setCourseTitle] = useState("");
    const [courseLink, setCourseLink] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [oneClassPrice, setOneClassPrice] = useState("");
    const [discountOnFullClass, setDiscountOnFullClass] = useState("0");
    const [courseClass, setCourseClass] = useState(null);
    const [courseType, setCourseType] = useState(null);
    const [duration, setDuration] = useState(null);
    const [fullDescription, setFullDescription] = useState("");
    const [totalSeat, setTotalSeat] = useState("");
    const [filledSeat, setFilledSeats] = useState("");
    const [showRemaining, setShowRemaining] = useState(false);
    const [imageUrls, setImageUrls] = useState([""]); // Start with one empty slot
    const [selectedUser, setSelectedUser] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [onlySelectedParent, setOnlySelectedParent] = useState(false);
    const [restrictOnTotalSeat, setRestrictOnTotalSeat] = useState(false);
    const [viewMode, setViewMode] = useState('editor'); // 'editor', 'html', or 'preview'
    const [restrictStartDateChange, setRestrictStartDateChange] = useState(false);
    const [forcefullBuyCourse, setForcefullBuyCourse] = useState(false);

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

    const [privateAccordion, setPrivateAccordion] = useState(false);
    const [descriptionAccordion, setDescriptionAccordion] = useState(false);
    const allClass = [
        { label: "Class 4", id: "4" },
         { label: "Class 5", id: "5" },
        ];
    const allCourseType = [
        { label: "Full Course", id: "fullCourse" },
         { label: "Crash Course", id: "crashCourse" },
        ];
    const allDuration = [
        { label: "Less than 1 Month", id: "lessThan1Month" },
        { label: "1-3 Months", id: "1to3Months" },
        { label: "3-6 Months", id: "3to6Months" },
        { label: "6+ Months", id: "moreThan6Months" },
    ];
    
    const [loadingDoc, setLoadingDoc] = useState(false);
    function convertToSlug(text) {
        return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      }
    const onTitleChange = (e) => {
        setCourseTitle(e)
        let link = convertToSlug(e)
        setCourseLink(link)
    }
  
    useEffect(() => {
        async function getOneData() {
            try {
                let res = await myCourseService.getOne(props.id);
                if (res.variant === "success") {
                    const { _id, isPublished, allBatch, startTime,
                        endTime, courseTitle, courseLink, shortDescription, oneClassPrice, discountOnFullClass,
                        courseClass, courseType, duration, imageUrls, fullDescription, totalSeat, filledSeat, showRemaining,
                        onlySelectedParent: selectedParent, selectedUsers, restrictOnTotalSeat: restrictSeat, restrictStartDateChange, forcefullBuyCourse } = res.data;
                    props.setId(_id);
                    setIsPublished(isPublished);
                    setAllBatch(allBatch || [{
                        oneBatch: [''],
                        hide: false,
                        bookingFull: false
                    }]);               
                    setStartTime(startTime);               
                    setEndTime(endTime);   
                    setCourseTitle(courseTitle);
                    setCourseLink(courseLink);
                    setShortDescription(shortDescription);
                    setOneClassPrice(oneClassPrice);
                    setDiscountOnFullClass(discountOnFullClass);
                    setCourseClass(courseClass);
                    setCourseType(courseType);
                    setDuration(duration);
                    setImageUrls(imageUrls?.length ? imageUrls : [""]);
                    setFullDescription(fullDescription);
                    setTotalSeat(totalSeat);
                    setFilledSeats(filledSeat);
                    setShowRemaining(showRemaining);
                    setPrivateAccordion(true);
                    setOnlySelectedParent(selectedParent || false);
                    setSelectedUser(selectedUsers || []);
                    setRestrictOnTotalSeat(restrictSeat || false);
                    setRestrictStartDateChange(restrictStartDateChange || false);
                    setForcefullBuyCourse(forcefullBuyCourse || false);
                    setPrivateAccordion(true);
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
        if (props.id || courseTitle || shortDescription || imageUrls.some(url => url !== "")) {
            let yes = window.confirm("Are you sure you want to clear all fields? This will reset the form.");
            if (!yes) return;
        }
        props.setId("");
        setIsPublished(false);
        setAllBatch([{
            oneBatch: [''],
            hide: false,
            bookingFull: false
        }]);
        setStartTime("");
        setEndTime("");
        setCourseTitle("");
        setCourseLink("");
        setShortDescription("");
        setOneClassPrice("");
        setDiscountOnFullClass("0");
        setCourseClass(null);
        setCourseType(null);
        setDuration(null);
        setFullDescription("");
        setTotalSeat("");
        setFilledSeats("");
        setShowRemaining(false);
        setImageUrls([""]);
        setPrivateAccordion(true);
        setSelectedUser([]);
        setOnlySelectedParent(false);
        setRestrictOnTotalSeat(false);
        setRestrictStartDateChange(false);
        setForcefullBuyCourse(false);
    };
    

    useImperativeHandle(ref, () => ({
        handleSubmit: async () => {
            try {
                let myCourseData = {
                    _id: props.id,
                    allBatch,
                    startTime,
                    endTime,
                    courseTitle,
                    courseLink,
                    shortDescription,
                    oneClassPrice,
                    discountOnFullClass,
                    courseClass,
                    courseType,
                    duration,
                    fullDescription,
                    totalSeat,
                    restrictOnTotalSeat,
                    filledSeat,
                    showRemaining,
                    imageUrls,
                    isPublished,
                    onlySelectedParent,
                    selectedUsers: selectedUser, // Add selected users to the submission
                    restrictStartDateChange,
                    forcefullBuyCourse,
                };
                let response = await myCourseService.add(props.id, myCourseData);
                              
                if (response.variant === "success") {
                    snackRef.current.handleSnack(response);
                    handleClear();
                    // Call the onSaveSuccess callback after successful save
                    if (props.onSaveSuccess) {
                        props.onSaveSuccess();
                    }
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


    const handleDelete = async () => {
        try {
            let courseDisplayName = courseTitle || 'this course'; // Fallback if title is empty
            let yes = window.confirm(`Are you sure you want to permanently delete "${courseDisplayName}"?\n\nThis action cannot be undone.`);
            if (yes) {
                let response = await myCourseService.deleteClass(`api/v1/publicMaster/course/myCourse/deleteOne/${props.id}`);
                if (response.variant === "success") {
                    snackRef.current.handleSnack(response);
                    handleClear();
                    // Call the onSaveSuccess callback after successful deletion
                    if (props.onSaveSuccess) {
                        props.onSaveSuccess();
                    }
                } else {
                    snackRef.current.handleSnack(response?.response?.data);
                }
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            snackRef.current.handleSnack({ fullDescription: "Failed to delete data.", variant: "error" });
        }
    };



    // Replace the findUserDetails function
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

    // Replace the renderUserSelect function
    const renderUserSelect = () => {
        if (!onlySelectedParent) return null;

        // Sort users by firstName
        const sortedUsers = [...allUsers].sort((a, b) => {
            const nameA = (a.firstName || '').toLowerCase();
            const nameB = (b.firstName || '').toLowerCase();
            return nameA.localeCompare(nameB);
        });

        return (
            <Grid item xs={12} md={8}>
                <Autocomplete
                    multiple
                    id="user-select"
                    options={sortedUsers}
                    value={selectedUser.map(userId => findUserDetails(userId))
                        .sort((a, b) => (a.firstName || '').localeCompare(b.firstName || ''))}
                    onChange={(event, newValue) => {
                        setSelectedUser(newValue.map(user => user._id));
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
                        const isSelected = selectedUser.includes(option._id);
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
            </Grid>
        );
    };

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'color', 'background',
        'align',
        'link', 'image'
    ];

    const handleCopy = () => {
        // Prepend "Copy of " to the course title
        setCourseTitle(`Copy of ${courseTitle}`);
        // Update the course link based on new title
        setCourseLink(convertToSlug(`Copy of ${courseTitle}`));
        // Remove the _id by setting it to empty
        props.setId("");
        // Show success message
        snackRef.current.handleSnack({
            message: "Course copied! You can now save this as a new course.",
            variant: "success"
        });
    };

    return (
        <main style={{ background: "#fff", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius: "10px", padding: 20 }}>
            <Grid sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between" }}>
                <Typography color="secondary" style={{ fontFamily: 'Courgette' }} align='center' variant='h6'>Create Course</Typography>
                <ButtonGroup variant="text" aria-label="text button group">
                    <Button startIcon={isPublished ? <FcOk /> : <FcNoIdea />} onClick={() => setIsPublished(!isPublished)}>{isPublished ? "Published" : "Un-Publish"}</Button>
                    {props.id && (
                        <>
                            <Button 
                                startIcon={<FiCopy />} 
                                onClick={handleCopy} 
                                color="primary"
                            >
                                Copy Course
                            </Button>
                            <Button 
                                endIcon={<MdDeleteForever />} 
                                onClick={handleDelete} 
                                color="error"
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </ButtonGroup>
            </Grid>
            <Grid container spacing={2} style={{marginBottom:"20px"}}>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Course Title" value={courseTitle} onChange={(e) => onTitleChange(e.target.value)} inputProps={{ minLength: "2", maxLength: "50" }} placeholder='Course Title' variant="standard" />
                    <Typography variant="subtitle2" gutterBottom>
                    Link- {courseLink}
      </Typography>                    
                </Grid>
      
                <Grid item xs={12} md={12}>
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
        <Grid item xs={12} md={2}>
                    <TextField focused type='time' value={startTime} onChange={(e) => setStartTime(e.target.value)} fullWidth label="Start Time :" variant="standard" />
                </Grid>
                <Grid item xs={12} md={2}>
                    <TextField focused type='time' value={endTime} onChange={(e) => setEndTime(e.target.value)} fullWidth label="End Time :" variant="standard" />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Short Description" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} inputProps={{ minLength: "2", maxLength: "100" }} placeholder='Short Description' variant="standard" />
                </Grid>
                <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">One Class Price</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">£</InputAdornment>}
            label="oneClassPrice"
            type='number'
            value={oneClassPrice} 
                    onChange={(e) => setOneClassPrice(e.target.value)} 
                    inputProps={{ minLength: "1", maxLength: "5" }} 
                    placeholder='Enter one class price' 
          />
        </FormControl>
            
                </Grid>
                {/* <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ m: 1 }} variant="filled">
          <InputLabel htmlFor="filled-adornment-amount">Discount On Full Course</InputLabel>
          <FilledInput
            id="filled-adornment-amount"
            startAdornment={<InputAdornment position="start">£</InputAdornment>}
            type='number'
            value={discountOnFullClass} 
                    onChange={(e) => setDiscountOnFullClass(e.target.value)} 
                    inputProps={{ minLength: "1", maxLength: "5" }} 
                    placeholder='Enter Discount Price' 
          />
        </FormControl>
                </Grid> */}
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={allClass}
                        value={courseClass}
                        onChange={(e, v) => {
                            setCourseClass(v);
                        }}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.id}>
                                    {option.label}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params} label="Course" variant="standard" />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={allCourseType}
                        value={courseType}
                        onChange={(e, v) => {
                            setCourseType(v);
                        }}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.id}>
                                    {option.label}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params} label="Course Type" variant="standard" />}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        isOptionEqualToValue={(option, value) => option?.id === value?.id}
                        options={allDuration}
                        value={duration}
                        onChange={(e, v) => {
                            setDuration(v);
                        }}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.id}>
                                    {option.label}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params} label="Duration" variant="standard" />}
                    />
                </Grid>
                
                <br/>
                
         
            </Grid>
            <Accordion expanded={privateAccordion} style={{marginBottom:"30px"}}>
                <AccordionSummary
                    expandIcon={<IconButton > <FcExpand /> </IconButton>}
                    aria-controls="PrivateInformation"
                    id="PrivateInformation"
                    onClick={() => setPrivateAccordion(!privateAccordion)}
                >
                    <Typography>Make it Private or Public</Typography>
                </AccordionSummary>
                <AccordionDetails>
         <Grid container spacing={2}>
        
                <Grid item xs={12} md={3}>
                     <FormControlLabel control={
                           <Checkbox
                           checked={restrictStartDateChange}
                           onChange={() => setRestrictStartDateChange(!restrictStartDateChange)}
                           inputProps={{ 'aria-label': 'controlled' }}
                         />               
                     } label={`Restrict Start Date Change`} />
                  
                </Grid>
                <Grid item xs={12} md={3}>
                     <FormControlLabel control={
                           <Checkbox
                           checked={forcefullBuyCourse}
                           onChange={() => setForcefullBuyCourse(!forcefullBuyCourse)}
                           inputProps={{ 'aria-label': 'controlled' }}
                         />               
                     } label={`Force Full Buy Course`} />
                  
                </Grid>
                <Grid item xs={0} md={6}></Grid>
{/* make a line here */}
    {/* <div style={{borderBottom: '1px solid #000', width: '100%'}}></div> */}
                <Grid item xs={12} md={4}>
                     <FormControlLabel control={
                           <Checkbox
                           checked={restrictOnTotalSeat}
                           onChange={() => setRestrictOnTotalSeat(!restrictOnTotalSeat)}
                           inputProps={{ 'aria-label': 'controlled' }}
                         />               
                     } label={`Restrict On Total-Seat`} />
                  
                </Grid>
                <Grid item xs={12} md={8}>
                    <TextField 
                    fullWidth
                     label="Total Seat" 
                     value={totalSeat} 
                     onChange={(e) => setTotalSeat(e.target.value)} 
                     inputProps={{ minLength: "1", maxLength: "5" }} 
                     placeholder='Total Seat' variant="outlined" 
                     />
                </Grid>                     
                <Grid item xs={12} md={4}>
                     <FormControlLabel control={
                           <Checkbox
                           checked={onlySelectedParent}
                           onChange={() => setOnlySelectedParent(!onlySelectedParent)}
                           inputProps={{ 'aria-label': 'controlled' }}
                         />               
                     } label={`Only Selected Parent`} />
                  
                </Grid>
                <Grid item xs={12} md={8}>
                {renderUserSelect()}
                </Grid>                     
         </Grid>
       
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={descriptionAccordion} style={{marginBottom:"30px"}}>
                <AccordionSummary
                    expandIcon={<IconButton > <FcExpand /> </IconButton>}
                    aria-controls="DescriptionInformation"
                    id="DescriptionInformation"
                    onClick={() => setDescriptionAccordion(!descriptionAccordion)}
                >
                    <Typography>Long Rich Text Description</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    row
                                    value={viewMode}
                                    onChange={(e) => setViewMode(e.target.value)}
                                >
                                    <FormControlLabel 
                                        value="editor" 
                                        control={<Radio />} 
                                        label="Editor" 
                                    />
                                    <FormControlLabel 
                                        value="html" 
                                        control={<Radio />} 
                                        label="HTML" 
                                    />
                                    <FormControlLabel 
                                        value="preview" 
                                        control={<Radio />} 
                                        label="Preview" 
                                    />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {viewMode === 'editor' && (
                                <div style={{ backgroundColor: '#f8f9fa' }}>
                                    <ReactQuill
                                        theme="snow"
                                        value={fullDescription}
                                        onChange={setFullDescription}
                                        modules={modules}
                                        formats={formats}
                                        style={{ 
                                            height: '300px', 
                                            marginBottom: '50px',
                                            backgroundColor: '#fff'
                                        }}
                                        placeholder="Write the Long Description about the courses..."
                                    />
                                </div>
                            )}
                            {viewMode === 'html' && (
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={12}
                                    value={fullDescription}
                                    onChange={(e) => setFullDescription(e.target.value)}
                                    variant="outlined"
                                    InputProps={{
                                        style: { 
                                            fontFamily: 'monospace',
                                            backgroundColor: '#282c34',
                                            color: '#abb2bf',
                                        }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#3e4451',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#528bff',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: '#528bff',
                                            },
                                        },
                                    }}
                                />
                            )}
                            {viewMode === 'preview' && (
                                <div 
                                    style={{ 
                                        border: '1px solid #ddd', 
                                        borderRadius: '4px', 
                                        padding: '16px',
                                        minHeight: '300px',
                                        backgroundColor: '#fff'
                                    }}
                                    dangerouslySetInnerHTML={{ __html: fullDescription }}
                                />
                            )}
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <DateSelector allBatch={allBatch} setAllBatch={setAllBatch} />
            <br/> <br/>
         
            <MySnackbar ref={snackRef} />
        </main>
    );
});

export default EntryArea;
