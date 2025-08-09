'use client';
import "./drawerStyle.css";
import {Typography,Avatar,List,ListSubheader,ListItemButton,ListItemIcon,ListItemText, Divider  } from '@mui/material/';
import { useState } from "react";
import Link from 'next/link';
import { FcPicture,FcHome, FcKindle,FcStackOfPhotos,FcCurrencyExchange,FcInvite} from "react-icons/fc";
import { authService } from "../../services";

const MyDrawer = ({handleDrawer}) => {

const list1 = [
  {title:"Homes",icon:<FcHome/>, link:"/"},
  {title:"About Us",icon:<FcKindle/>, link:"/about"},
  {title:"Course",icon:<FcStackOfPhotos/>, link:"/course"},
  {title:"Mock Test",icon:<FcPicture/>, link:"/mockTest"},
  {title:"Papers",icon:<FcCurrencyExchange/>, link:"/paper"},
  {title:"Contact",icon:<FcInvite/>, link:"/contact"}]
  return (
    <div>
      <div id="topDrawer" style={{width:260}}>
       <span className="center"><Typography variant="caption" style={{paddingTop:10}} color="primary">   Welcome {authService.getLoggedInUser()?.firstName ?? "User"} !</Typography></span>
       <div id="DrawerAvatar">
       <Avatar alt="Travis Howard" sx={{ width: 60, height: 60,border:"3px solid #fff" }} style={{marginLeft:"auto",marginRight:"auto"}} src={authService.getLoggedInUser()?.userImage ?? "https://res.cloudinary.com/oasismanors/image/upload/v1687519053/user_myqgmv.png"} />
       </div>
      </div>
      <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      dense
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Navigate to :- 
        </ListSubheader>
      }
    >
      {list1.map(l=> <Link href={l.link} key={l.title} onClick={()=>handleDrawer()}>
        <ListItemButton>
        <ListItemIcon style={{fontSize:24}}>
          {l.icon}
        </ListItemIcon>
        <ListItemText primary={l.title} />
      </ListItemButton>
      </Link> )}
      <br/>
      <Divider/>
      <br/>

    </List>
     
<br/>
<center><button onClick={()=>handleDrawer()}>Go Back</button></center>
   </div>
  )
}

export default MyDrawer