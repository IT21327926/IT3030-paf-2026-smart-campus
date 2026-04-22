import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getAllBookings, createBooking, approveBooking, rejectBooking, cancelBooking, getAllResources } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusColors = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'error', CANCELLED: 'default' };

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    resourceId: '', startTime: '', endTime: '', purpose: '', expectedAttendees: ''
  });

  const loadData = () => {
    Promise.all([getAllBookings(), getAllResources()])
      .then(([b, r]) => {
        setBookings(b.data);
        setResources(r.data);
        setLoading(false);
      });
  };

  useEffect(() => { loadData(); }, []);

  const handleCreate = () => {
    createBooking(form).then(() => { loadData(); setOpen(false); });
  };

  const handleApprove = (id) => approveBooking(id).then(loadData);
  const handleReject = (id) => {
    const reason = window.prompt('Enter rejection reason:');
    if (reason) rejectBooking(id, reason).then(loadData);
  };
  const handleCancel = (id) => cancelBooking(id).then(loadData);

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">📅 Bookings</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          New Booking
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1a237e' }}>
            <TableRow>
              {['Resource', 'Purpose', 'Start Time', 'End Time', 'Attendees', 'Status', 'Actions'].map(h => (
                <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map(b => (
              <TableRow key={b.id} hover>
                <TableCell>{b.resource?.name}</TableCell>
                <TableCell>{b.purpose}</TableCell>
                <TableCell>{new Date(b.startTime).toLocaleString()}</TableCell>
                <TableCell>{new Date(b.endTime).toLocaleString()}</TableCell>
                <TableCell>{b.expectedAttendees || 'N/A'}</TableCell>
                <TableCell>
                  <Chip label={b.status} color={statusColors[b.status]} size="small" />
                </TableCell>
                <TableCell>
                  {user?.role === 'ADMIN' && b.status === 'PENDING' && (
                    <>
                      <Button size="small" color="success" onClick={() => handleApprove(b.id)}>Approve</Button>
                      <Button size="small" color="error" onClick={() => handleReject(b.id)}>Reject</Button>
                    </>
                  )}
                  {b.status === 'PENDING' || b.status === 'APPROVED' ? (
                    <Button size="small" color="warning" onClick={() => handleCancel(b.id)}>Cancel</Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Booking Request</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField select label="Resource" value={form.resourceId}
            onChange={e => setForm({...form, resourceId: e.target.value})} fullWidth>
            {resources.filter(r => r.status === 'ACTIVE').map(r => (
              <MenuItem key={r.id} value={r.id}>{r.name} - {r.location}</MenuItem>
            ))}
          </TextField>
          <TextField label="Purpose" value={form.purpose}
            onChange={e => setForm({...form, purpose: e.target.value})} fullWidth />
          <TextField label="Start Time" type="datetime-local" value={form.startTime}
            onChange={e => setForm({...form, startTime: e.target.value})}
            fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="End Time" type="datetime-local" value={form.endTime}
            onChange={e => setForm({...form, endTime: e.target.value})}
            fullWidth InputLabelProps={{ shrink: true }} />
          <TextField label="Expected Attendees" type="number" value={form.expectedAttendees}
            onChange={e => setForm({...form, expectedAttendees: e.target.value})} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookings;