import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { Fragment } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { IconButton } from '@mui/material';

import AxiosInstance from './Axios';

import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import TimelineIcon from '@mui/icons-material/Timeline';
import AddchartIcon from '@mui/icons-material/Addchart';

export default function Navbar(props) {
  const [renderCount, setRenderCount] = useState(0);
  const {drawerWidth, content} = props
  const location = useLocation()
  const path = location.pathname
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userId = Number(localStorage.getItem('user_id'));

  //sets the isLoggedIn state based on the userId
  useEffect(() => {
    setRenderCount(prevCount => prevCount + 1);
  }, []);

  useEffect(() => {
    if (userId) {
      setIsLoggedIn(true);
    }
    else {
      setIsLoggedIn(false);
    }
  }, [userId]);

  const userRole= localStorage.getItem('user_role');
  

  const handleLogout = async () => {
    try {
      const response = await AxiosInstance.get('/logout/'); // replace with your logout endpoint
      if (response.status === 200) {
        // Handle successful logout here
        console.log('Logged out');
        localStorage.removeItem('user_id');
        setIsLoggedIn(false); // Update the isLoggedIn state
        navigate('/');
      } else {
        console.log('Logout failed with status:', response.status);
      }
    } catch (error) {
      console.log('Logout request failed:', error);
    }
  };

  const changeOpenStatus = () => {
    setOpen(!open)
  }

  // The drawer content
  const myDrawer = (
    <Fragment>
      <h1>Renderizado: {renderCount} veces</h1>
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
                  <ListItemText primary={"Add match"} />
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
            {isLoggedIn && userRole === 'student' && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/Matchstats" selected={"/Matchstats" === path}>
                  <ListItemIcon>
                    <TimelineIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"User Match Stats"} />
                </ListItemButton>
              </ListItem>
            )}


          {isLoggedIn && (
              <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                      <ListItemIcon>
                          <LogoutIcon/>
                      </ListItemIcon>
                      <ListItemText primary={"Logout"} />
                  </ListItemButton>
              </ListItem>
          )}

          {isLoggedIn && userRole === 'professor' && (
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/matchstats2" selected={"/matchstats2" === path}>
                  <ListItemIcon>
                    <AddchartIcon/>
                  </ListItemIcon>
                  <ListItemText primary={"Add match"} />
                </ListItemButton>
              </ListItem>
            )}

            {isLoggedIn && userRole === 'professor' && (
              <ListItem disablePadding>
              <ListItemButton component={Link} to="/create" selected={"/create" === path}>
              <ListItemIcon>
                      <BorderColorIcon/>
              </ListItemIcon>
              <ListItemText primary={"Create"} />
              </ListItemButton>
          </ListItem>
            )}

        </List>
    
       </Box>

    </Fragment>

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

