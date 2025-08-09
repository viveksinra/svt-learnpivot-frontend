import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { TextField, Grid, ButtonGroup, Button, Typography, Accordion, AccordionSummary, AccordionDetails, IconButton, InputAdornment, CircularProgress, Stack, Checkbox, FormControlLabel, FormControl, InputLabel, OutlinedInput, Switch, Box } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { FcNoIdea, FcOk, FcExpand } from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import MySnackbar from "../../Components/MySnackbar/MySnackbar";
import { paperService } from "../../services";
import { useImgUpload } from "@/app/hooks/auth/useImgUpload";
import MultiImageUpload from '@/app/Components/Common/MultiImageUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import frontKey from "@/app/utils/frontKey";

const stripeKeys = frontKey.stripeKeys || (frontKey.default ? frontKey.default.stripeKeys : []);

const EntryArea = forwardRef((props, ref) => {
  const snackRef = useRef();

  // Core fields
  const [isPublished, setIsPublished] = useState(false);
  const [setTitle, setSetTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [onePaperPrice, setOnePaperPrice] = useState("");
  const [discountOnFullSet, setDiscountOnFullSet] = useState("0");
  const [imageUrls, setImageUrls] = useState([""]);
  const [fullDescription, setFullDescription] = useState("");
  const [sortDate, setSortDate] = useState("");

  // Meta fields
  const [subject, setSubject] = useState(null);
  const [classLevel, setClassLevel] = useState(null);
  const [stripeAccount, setStripeAccount] = useState(null);

  // Papers array
  const [papers, setPapers] = useState([{ title: "", code: "", description: "", previewUrl: "", allowCheckingService: false, checkingServicePrice: 0, allowOneOnOneService: false, oneOnOnePrice: 0, priceOverride: "" }]);

  const subjects = [
    { label: "Maths", id: "maths" },
    { label: "English", id: "english" },
    { label: "VR", id: "vr" },
    { label: "NVR", id: "nvr" },
    { label: "Other", id: "other" },
  ];
  const classLevels = [
    { label: "Year 4", id: "4" },
    { label: "Year 5", id: "5" },
    { label: "Year 6", id: "6" },
  ];

  // Load one if id present
  useEffect(() => {
    async function getOne() {
      try {
        const res = await paperService.getOne(props.id);
        if (res?.variant === 'success') {
          const d = res.data || {};
          props.setId(d._id);
          setIsPublished(!!d.isPublished);
          setSetTitle(d.setTitle || "");
          setShortDescription(d.shortDescription || "");
          setOnePaperPrice(d.onePaperPrice || "");
          setDiscountOnFullSet(d.discountOnFullSet || "0");
          setImageUrls(d.imageUrls?.length ? d.imageUrls : [""]);
          setFullDescription(d.fullDescription || "");
          setSubject(d.subject || null);
          setClassLevel(d.classLevel || null);
          setStripeAccount(d.stripeAccount || null);
          setPapers((d.papers && d.papers.length ? d.papers : [{ title: "" }]).map(p => ({
            title: p.title || "",
            code: p.code || "",
            description: p.description || "",
            previewUrl: p.previewUrl || "",
            allowCheckingService: !!p.allowCheckingService,
            checkingServicePrice: p.checkingServicePrice || 0,
            allowOneOnOneService: !!p.allowOneOnOneService,
            oneOnOnePrice: p.oneOnOnePrice || 0,
            priceOverride: p.priceOverride ?? ""
          })));
          setSortDate(d.sortDate || "");
          snackRef.current?.handleSnack(res);
        } else if (res) {
          snackRef.current?.handleSnack(res);
        }
      } catch (e) {
        console.error(e);
        snackRef.current?.handleSnack({ message: 'Failed to load paper set', variant: 'error' });
      }
    }
    if (props.id) getOne();
  }, [props.id]);

  const handleClear = () => {
    if (props.id || setTitle || shortDescription || imageUrls.some(Boolean)) {
      const yes = window.confirm('Clear all fields?');
      if (!yes) return;
    }
    props.setId("");
    setIsPublished(false);
    setSetTitle("");
    setShortDescription("");
    setOnePaperPrice("");
    setDiscountOnFullSet("0");
    setImageUrls([""]);
    setFullDescription("");
    setSubject(null);
    setClassLevel(null);
    setStripeAccount(null);
    setPapers([{ title: "", code: "", description: "", previewUrl: "", allowCheckingService: false, checkingServicePrice: 0, allowOneOnOneService: false, oneOnOnePrice: 0, priceOverride: "" }]);
    setSortDate("");
  };

  useImperativeHandle(ref, () => ({
    handleSubmit: async () => {
      try {
        const payload = {
          _id: props.id,
          isPublished,
          setTitle,
          shortDescription,
          onePaperPrice,
          discountOnFullSet,
          imageUrls: (imageUrls || []).filter(Boolean),
          fullDescription,
          subject,
          classLevel,
          stripeAccount,
          papers,
          sortDate,
        };
        const res = await paperService.add(props.id, payload);
        snackRef.current?.handleSnack(res);
        if (res?.variant === 'success') {
          handleClear();
          props.onSaveSuccess && props.onSaveSuccess();
        }
      } catch (e) {
        console.error(e);
        snackRef.current?.handleSnack({ message: 'Failed to submit', variant: 'error' });
      }
    },
    handleClear: () => handleClear()
  }));

  const addPaperRow = () => setPapers([...papers, { title: "", code: "", description: "", previewUrl: "", allowCheckingService: false, checkingServicePrice: 0, allowOneOnOneService: false, oneOnOnePrice: 0, priceOverride: "" }]);
  const updatePaper = (idx, key, value) => setPapers(papers.map((p, i) => i === idx ? { ...p, [key]: value } : p));
  const removePaper = (idx) => setPapers(papers.filter((_, i) => i !== idx));

  const handleDelete = async () => {
    try {
      const title = setTitle || 'this paper set';
      const yes = window.confirm(`Delete "${title}" permanently?`);
      if (!yes) return;
      const res = await paperService.delete(`api/v1/publicMaster/paper/addPaper/deleteOne/${props.id}`);
      snackRef.current?.handleSnack(res);
      if (res?.variant === 'success') {
        handleClear();
        props.onSaveSuccess && props.onSaveSuccess();
      }
    } catch (e) {
      console.error(e);
      snackRef.current?.handleSnack({ message: 'Failed to delete', variant: 'error' });
    }
  };

  const renderStripeAccountSelect = () => (
    <Grid item xs={12} md={3}>
      <Autocomplete
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        options={stripeKeys}
        value={stripeAccount}
        onChange={(e, v) => setStripeAccount(v)}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>{option.label}</li>
        )}
        renderInput={(params) => <TextField {...params} label="Stripe Account" variant="standard" />}
      />
    </Grid>
  );

  return (
    <main style={{ background: "#fff", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", borderRadius: "10px", padding: 20 }}>
      <Grid sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between" }}>
        <Typography color="secondary" style={{ fontFamily: 'Courgette' }} align='center' variant='h6'>Create Paper Set</Typography>
        <ButtonGroup variant="text" aria-label="text button group">
          <Button startIcon={isPublished ? <FcOk /> : <FcNoIdea />} onClick={() => setIsPublished(!isPublished)}>{isPublished ? "Published" : "Un-Publish"}</Button>
          {props.id && (
            <Button endIcon={<MdDeleteForever />} onClick={handleDelete} color="error">Delete</Button>
          )}
        </ButtonGroup>
      </Grid>
      <Grid container spacing={2} style={{ marginBottom: "20px" }}>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Set Title" value={setTitle} onChange={(e) => setSetTitle(e.target.value)} inputProps={{ minLength: "2", maxLength: "60" }} placeholder='Paper set title' variant="standard" />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField fullWidth label="Sort Date" type="datetime-local" value={sortDate ? new Date(sortDate).toISOString().slice(0, 16) : ''} onChange={(e) => setSortDate(e.target.value ? new Date(e.target.value).toISOString() : '')} variant="standard" InputLabelProps={{ shrink: true }} />
        </Grid>
        {renderStripeAccountSelect()}
        <Grid item xs={12} md={12}>
          <MultiImageUpload images={imageUrls} onImagesChange={setImageUrls} uploadFunction={useImgUpload} maxImages={5} required={true} title="Thumbnail Images" helperText="Drag images to reorder. First image will be used as cover." />
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel htmlFor="one-paper-price">One Paper Price</InputLabel>
            <OutlinedInput id="one-paper-price" startAdornment={<InputAdornment position="start">£</InputAdornment>} label="One Paper Price" type='number' value={onePaperPrice} onChange={(e) => setOnePaperPrice(e.target.value)} placeholder='Enter price' />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel htmlFor="discount-full-set">Discount On Full Set</InputLabel>
            <OutlinedInput id="discount-full-set" startAdornment={<InputAdornment position="start">£</InputAdornment>} label="Discount On Full Set" type='number' value={discountOnFullSet} onChange={(e) => setDiscountOnFullSet(e.target.value)} placeholder='Discount if all papers selected' />
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete isOptionEqualToValue={(o, v) => o?.id === v?.id} options={classLevels} value={classLevel} onChange={(e, v) => setClassLevel(v)} renderOption={(props, option) => (<li {...props} key={option.id}>{option.label}</li>)} renderInput={(params) => <TextField {...params} label="Class Level" variant="standard" />} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Autocomplete isOptionEqualToValue={(o, v) => o?.id === v?.id} options={subjects} value={subject} onChange={(e, v) => setSubject(v)} renderOption={(props, option) => (<li {...props} key={option.id}>{option.label}</li>)} renderInput={(params) => <TextField {...params} label="Subject" variant="standard" />} />
        </Grid>

        <Grid item xs={12} md={12}>
          <TextField fullWidth label="Short Description" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} inputProps={{ minLength: "2", maxLength: "200" }} placeholder='Short Description' variant="standard" />
        </Grid>
      </Grid>

      <Accordion style={{ marginBottom: "30px" }}>
        <AccordionSummary expandIcon={<IconButton> <FcExpand /> </IconButton>}>
          <Typography>Long Rich Text Description</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ReactQuill theme="snow" value={fullDescription} onChange={setFullDescription} style={{ height: '300px', marginBottom: '50px', backgroundColor: '#fff' }} placeholder="Write the long description about the paper set..." />
        </AccordionDetails>
      </Accordion>

      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Papers</Typography>
      <Button variant="outlined" size="small" onClick={addPaperRow} sx={{ mb: 1 }}>Add Paper</Button>
      {papers.map((p, i) => (
        <div className="card p-3 mb-2" key={i} style={{ border: '1px solid #eee', borderRadius: 8, marginBottom: 12 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField fullWidth label="Title" value={p.title} onChange={(e) => updatePaper(i, 'title', e.target.value)} variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField fullWidth label="Code" value={p.code} onChange={(e) => updatePaper(i, 'code', e.target.value)} variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} md={5}>
              <MultiImageUpload
                images={[p.previewUrl || ""]}
                onImagesChange={(urls) => updatePaper(i, 'previewUrl', urls[0] || "")}
                uploadFunction={useImgUpload}
                maxImages={1}
                required={false}
                title="Paper Image"
                helperText="Upload a single image for this paper"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={2} label="Description" value={p.description} onChange={(e) => updatePaper(i, 'description', e.target.value)} variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel control={<Checkbox checked={!!p.allowCheckingService} onChange={(e) => updatePaper(i, 'allowCheckingService', e.target.checked)} />} label="Allow Checking Service" />
              {p.allowCheckingService && (
                <TextField type='number' fullWidth label="Checking Price" value={p.checkingServicePrice} onChange={(e) => updatePaper(i, 'checkingServicePrice', Number(e.target.value))} size="small" />
              )}
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControlLabel control={<Checkbox checked={!!p.allowOneOnOneService} onChange={(e) => updatePaper(i, 'allowOneOnOneService', e.target.checked)} />} label="Allow 1:1 Explanation" />
              {p.allowOneOnOneService && (
                <TextField type='number' fullWidth label="1:1 Price" value={p.oneOnOnePrice} onChange={(e) => updatePaper(i, 'oneOnOnePrice', Number(e.target.value))} size="small" />
              )}
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField type='number' fullWidth label="Price Override (optional)" value={p.priceOverride} onChange={(e) => updatePaper(i, 'priceOverride', e.target.value)} size="small" />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="outlined" color="error" onClick={() => removePaper(i)} startIcon={<MdDeleteForever />}>Remove</Button>
            </Grid>
          </Grid>
        </div>
      ))}

      <MySnackbar ref={snackRef} />
    </main>
  );
});

export default EntryArea;


