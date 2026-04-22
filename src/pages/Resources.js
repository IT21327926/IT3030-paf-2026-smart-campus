import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getAllResources, createResource, updateResource, deleteResource } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusColors = { ACTIVE: 'success', OUT_OF_SERVICE: 'error', MAINTENANCE: 'warning' };

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editResource, setEditResource] = useState(null);
  const [form, setForm] = useState({
    name: '', type: 'LECTURE_HALL', capacity: '', location: '',
    description: '', availabilityWindows: '', status: 'ACTIVE'
  });

  const loadResources = () => {
    getAllResources().then(res => {
      setResources(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { loadResources(); }, []);

  const handleOpen = (resource = null) => {
    if (resource) {
      setEditResource(resource);
      setForm(resource);
    } else {
      setEditResource(null);
      setForm({ name: '', type: 'LECTURE_HALL', capacity: '', location: '',
        description: '', availabilityWindows: '', status: 'ACTIVE' });
    }
    setOpen(true);
  };

  const handleSave = () => {
    const action = editResource
      ? updateResource(editResource.id, form)
      : createResource(form);
    action.then(() => { loadResources(); setOpen(false); });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this resource?')) {
      deleteResource(id).then(loadResources);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">🏫 Resources</Typography>
        {user?.role === 'ADMIN' && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
            Add Resource
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1a237e' }}>
            <TableRow>
              {['Name', 'Type', 'Capacity', 'Location', 'Status', 'Actions'].map(h => (
                <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {resources.map(r => (
              <TableRow key={r.id} hover>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.type}</TableCell>
                <TableCell>{r.capacity || 'N/A'}</TableCell>
                <TableCell>{r.location}</TableCell>
                <TableCell>
                  <Chip label={r.status} color={statusColors[r.status]} size="small" />
                </TableCell>
                <TableCell>
                  {user?.role === 'ADMIN' && (
                    <>
                      <Button size="small" onClick={() => handleOpen(r)}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(r.id)}>Delete</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} fullWidth />
          <TextField select label="Type" value={form.type} onChange={e => setForm({...form, type: e.target.value})} fullWidth>
            {['LECTURE_HALL','LAB','MEETING_ROOM','PROJECTOR','CAMERA','OTHER'].map(t => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
          <TextField label="Capacity" type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} fullWidth />
          <TextField label="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} fullWidth />
          <TextField label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} fullWidth multiline rows={2} />
          <TextField label="Availability Windows" value={form.availabilityWindows} onChange={e => setForm({...form, availabilityWindows: e.target.value})} fullWidth />
          <TextField select label="Status" value={form.status} onChange={e => setForm({...form, status: e.target.value})} fullWidth>
            {['ACTIVE','OUT_OF_SERVICE','MAINTENANCE'].map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Resources;