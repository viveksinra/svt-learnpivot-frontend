import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { TextField, Grid, ButtonGroup, Button, Typography, Accordion, AccordionSummary, AccordionDetails, IconButton, InputAdornment, CircularProgress, Stack, Checkbox, FormControlLabel, FormControl, InputLabel, OutlinedInput, FilledInput } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { FcNoIdea, FcOk, FcExpand } from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import MySnackbar from "../../Components/MySnackbar/MySnackbar";
import { dashboardService, myCourseService } from "../../services";
import { useImgUpload } from "@/app/hooks/auth/useImgUpload";
import DateSelector from './dateSelector';
import MultiImageUpload from '@/app/Components/Common/MultiImageUpload';

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

    const [PAccordion, setPAccordion] = useState(false);
    const allClass = [
        { label: "Class 4", id: "4" },
         { label: "Class 5", id: "5" },
        ];
    const allCourseType = [
        { label: "Full Course", id: "fullCourse" },
         { label: "Crash Course", id: "crashCourse" },
        ];
    const allDuration = [
        { label: "3 Months", id: "3months" },
         { label: "6 Months", id: "6months" },
         { label: "1 Years", id: "1years" },
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
                        onlySelectedParent: selectedParent, selectedUsers } = res.data;
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
                    setPAccordion(true);
                    setOnlySelectedParent(selectedParent || false);
                    setSelectedUser(selectedUsers || []);
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
        setPAccordion(true);
        setSelectedUser([]);
        setOnlySelectedParent(false);
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
                    filledSeat,
                    showRemaining,
                    imageUrls,
                    isPublished,
                    onlySelectedParent,
                    selectedUsers: selectedUser // Add selected users to the submission
                };
                let response = await myCourseService.add(props.id, myCourseData);
                              
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
    const imgUpload  = async (e) => {
        setLoadingDoc(true);
        let url = await useImgUpload(e);
        if (url) {
          setImageUrls(url);
          setLoadingDoc(false);
        } else {
          snackRef.current.handleSnack({
            message: "Image Not Selected",
            info: "warning",
          });
          setLoadingDoc(false);
        }
      };


    const handleDelete = async () => {
        try {
            let courseDisplayName = courseTitle || 'this course'; // Fallback if title is empty
            let yes = window.confirm(`Are you sure you want to permanently delete "${courseDisplayName}"?\n\nThis action cannot be undone.`);
            if (yes) {
                let response = await myCourseService.deleteCourse(`api/v1/publicMaster/myCourse/addMyCourse/deleteOne/${props.id}`);
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

    const deleteImage = () => {
        // Your delete image logic here
        setImageUrls([""]); // Clear the URL to remove the image from display
    };

    const showImage = () => {
        if (imageUrls) {
            window.open(imageUrls, '_blank'); // Open the image URL in a new tab
        }
    };

    // Replace the findUserDetails function
    const findUserDetails = (userId) => {
        const user = allUsers.find(user => user._id === userId);
        return user || { 
            name: 'User not found', 
            email: 'No email', 
            mobile: 'No mobile',
            _id: userId 
        };
    };

    // Replace the renderUserSelect function
    const renderUserSelect = () => {
        if (!onlySelectedParent) return null;

        return (
            <Grid item xs={12} md={8}>
                <Autocomplete
                    multiple
                    id="user-select"
                    options={allUsers}
                    value={selectedUser.map(userId => findUserDetails(userId))}
                    onChange={(event, newValue) => {
                        setSelectedUser(newValue.map(user => user._id));
                    }}
                    getOptionLabel={(option) => 
                        `${option.name || ''} (${option.email || ''}) (${option.mobile || ''})`
                    }
                    filterOptions={(options, { inputValue }) => {
                        const searchTerms = inputValue.toLowerCase().split(' ');
                        return options.filter(option => 
                            searchTerms.every(term =>
                                option.name?.toLowerCase().includes(term) ||
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
                    renderOption={(props, option) => (
                        <li {...props} key={option._id}>
                            {option.name} ({option.mobile}) ({option.email})
                        </li>
                    )}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                />
            </Grid>
        );
    };

    return (
        <main style={{ background: "#fff", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius: "10px", padding: 20 }}>
            <Grid sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between" }}>
                <Typography color="secondary" style={{ fontFamily: 'Courgette' }} align='center' variant='h6'>Create Course</Typography>
                <ButtonGroup variant="text" aria-label="text button group">
                    <Button startIcon={isPublished ? <FcOk /> : <FcNoIdea />} onClick={() => setIsPublished(!isPublished)}>{isPublished ? "Published" : "Un-Publish"}</Button>
                    <Button endIcon={<MdDeleteForever />} onClick={handleDelete} disabled={!props.id} color="error">Delete</Button>
                </ButtonGroup>
            </Grid>
            <Grid container spacing={2} style={{marginBottom:"20px"}}>
                <Grid item xs={12} md={4}>
                    <TextField fullWidth label="Course Title" value={courseTitle} onChange={(e) => onTitleChange(e.target.value)} inputProps={{ minLength: "2", maxLength: "30" }} placeholder='Course Title' variant="standard" />
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
                <Grid item xs={12} md={3}>
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
                </Grid>
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
            <Accordion expanded={PAccordion} style={{marginBottom:"30px"}}>
                <AccordionSummary
                    expandIcon={<IconButton > <FcExpand /> </IconButton>}
                    aria-controls="ProspectInformation"
                    id="ProspectInformation"
                    onClick={() => setPAccordion(!PAccordion)}
                >
                    <Typography>Additional Optional Information</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Grid container spacing={2}>
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
                  {"ab"==="bb" &&  <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="Full Description" value={fullDescription} inputProps={{ maxLength: "4000" }} onChange={(e) => setFullDescription(e.target.value)} placeholder="Write the Long Description about the coursees" fullWidth multiline rows={4} variant="outlined" />
                        </Grid>
                     <Grid item xs={12} md={4}>
                    <TextField 
                    label="Total Seat" variant="filled"
                     color="success" focused 
                     type="Number"
                     value={totalSeat}
                     onChange={(e) => setTotalSeat(e.target.value)}
                     />                   
                </Grid>
                     <Grid item xs={12} md={4}>
                    <TextField 
                    label="Filled Seats" variant="filled"
                     color="success" focused 
                     type="Number"
                     value={filledSeat}
                     onChange={(e) => setFilledSeats(e.target.value)}
                     />                   
                </Grid>
                     <Grid item xs={12} md={4}>
                     <FormControlLabel control={
                           <Checkbox
                           checked={showRemaining}
                           onChange={() => setShowRemaining(!showRemaining)}
                           inputProps={{ 'aria-label': 'controlled' }}
                         />               
                     } label={`Show Remaining:  ${totalSeat-filledSeat}   Seats`} />
                  
                </Grid>
                    </Grid>}
                </AccordionDetails>
            </Accordion>
            <DateSelector allBatch={allBatch} setAllBatch={setAllBatch} />
            <br/> <br/>
         
            <MySnackbar ref={snackRef} />
        </main>
    );
});

export default EntryArea;
