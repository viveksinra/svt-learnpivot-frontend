import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { useState } from 'react';

const FilterComponent = ({ filterData, selectedFilter, setSelectedFilter }) => {

  const handleCheckboxChange = (link, id) => {
    setSelectedFilter(prevState => {
      return prevState.map(filter => {
        if (filter.link === link) {
          const isChecked = filter.ids.includes(id);
          return {
            ...filter,
            ids: isChecked 
              ? filter.ids.filter(item => item !== id) 
              : [...filter.ids, id]
          };
        }
        return filter;
      });
    });
  };

  const isChecked = (link, id) => {
    const filter = selectedFilter.find(filter => filter.link === link);
    return filter ? filter.ids.includes(id) : false;
  };

  return (
    <>
      {filterData && filterData.map((e, j) => (
        <div key={j}>
          <h4 style={{ color: "#082952", fontFamily: "Adequate, Helvetica Neue, Helvetica, sans-serif" }}>
            <strong>{e.title}</strong>
          </h4>
          <FormGroup>
            {e?.tags?.map((i, k) => (
              <FormControlLabel
                key={k}
                control={
                  <Checkbox
                    name={i.id}
                    checked={isChecked(e.link, i.id)}
                    onChange={() => handleCheckboxChange(e.link, i.id)}
                    style={{ color: '#333' }}
                  />
                }
                label={<span style={{ color: "#082952", margin: "0 5px" }}>{i.label}</span>} // Reduced space between labels
              />
            ))}
          </FormGroup>
        </div>
      ))}
    </>
  );
};

export default FilterComponent;
