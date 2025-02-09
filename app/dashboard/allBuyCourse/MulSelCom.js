// MulSelCom Component
import React, { useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { myCourseService } from '@/app/services';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MulSelCom({ selectedCourses, setSelectedCourses, selectedBatches, setSelectedBatches, successOnly, setSuccessOnly }) {
  const [sortBy, setSort] = useState("newToOld");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1000);
  const [searchText, setSearchText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      let response = await myCourseService.publicGetAll({ sortBy, page, rowsPerPage, searchText, totalCount });
      console.log(response);
      if (response.variant === "success") {
        setLoading(false);
        setCourses(response.data);
      } else {
        console.log(response);
        setLoading(false);
      }
    }
    fetchAllData();
  }, [rowsPerPage, page, searchText, sortBy]);

  const handleCourseChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedCourses = typeof value === 'string' ? value.split(',') : value;
    const selectedCourseObjects = selectedCourses.map(title => {
      const course = courses.find(mt => mt.courseTitle === title);
      return { title, id: course._id };
    });
    setSelectedCourses(selectedCourseObjects);
    setSelectedBatches([]); // Clear the second dropdown selection
  };

  const handleBatchChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedBatchLabels = typeof value === 'string' ? value.split(',') : value;
    const selectedBatchObjects = selectedBatchLabels.map(label => {
      const [date, time] = label.split(' ');
      const [startTime, endTime] = time.split('-');
      let batchId = '';
      selectedCourses.forEach(course => {
        const courseObj = courses.find(mt => mt.courseTitle === course.title);
        const batch = courseObj.batch.find(b => b.date === date && b.startTime === startTime && b.endTime === endTime);
        if (batch) batchId = batch._id;
      });
      return { label, id: batchId };
    });
    setSelectedBatches(selectedBatchObjects);
  };

  const getBatchesForSelectedCourses = () => {
    const batches = [];
    selectedCourses.forEach(course => {
      const courseObj = courses.find(mt => mt.courseTitle === course.title);
      if (courseObj && courseObj.batch) {
        courseObj.batch.forEach(batch => {
          batches.push({
            label: `${batch.date} ${batch.startTime}-${batch.endTime}`,
            id: batch._id,
          });
        });
      }
    });
    return batches;
  };

  const batches = getBatchesForSelectedCourses();

  const filteredCourses =  courses;

  const handleSwitchChange = (event) => {
    setSuccessOnly(event.target.checked);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="mocktest-multiple-checkbox-label">Courses</InputLabel>
        <Select
          labelId="mocktest-multiple-checkbox-label"
          id="mocktest-multiple-checkbox"
          multiple
          value={selectedCourses.map(course => course.title)}
          onChange={handleCourseChange}
          input={<OutlinedInput label="Mock Tests" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {filteredCourses.map((course) => (
            <MenuItem key={course._id} value={course.courseTitle}>
              <Checkbox checked={selectedCourses.some(mt => mt.title === course.courseTitle)} />
              <ListItemText primary={course.courseTitle} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 300 }} disabled={selectedCourses.length === 0}>
        <InputLabel id="batch-multiple-checkbox-label">Batches</InputLabel>
        <Select
          labelId="batch-multiple-checkbox-label"
          id="batch-multiple-checkbox"
          multiple
          value={selectedBatches.map(batch => batch.label)}
          onChange={handleBatchChange}
          input={<OutlinedInput label="Batches" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {batches.map((batch) => (
            <MenuItem key={batch.id} value={batch.label}>
              <Checkbox checked={selectedBatches.some(b => b.label === batch.label)} />
              <ListItemText primary={batch.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 300 }}>
        <FormControlLabel
          control={<Switch checked={successOnly} onChange={handleSwitchChange} />}
          label="Success Only"
        />
      </FormControl>
    </div>
  );
}
