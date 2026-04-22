import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth
export const getCurrentUser = () => api.get('/auth/me');
export const logout = () => api.post('/auth/logout');

// Resources
export const getAllResources = (params) => api.get('/resources', { params });
export const getResourceById = (id) => api.get(`/resources/${id}`);
export const createResource = (data) => api.post('/resources', data);
export const updateResource = (id, data) => api.put(`/resources/${id}`, data);
export const deleteResource = (id) => api.delete(`/resources/${id}`);
export const updateResourceStatus = (id, status) => 
  api.patch(`/resources/${id}/status`, null, { params: { status } });

// Bookings
export const getAllBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const approveBooking = (id) => api.patch(`/bookings/${id}/approve`);
export const rejectBooking = (id, reason) => api.patch(`/bookings/${id}/reject`, { reason });
export const cancelBooking = (id) => api.patch(`/bookings/${id}/cancel`);

// Tickets
export const getAllTickets = (params) => api.get('/tickets', { params });
export const getTicketById = (id) => api.get(`/tickets/${id}`);
export const createTicket = (data) => api.post('/tickets', data);
export const updateTicketStatus = (id, data) => api.patch(`/tickets/${id}/status`, data);
export const assignTicket = (id, technicianId) => 
  api.patch(`/tickets/${id}/assign`, { technicianId });
export const getTicketComments = (id) => api.get(`/tickets/${id}/comments`);
export const addComment = (id, content) => api.post(`/tickets/${id}/comments`, { content });
export const updateComment = (id, content) => api.put(`/tickets/comments/${id}`, { content });
export const deleteComment = (id) => api.delete(`/tickets/comments/${id}`);

// Notifications
export const getNotifications = () => api.get('/notifications');
export const getUnreadCount = () => api.get('/notifications/unread/count');
export const markAsRead = (id) => api.patch(`/notifications/${id}/read`);
export const markAllAsRead = () => api.patch('/notifications/read-all');

export default api;