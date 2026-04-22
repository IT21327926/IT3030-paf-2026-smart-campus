import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { Notifications as NotificationsIcon, Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUnreadCount } from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    getUnreadCount()
      .then(res => setUnreadCount(res.data.count))
      .catch(() => {});
    const interval = setInterval(() => {
      getUnreadCount()
        .then(res => setUnreadCount(res.data.count))
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1a237e' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 0, mr: 4, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/dashboard')}>
          🏫 Smart Campus
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/resources')}>Resources</Button>
          <Button color="inherit" onClick={() => navigate('/bookings')}>Bookings</Button>
          <Button color="inherit" onClick={() => navigate('/tickets')}>Tickets</Button>
        </Box>
        <IconButton color="inherit" onClick={() => navigate('/notifications')}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
          <Avatar src={user?.profilePicture} sx={{ width: 32, height: 32 }} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem disabled>{user?.name}</MenuItem>
          <MenuItem disabled>{user?.role}</MenuItem>
          <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;