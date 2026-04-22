import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { getAllTickets, createTicket, updateTicketStatus, getTicketComments, addComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusColors = { OPEN: 'info', IN_PROGRESS: 'warning', RESOLVED: 'success', CLOSED: 'default', REJECTED: 'error' };
const priorityColors = { LOW: 'success', MEDIUM: 'info', HIGH: 'warning', CRITICAL: 'error' };

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: 'OTHER', priority: 'MEDIUM',
    location: '', resourceName: '', contactDetails: ''
  });

  const loadTickets = () => {
    getAllTickets().then(res => { setTickets(res.data); setLoading(false); });
  };

  useEffect(() => { loadTickets(); }, []);

  const handleCreate = () => {
    createTicket(form).then(() => { loadTickets(); setOpen(false); });
  };

  const handleStatusUpdate = (id, status) => {
    const resolutionNotes = status === 'RESOLVED' ? window.prompt('Enter resolution notes:') : null;
    updateTicketStatus(id, { status, resolutionNotes }).then(loadTickets);
  };

  const handleViewComments = (ticket) => {
    setSelectedTicket(ticket);
    getTicketComments(ticket.id).then(res => setComments(res.data));
    setCommentOpen(true);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(selectedTicket.id, newComment).then(res => {
        setComments([...comments, res.data]);
        setNewComment('');
      });
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">🔧 Tickets</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          New Ticket
        </Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#1a237e' }}>
            <TableRow>
              {['Title', 'Category', 'Priority', 'Location', 'Status', 'Actions'].map(h => (
                <TableCell key={h} sx={{ color: 'white', fontWeight: 'bold' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map(t => (
              <TableRow key={t.id} hover>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.category}</TableCell>
                <TableCell>
                  <Chip label={t.priority} color={priorityColors[t.priority]} size="small" />
                </TableCell>
                <TableCell>{t.location}</TableCell>
                <TableCell>
                  <Chip label={t.status} color={statusColors[t.status]} size="small" />
                </TableCell>
                <TableCell>
                  <Button size="small" onClick={() => handleViewComments(t)}>Comments</Button>
                  {(user?.role === 'ADMIN' || user?.role === 'TECHNICIAN') && (
                    <>
                      {t.status === 'OPEN' && (
                        <Button size="small" color="warning"
                          onClick={() => handleStatusUpdate(t.id, 'IN_PROGRESS')}>Start</Button>
                      )}
                      {t.status === 'IN_PROGRESS' && (
                        <Button size="small" color="success"
                          onClick={() => handleStatusUpdate(t.id, 'RESOLVED')}>Resolve</Button>
                      )}
                      {t.status === 'RESOLVED' && (
                        <Button size="small"
                          onClick={() => handleStatusUpdate(t.id, 'CLOSED')}>Close</Button>
                      )}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Ticket Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Report New Issue</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Title" value={form.title}
            onChange={e => setForm({...form, title: e.target.value})} fullWidth />
          <TextField label="Description" value={form.description}
            onChange={e => setForm({...form, description: e.target.value})} fullWidth multiline rows={3} />
          <TextField select label="Category" value={form.category}
            onChange={e => setForm({...form, category: e.target.value})} fullWidth>
            {['ELECTRICAL','PLUMBING','HVAC','IT_EQUIPMENT','FURNITURE','CLEANING','SECURITY','OTHER'].map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Priority" value={form.priority}
            onChange={e => setForm({...form, priority: e.target.value})} fullWidth>
            {['LOW','MEDIUM','HIGH','CRITICAL'].map(p => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>
          <TextField label="Location" value={form.location}
            onChange={e => setForm({...form, location: e.target.value})} fullWidth />
          <TextField label="Resource Name (optional)" value={form.resourceName}
            onChange={e => setForm({...form, resourceName: e.target.value})} fullWidth />
          <TextField label="Contact Details" value={form.contactDetails}
            onChange={e => setForm({...form, contactDetails: e.target.value})} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Comments Dialog */}
      <Dialog open={commentOpen} onClose={() => setCommentOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Comments - {selectedTicket?.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
            {comments.length === 0 ? (
              <Typography color="text.secondary">No comments yet.</Typography>
            ) : comments.map(c => (
              <Paper key={c.id} sx={{ p: 2, mb: 1, backgroundColor: '#f5f5f5' }}>
                <Typography variant="caption" color="text.secondary">
                  {c.user?.name} • {new Date(c.createdAt).toLocaleString()}
                </Typography>
                <Typography>{c.content}</Typography>
              </Paper>
            ))}
          </Box>
          <Box display="flex" gap={1}>
            <TextField fullWidth size="small" placeholder="Add a comment..."
              value={newComment} onChange={e => setNewComment(e.target.value)} />
            <Button variant="contained" onClick={handleAddComment}>Post</Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Tickets;