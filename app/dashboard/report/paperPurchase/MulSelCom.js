// MulSelCom Component for Paper Sets
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
import { paperService } from '@/app/services';

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
  const [sortBy, setSort] = useState('newToOld');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1000);
  const [searchText, setSearchText] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sets, setSets] = useState([]);

  useEffect(() => {
    async function fetchAllData() {
      setLoading(true);
      try {
        const resp = await paperService.publicGetAll({ sortBy, page, rowsPerPage, searchText, totalCount });
        if (resp.variant === 'success') {
          setSets(resp.data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAllData();
  }, [rowsPerPage, page, searchText, sortBy]);

  const handleSetChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedTitles = typeof value === 'string' ? value.split(',') : value;
    const selectedObjects = selectedTitles.map((title) => {
      const found = sets.find((s) => s.setTitle === title);
      return { title, id: found?._id };
    });
    setSelectedCourses(selectedObjects);
  };

  const handleSwitchChange = (event) => {
    setSuccessOnly(event.target.checked);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="paper-set-multiple-checkbox-label">Paper Sets</InputLabel>
        <Select
          labelId="paper-set-multiple-checkbox-label"
          id="paper-set-multiple-checkbox"
          multiple
          value={(selectedCourses || []).map((s) => s.title)}
          onChange={handleSetChange}
          input={<OutlinedInput label="Paper Sets" />}
          renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
          {sets.map((s) => (
            <MenuItem key={s._id} value={s.setTitle}>
              <Checkbox checked={(selectedCourses || []).some((it) => it.title === s.setTitle)} />
              <ListItemText primary={s.setTitle} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, width: 200 }}>
        <FormControlLabel control={<Switch checked={successOnly} onChange={handleSwitchChange} />} label="Success Only" />
      </FormControl>
    </div>
  );
}


