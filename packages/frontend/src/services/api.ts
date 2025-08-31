import axios from 'axios';
import { Worker, Job, TimesheetEntry, DailyTimesheet, ExpenseEntry, Notification } from '@workforce-navigator/shared';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('workforce_user');
  if (user) {
    const userData = JSON.parse(user);
    config.headers.Authorization = `Bearer ${userData.token}`;
  }
  return config;
});

// Handle API response format
api.interceptors.response.use((response) => {
  // Backend returns { success: true, data: ... }
  if (response.data && response.data.success) {
    response.data = response.data.data;
  }
  return response;
});

export const workerService = {
  getWorkers: () => api.get<Worker[]>('/workers'),
  getWorker: (id: string) => api.get<Worker>(`/workers/${id}`),
  updateWorkerLocation: (id: string, location: { latitude: number; longitude: number }) =>
    api.put(`/workers/${id}/location`, location),
};

export const jobService = {
  getJobs: () => api.get<Job[]>('/jobs'),
  getJob: (id: string) => api.get<Job>(`/jobs/${id}`),
  createJob: (job: Partial<Job>) => api.post<Job>('/jobs', job),
  assignJob: (jobId: string, workerId: string) => api.put(`/jobs/${jobId}/assign`, { workerId }),
};

export const timesheetService = {
  getTimesheets: (workerId: string, date?: string) => 
    api.get<TimesheetEntry[]>(`/timesheets/${workerId}${date ? `?date=${date}` : ''}`),
  getDailyTimesheet: (workerId: string, date: string) => 
    api.get<DailyTimesheet>(`/timesheets/daily/${workerId}/${date}`),
  getTimesheetSummary: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get<any[]>(`/timesheets/summary?${params.toString()}`);
  }
};

export const expenseService = {
  getExpenses: (workerId: string, date?: string, status?: string) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (status) params.append('status', status);
    return api.get<ExpenseEntry[]>(`/expenses/${workerId}?${params.toString()}`);
  },
  updateExpenseStatus: (id: string, status: string) => 
    api.put(`/expenses/${id}/status`, { status })
};

export const notificationService = {
  getNotifications: (userId: string, unreadOnly?: boolean) => {
    const params = unreadOnly ? '?unreadOnly=true' : '';
    return api.get<Notification[]>(`/notifications/${userId}${params}`);
  },
  markAsRead: (id: string) => 
    api.put(`/notifications/${id}/read`),
  markAllAsRead: (userId: string) => 
    api.put(`/notifications/${userId}/mark-all-read`),
  getUnreadCount: (userId: string) => 
    api.get<{ count: number }>(`/notifications/${userId}/unread-count`)
};

export default api;