import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import {Link, useLocation} from 'react-router-dom';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import MenuIcon from '@mui/icons-material/Menu';
import { IconButton } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useState , useEffect } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddchartIcon from '@mui/icons-material/Addchart';
import axios from 'axios';

export default function Navbar(props) {
  const {drawerWidth, content} = props
  const location = useLocation()
  const path = location.pathname

  const [open, setOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
    }
  }, []);

  const [userRole, setUserRole] = useState(null);

  const getUserRole = async (userId) => {
    try {
      const studentResponse = await axios.get(`/users/${userId}/`);
      if (studentResponse.is_professor===false) {
        setUserRole('student');
        return;
      }
      else {
        setUserRole('professor');
        return;
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    }

  // Call getUserRole when the user logs in
  // Replace 'userId' with the actual user ID
  getUserRole(localStorage.getItem('userId'));



  const changeOpenStatus = () => {
    setOpen(!open)
  }

  const myDrawer = (
    <div>
         <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
        <List>
        
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/" selected={"/" === path}>
                <ListItemIcon>
                        <HomeIcon/>
                </ListItemIcon>
                <ListItemText primary={"Home"} />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton component={Link} to="/about" selected={"/about" === path}>
                <ListItemIcon>
                        <InfoIcon/>
                </ListItemIcon>
                <ListItemText primary={"About"} />
                </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
                <ListItemButton component={Link} to="/create" selected={"/create" === path}>
                <ListItemIcon>
                        <BorderColorIcon/>
                </ListItemIcon>
                <ListItemText primary={"Create"} />
                </ListItemButton>
            </ListItem>
            
            {!isLoggedIn && (
        <ListItem disablePadding>
            <ListItemButton component={Link} to="/login" selected={"/login" === path}>
                <ListItemIcon>
                    <LoginIcon/>
                </ListItemIcon>
                <ListItemText primary={"Login"} />
            </ListItemButton>
        </ListItem>
          )}

          {!isLoggedIn && (
              <ListItem disablePadding>
                  <ListItemButton component={Link} to="/register" selected={"/register" === path}>
                      <ListItemIcon>
                          <PersonAddAltIcon/>
                      </ListItemIcon>
                      <ListItemText primary={"Register"} />
                  </ListItemButton>
              </ListItem>
          )}

            {isLoggedIn && userRole === 'student' && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/matchstats" selected={"/matchstats" === path}>
                  <ListItemIcon>
                    <AddchartIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Match Stats"} />
                </ListItemButton>
              </ListItem>
            )}

            {isLoggedIn && userRole === 'student' && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/userstats" selected={"/userstats" === path}>
                  <ListItemIcon>
                    <TimelineIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"User Stats"} />
                </ListItemButton>
              </ListItem>
            )}

          {isLoggedIn && (
              <ListItem disablePadding>
                  <ListItemButton component={Link} to="/logout" selected={"/logout" === path}>
                      <ListItemIcon>
                          <LogoutIcon/>
                      </ListItemIcon>
                      <ListItemText primary={"Logout"} />
                  </ListItemButton>
              </ListItem>
          )}


        </List>
    
       </Box>

    </div>

  )



  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>

          <IconButton 
                color = "inheret"
                onClick={changeOpenStatus}
                sx={{mr:2}}
                >
                <MenuIcon/>
          </IconButton>
       
          <Typography variant="h6" noWrap component="div">
            Our application
          </Typography>
        </Toolbar>
      </AppBar>

  
        <Drawer
            variant="temporary"
            open = {open}
            onClose = {changeOpenStatus}
            sx={{
            
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
            >

            {myDrawer}

        </Drawer>

       

     

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />

            {content}
    
      </Box>
    </Box>
  );
}