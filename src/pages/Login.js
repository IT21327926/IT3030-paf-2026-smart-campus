import React from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"
      sx={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)' }}>
      <Paper elevation={10} sx={{ p: 6, borderRadius: 3, textAlign: 'center', maxWidth: 400, width: '90%' }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          🏫 Smart Campus
        </Typography>
        <Typography variant="h6" gutterBottom>
          Operations Hub
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage facilities, bookings, and maintenance all in one place
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<GoogleIcon />}
          onClick={login}
          sx={{
            backgroundColor: '#4285F4',
            '&:hover': { backgroundColor: '#3367D6' },
            py: 1.5,
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}>
          Sign in with Google
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;