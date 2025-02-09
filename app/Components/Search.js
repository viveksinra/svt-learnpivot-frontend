'use client';
import React from 'react'
import { styled } from '@mui/material/styles';
import {InputBase} from '@mui/material';
import { FcSearch } from "react-icons/fc";


const SearchDiv = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor:"whitesmoke",
  '&:hover': {
    backgroundColor:"aliceblue",
  },
  marginLeft: 0,
  width: '100%',
 
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export default function Search(props) {
  return (
    <SearchDiv>
    <SearchIconWrapper>
        <FcSearch />
    </SearchIconWrapper>
    <StyledInputBase {...props}  placeholder="Search..." inputProps={{ 'aria-label': 'search' }}
    />
    </SearchDiv>
  );
}