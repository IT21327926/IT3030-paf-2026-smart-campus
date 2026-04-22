import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, List, ListItem, ListItemText,
  Button, Chip, CircularProgress, Divider
} from '@mui/material';
import { getNotifications, markAsRead, markAllAsRead } from '../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = () => {
    getNotifications().then(res => {
      setNotifications(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleMarkAsRead = (id) => {
    markAsRead(id).then(loadNotifications);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead().then(loadNotifications);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={10}>
      <CircularProgress />
    </Box>
  );

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">🔔 Notifications</Typography>
        {notifications.some(n => !n.read) && (
          <Button variant="outlined" onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </Box>

      {notifications.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="text.secondary">
            🎉 You're all caught up! No notifications.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ borderRadius: 2 }}>
          <List>
            {notifications.map((n, index) => (
              <React.Fragment key={n.id}>
                <ListItem
                  sx={{ backgroundColor: n.read ? 'white' : '#e8eaf6', py: 2 }}
                  secondaryAction={
                    !n.read && (
                      <Button size="small" onClick={() => handleMarkAsRead(n.id)}>
                        Mark Read
                      </Button>
                    )
                  }>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight={n.read ? 'normal' : 'bold'}>
                          {n.title}
                        </Typography>
                        {!n.read && <Chip label="New" color="primary" size="small" />}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">{n.message}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(n.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default Notifications;