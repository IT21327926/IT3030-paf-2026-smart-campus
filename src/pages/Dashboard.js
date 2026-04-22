import React, { useState, useEffect } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { getAllResources, getAllBookings, getAllTickets } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ title, value, color, icon }) => (
  <Paper elevation={3} sx={{ p: 3, borderRadius: 2, borderLeft: `5px solid ${color}` }}>
    <Typography variant="h6" color="text.secondary">{title}</Typography>
    <Typography variant="h3" fontWeight="bold" sx={{ color }}>{value}</Typography>
    <Typography variant="h4">{icon}</Typography>
  </Paper>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    resources: 0, bookings: 0, tickets: 0, pendingBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getAllResources().catch(() => ({ data: [] })),
      getAllBookings().catch(() => ({ data: [] })),
      getAllTickets().catch(() => ({ data: [] }))
    ]).then(([resources, bookings, tickets]) => {
      setStats({
        resources: resources.data.length,
        bookings: bookings.data.length,
        tickets: tickets.data.length,
        pendingBookings: bookings.data.filter(b => b.status === 'PENDING').length
      });
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={10}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Welcome back, {user?.name}! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Here's what's happening at Smart Campus today.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Resources" value={stats.resources} color="#1a237e" icon="🏫" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Bookings" value={stats.bookings} color="#2e7d32" icon="📅" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Pending Bookings" value={stats.pendingBookings} color="#e65100" icon="⏳" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Open Tickets" value={stats.tickets} color="#c62828" icon="🔧" />
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Grid container spacing={2}>
            {[
              { label: '📋 View Resources', path: '/resources' },
              { label: '📅 Make a Booking', path: '/bookings' },
              { label: '🔧 Report an Issue', path: '/tickets' },
              { label: '🔔 Notifications', path: '/notifications' },
            ].map((action) => (
              <Grid item xs={12} sm={6} md={3} key={action.label}>
                <Paper elevation={1} sx={{
                  p: 2, textAlign: 'center', cursor: 'pointer', borderRadius: 2,
                  '&:hover': { backgroundColor: '#e8eaf6' }
                }}
                  onClick={() => window.location.href = action.path}>
                  <Typography variant="body1" fontWeight="bold">{action.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default Dashboard;