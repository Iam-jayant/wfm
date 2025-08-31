import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Paper,
} from '@mui/material';
import { People, Work, LocationOn, Schedule } from '@mui/icons-material';
import { Worker, Job } from '@workforce-navigator/shared';
import { workerService, jobService } from '../services/api';


interface DashboardStats {
  totalWorkers: number;
  activeWorkers: number;
  totalJobs: number;
  pendingJobs: number;
}

const Dashboard: React.FC = () => {
  // Mock field workers
  const mockWorkers = [
    { id: '1', firstName: 'Amit', lastName: 'Sharma' },
    { id: '2', firstName: 'Priya', lastName: 'Patel' },
    { id: '3', firstName: 'Rahul', lastName: 'Verma' },
    { id: '4', firstName: 'Sneha', lastName: 'Singh' },
    { id: '5', firstName: 'Vikram', lastName: 'Reddy' },
  ];

  // Mock tasks
  const mockTasks = [
    {
      id: 'T1',
      title: 'Install Router',
      status: 'pending',
      assignedWorker: mockWorkers[0],
      location: { latitude: 28.6139, longitude: 77.2090 },
      customer: { name: 'Ravi Kumar', contact: '9876543210' },
    },
    {
      id: 'T2',
      title: 'Repair AC',
      status: 'in_progress',
      assignedWorker: mockWorkers[1],
      location: { latitude: 19.0760, longitude: 72.8777 },
      customer: { name: 'Meera Joshi', contact: '9123456789' },
    },
    {
      id: 'T3',
      title: 'Check Wiring',
      status: 'completed',
      assignedWorker: mockWorkers[2],
      location: { latitude: 13.0827, longitude: 80.2707 },
      customer: { name: 'Arjun Singh', contact: '9988776655' },
    },
    {
      id: 'T4',
      title: 'Replace Bulb',
      status: 'pending',
      assignedWorker: mockWorkers[3],
      location: { latitude: 22.5726, longitude: 88.3639 },
      customer: { name: 'Priya Patel', contact: '9001122334' },
    },
    {
      id: 'T5',
      title: 'Clean Filter',
      status: 'in_progress',
      assignedWorker: mockWorkers[4],
      location: { latitude: 17.3850, longitude: 78.4867 },
      customer: { name: 'Vikram Reddy', contact: '9012345678' },
    },
  ];

  // Create Task State
  const [newTask, setNewTask] = useState({
    title: '',
    assignedWorkerId: mockWorkers[0].id,
    latitude: '',
    longitude: '',
    customerName: '',
    customerContact: '',
  });
  const [tasks, setTasks] = useState<Array<{
    id: string;
    title: string;
    status: string;
    assignedWorker: { id: string; firstName: string; lastName: string };
    location?: { latitude: number; longitude: number };
    customer?: { name: string; contact: string };
  }>>(mockTasks);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const worker = mockWorkers.find(w => w.id === newTask.assignedWorkerId);
    if (worker && newTask.title && newTask.latitude && newTask.longitude && newTask.customerName && newTask.customerContact) {
      setTasks([
        ...tasks,
        {
          id: `T${tasks.length+1}`,
          title: newTask.title,
          status: 'pending',
          assignedWorker: worker,
          location: {
            latitude: parseFloat(newTask.latitude),
            longitude: parseFloat(newTask.longitude),
          },
          customer: {
            name: newTask.customerName,
            contact: newTask.customerContact,
          },
        }
      ]);
      setNewTask({
        title: '',
        assignedWorkerId: mockWorkers[0].id,
        latitude: '',
        longitude: '',
        customerName: '',
        customerContact: '',
      });
    }
  };
  const [stats, setStats] = useState<DashboardStats>({
    totalWorkers: 0,
    activeWorkers: 0,
    totalJobs: 0,
    pendingJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [workersResponse, jobsResponse] = await Promise.all([
          workerService.getWorkers(),
          jobService.getJobs(),
        ]);

        const workers: Worker[] = workersResponse.data;
        const jobs: Job[] = jobsResponse.data;

        setStats({
          totalWorkers: workers.length,
          activeWorkers: workers.filter(w => w.currentStatus === 'available' || w.currentStatus === 'busy').length,
          totalJobs: jobs.length,
          pendingJobs: jobs.filter(j => j.status === 'pending').length,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Workers',
      value: stats.totalWorkers,
      icon: <People fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Active Workers',
      value: stats.activeWorkers,
      icon: <LocationOn fontSize="large" />,
      color: '#2e7d32',
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: <Work fontSize="large" />,
      color: '#ed6c02',
    },
    {
      title: 'Pending Jobs',
      value: stats.pendingJobs,
      icon: <Schedule fontSize="large" />,
      color: '#d32f2f',
    },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your workforce operations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Task Option */}
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create Task
        </Typography>
        <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
          <form onSubmit={handleCreateTask} style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              style={{ padding: 8, fontSize: 16, flex: 1 }}
              required
            />
            <input
              type="text"
              placeholder="Latitude"
              value={newTask.latitude}
              onChange={e => setNewTask({ ...newTask, latitude: e.target.value })}
              style={{ padding: 8, fontSize: 16, width: 120 }}
              required
            />
            <input
              type="text"
              placeholder="Longitude"
              value={newTask.longitude}
              onChange={e => setNewTask({ ...newTask, longitude: e.target.value })}
              style={{ padding: 8, fontSize: 16, width: 120 }}
              required
            />
            <input
              type="text"
              placeholder="Customer Name"
              value={newTask.customerName}
              onChange={e => setNewTask({ ...newTask, customerName: e.target.value })}
              style={{ padding: 8, fontSize: 16, flex: 1 }}
              required
            />
            <input
              type="text"
              placeholder="Customer Contact"
              value={newTask.customerContact}
              onChange={e => setNewTask({ ...newTask, customerContact: e.target.value })}
              style={{ padding: 8, fontSize: 16, flex: 1 }}
              required
            />
            <select
              value={newTask.assignedWorkerId}
              onChange={e => setNewTask({ ...newTask, assignedWorkerId: e.target.value })}
              style={{ padding: 8, fontSize: 16 }}
            >
              {mockWorkers.map(w => (
                <option key={w.id} value={w.id}>{w.firstName} {w.lastName}</option>
              ))}
            </select>
            <button type="submit" style={{ padding: '8px 16px', fontSize: 16 }}>Create</button>
          </form>
        </Paper>
      </Box>

      {/* Task Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Task List
        </Typography>
        <Paper elevation={2} sx={{ p: 2 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Task</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Assigned Worker</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Location</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Customer</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Contact</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{task.title}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{task.status}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{task.assignedWorker.firstName} {task.assignedWorker.lastName}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{task.location ? `${task.location.latitude}, ${task.location.longitude}` : '-'}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{task.customer ? task.customer.name : '-'}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{task.customer ? task.customer.contact : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Paper>
      </Box>

      {/* ...existing code for map ... */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Live Workforce Map
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Real-time view of worker locations and job assignments
        </Typography>
        <Paper elevation={2} sx={{ p: 2 }}>
          <iframe
            src="http://localhost:3000/test-mappls.html"
            width="100%"
            height="500px"
            style={{
              border: 'none',
              borderRadius: '4px',
            }}
            title="MAPPLS Map"
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
