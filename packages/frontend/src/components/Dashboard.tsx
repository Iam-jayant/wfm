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
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  People, 
  Work, 
  LocationOn, 
  Schedule, 
  Add,
  FilterList,
  Description,
  CheckCircle,
  Pending,
  PlayArrow,
  MoreVert
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Worker, Job } from '@workforce-navigator/shared';
import { workerService, jobService } from '../services/api';
import MapplsMap from './MapplsMap';

interface DashboardStats {
  totalWorkers: number;
  activeWorkers: number;
  totalJobs: number;
  pendingJobs: number;
}

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const Dashboard: React.FC = () => {
  // Mock field workers
  const mockWorkers = [
    { id: '1', firstName: 'Amit', lastName: 'Sharma', avatar: 'AS', currentStatus: 'available', currentLocation: { latitude: 28.6139, longitude: 77.2090 } },
    { id: '2', firstName: 'Priya', lastName: 'Patel', avatar: 'PP', currentStatus: 'busy', currentLocation: { latitude: 19.0760, longitude: 72.8777 } },
    { id: '3', firstName: 'Rahul', lastName: 'Verma', avatar: 'RV', currentStatus: 'offline', currentLocation: { latitude: 13.0827, longitude: 80.2707 } },
    { id: '4', firstName: 'Sneha', lastName: 'Singh', avatar: 'SS', currentStatus: 'available', currentLocation: { latitude: 22.5726, longitude: 88.3639 } },
    { id: '5', firstName: 'Vikram', lastName: 'Reddy', avatar: 'VR', currentStatus: 'busy', currentLocation: { latitude: 17.3850, longitude: 78.4867 } },
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
    assignedWorker: { id: string; firstName: string; lastName: string; avatar: string };
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
          totalWorkers: workers.length || 10,
          activeWorkers: workers.filter(w => w.currentStatus === 'available' || w.currentStatus === 'busy').length || 8,
          totalJobs: jobs.length || 15,
          pendingJobs: jobs.filter(j => j.status === 'pending').length || 3,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set mock data if API fails
        setStats({
          totalWorkers: 10,
          activeWorkers: 8,
          totalJobs: 15,
          pendingJobs: 3,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Chart data
  const jobTrendsData = [
    { month: 'Jan', jobs: 12 },
    { month: 'Feb', jobs: 15 },
    { month: 'Mar', jobs: 18 },
    { month: 'Apr', jobs: 22 },
    { month: 'May', jobs: 25 },
    { month: 'Jun', jobs: 28 },
  ];

  const jobStatusData = [
    { name: 'In Progress', value: 8, color: '#1976d2' },
    { name: 'Completed', value: 4, color: '#2e7d32' },
    { name: 'Pending', value: 3, color: '#ed6c02' },
  ];

  const statCards = [
    {
      title: 'Total Workers',
      value: stats.totalWorkers,
      icon: <People />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      trend: '+12% since last week',
    },
    {
      title: 'Active Workers',
      value: stats.activeWorkers,
      icon: <LocationOn />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      trend: '+8% since last week',
    },
    {
      title: 'Total Jobs',
      value: stats.totalJobs,
      icon: <Work />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      trend: '+15% since last week',
    },
    {
      title: 'Pending Jobs',
      value: stats.pendingJobs,
      icon: <Schedule />,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      trend: '-5% since last week',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#2e7d32';
      case 'in_progress': return '#1976d2';
      case 'pending': return '#ed6c02';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle fontSize="small" />;
      case 'in_progress': return <PlayArrow fontSize="small" />;
      case 'pending': return <Pending fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  // Handle marker clicks on the map
  const handleMarkerClick = (item: any, type: 'worker' | 'job') => {
    console.log(`${type} clicked:`, item);
    // You can add more functionality here like showing details in a modal
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 3
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{ mb: 4 }}
        >
          <Box sx={{ 
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            borderRadius: 3,
            p: 3,
            color: 'white',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                  WorkForce Navigator
        </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Overview of your workforce operations
        </Typography>
      </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body1">John Manager</Typography>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>JM</Avatar>
              </Box>
            </Box>
          </Box>
        </MotionBox>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                sx={{
                  background: card.gradient,
                  color: 'white',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      {card.title}
                    </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {card.value}
                    </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {card.trend}
                      </Typography>
                  </Box>
                    <Box sx={{ 
                      opacity: 0.8,
                      '& svg': { fontSize: 40 }
                    }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
                <Box sx={{
                  position: 'absolute',
                  top: -20,
                  right: -20,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  zIndex: 1
                }} />
              </MotionCard>
          </Grid>
        ))}
      </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Create Task Card */}
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Create Task
        </Typography>
                <Box component="form" onSubmit={handleCreateTask} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Task Title"
              value={newTask.title}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              required
                    size="small"
                  />
                  <Box display="flex" gap={2}>
                    <TextField
                      label="Latitude"
              value={newTask.latitude}
              onChange={e => setNewTask({ ...newTask, latitude: e.target.value })}
              required
                      size="small"
            />
                    <TextField
                      label="Longitude"
              value={newTask.longitude}
              onChange={e => setNewTask({ ...newTask, longitude: e.target.value })}
              required
                      size="small"
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="Customer Name"
              value={newTask.customerName}
              onChange={e => setNewTask({ ...newTask, customerName: e.target.value })}
              required
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Customer Contact"
              value={newTask.customerContact}
              onChange={e => setNewTask({ ...newTask, customerContact: e.target.value })}
              required
                    size="small"
            />
                  <FormControl fullWidth size="small">
                    <InputLabel>Assigned Worker</InputLabel>
                    <Select
              value={newTask.assignedWorkerId}
              onChange={e => setNewTask({ ...newTask, assignedWorkerId: e.target.value })}
                      label="Assigned Worker"
                    >
                      {mockWorkers.map(w => (
                        <MenuItem key={w.id} value={w.id}>
                          {w.firstName} {w.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      mt: 2,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Create Task
                  </Button>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Job Trends Chart */}
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Job Trends
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={jobTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <RechartsTooltip 
                      contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="jobs" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      dot={{ fill: '#667eea', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#667eea', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Job Status Chart */}
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Job Status
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={jobStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {jobStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{
                        background: 'rgba(255,255,255,0.95)',
                        border: 'none',
                        borderRadius: 8,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <Box display="flex" justifyContent="center" gap={2} mt={2}>
                  {jobStatusData.map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: item.color
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {item.name}
                      </Typography>
                    </Box>
                  ))}
      </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Bottom Row */}
        <Grid container spacing={3}>
          {/* Active Tasks */}
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Active Tasks
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {tasks.slice(0, 3).map((task) => (
                    <Box
                      key={task.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: '#f8f9fa',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {task.title}
        </Typography>
                        <Chip
                          icon={getStatusIcon(task.status)}
                          label={task.status.replace('_', ' ')}
                          size="small"
                          sx={{
                            background: getStatusColor(task.status),
                            color: 'white',
                            textTransform: 'capitalize'
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
      </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Live MAPPLS Map */}
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Live MAPPLS Map
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                  Interactive map showing workers and tasks
                </Typography>
                
                {/* MAPPLS Map Component */}
                <Box sx={{ height: 'calc(100% - 120px)' }}>
                  <MapplsMap 
                    height="100%"
                    workers={mockWorkers.map(w => ({
                      id: w.id,
                      firstName: w.firstName,
                      lastName: w.lastName,
                      currentStatus: w.currentStatus,
                      currentLocation: w.currentLocation
                    }))}
                    jobs={mockTasks.map(t => ({
                      id: t.id,
                      title: t.title,
                      status: t.status,
                      location: t.location
                    }))}
                    onMarkerClick={handleMarkerClick}
                  />
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Active Workers */}
          <Grid item xs={12} md={4}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Active Workers
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockWorkers.slice(0, 4).map((worker) => (
                    <Box
                      key={worker.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        background: '#f8f9fa',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      <Avatar sx={{ bgcolor: '#667eea' }}>
                        {worker.avatar}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {worker.firstName} {worker.lastName}
        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {worker.currentStatus === 'available' ? 'Available' : worker.currentStatus === 'busy' ? 'Busy' : 'Offline'}
        </Typography>
                      </Box>
                      <IconButton size="small">
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Floating Action Buttons */}
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 2, zIndex: 1000 }}>
          <MotionBox
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Tooltip title="Export Report" placement="left">
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                <Description color="primary" />
              </Paper>
            </Tooltip>
          </MotionBox>
          
          <MotionBox
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            <Tooltip title="Filter" placement="left">
              <Paper
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  background: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  '&:hover': { transform: 'scale(1.1)' }
                }}
              >
                <FilterList color="primary" />
              </Paper>
            </Tooltip>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <Tooltip title="Add New" placement="left">
              <Paper
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                  '&:hover': { 
                    transform: 'scale(1.1)',
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)'
                  }
                }}
              >
                <Add />
        </Paper>
            </Tooltip>
          </MotionBox>
      </Box>
    </Container>
    </Box>
  );
};

export default Dashboard;
