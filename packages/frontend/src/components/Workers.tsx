import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Badge,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  LocationOn, 
  Work, 
  CheckCircle,
  Pending,
  PlayArrow,
  Schedule,
  TrendingUp,
  Group
} from '@mui/icons-material';
import MapplsMap from './MapplsMap';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const Workers: React.FC = () => {
  // Mock field workers with enhanced data
  const mockWorkers = [
    { 
      id: '1', 
      firstName: 'Amit', 
      lastName: 'Sharma',
      avatar: 'AS',
      status: 'available',
      phone: '+91-9876543210',
      email: 'amit.sharma@company.com',
      team: 'Team Alpha',
      location: 'New Delhi',
      skills: ['Electrical', 'Plumbing'],
      rating: 4.8,
      tasksCompleted: 45,
      currentLocation: { latitude: 28.6139, longitude: 77.2090 }
    },
    { 
      id: '2', 
      firstName: 'Priya', 
      lastName: 'Patel',
      avatar: 'PP',
      status: 'busy',
      phone: '+91-9876543211',
      email: 'priya.patel@company.com',
      team: 'Team Beta',
      location: 'Mumbai',
      skills: ['HVAC', 'Electrical'],
      rating: 4.9,
      tasksCompleted: 52,
      currentLocation: { latitude: 19.0760, longitude: 72.8777 }
    },
    { 
      id: '3', 
      firstName: 'Rahul', 
      lastName: 'Verma',
      avatar: 'RV',
      status: 'offline',
      phone: '+91-9876543212',
      email: 'rahul.verma@company.com',
      team: 'Team Alpha',
      location: 'Chennai',
      skills: ['Plumbing', 'Carpentry'],
      rating: 4.7,
      tasksCompleted: 38,
      currentLocation: { latitude: 13.0827, longitude: 80.2707 }
    },
    { 
      id: '4', 
      firstName: 'Sneha', 
      lastName: 'Singh',
      avatar: 'SS',
      status: 'available',
      phone: '+91-9876543213',
      email: 'sneha.singh@company.com',
      team: 'Team Gamma',
      location: 'Kolkata',
      skills: ['Electrical', 'HVAC'],
      rating: 4.6,
      tasksCompleted: 41,
      currentLocation: { latitude: 22.5726, longitude: 88.3639 }
    },
    { 
      id: '5', 
      firstName: 'Vikram', 
      lastName: 'Reddy',
      avatar: 'VR',
      status: 'busy',
      phone: '+91-9876543214',
      email: 'vikram.reddy@company.com',
      team: 'Team Beta',
      location: 'Hyderabad',
      skills: ['Plumbing', 'Carpentry'],
      rating: 4.8,
      tasksCompleted: 47,
      currentLocation: { latitude: 17.3850, longitude: 78.4867 }
    },
  ];

  // Mock tasks with enhanced data
  const mockTasks = [
    { 
      id: 'T1', 
      title: 'Install Router', 
      status: 'pending', 
      assignedWorker: mockWorkers[0],
      priority: 'high',
      estimatedTime: '2 hours',
      location: 'Office Building A',
      location_coords: { latitude: 28.6339, longitude: 77.2199 }
    },
    { 
      id: 'T2', 
      title: 'Repair AC', 
      status: 'in_progress', 
      assignedWorker: mockWorkers[1],
      priority: 'urgent',
      estimatedTime: '3 hours',
      location: 'Shopping Mall',
      location_coords: { latitude: 19.0760, longitude: 72.8777 }
    },
    { 
      id: 'T3', 
      title: 'Check Wiring', 
      status: 'completed', 
      assignedWorker: mockWorkers[2],
      priority: 'medium',
      estimatedTime: '1.5 hours',
      location: 'Residential Complex',
      location_coords: { latitude: 13.0827, longitude: 80.2707 }
    },
    { 
      id: 'T4', 
      title: 'Replace Bulb', 
      status: 'pending', 
      assignedWorker: mockWorkers[3],
      priority: 'low',
      estimatedTime: '0.5 hours',
      location: 'Warehouse',
      location_coords: { latitude: 22.5726, longitude: 88.3639 }
    },
    { 
      id: 'T5', 
      title: 'Clean Filter', 
      status: 'in_progress', 
      assignedWorker: mockWorkers[4],
      priority: 'medium',
      estimatedTime: '1 hour',
      location: 'Office Building B',
      location_coords: { latitude: 17.3850, longitude: 78.4867 }
    },
  ];

  const [loading] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4caf50';
      case 'busy': return '#ff9800';
      case 'offline': return '#f44336';
      default: return '#757575';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle fontSize="small" />;
      case 'busy': return <Work fontSize="small" />;
      case 'offline': return <Schedule fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in_progress': return '#2196f3';
      case 'pending': return '#ff9800';
      default: return '#757575';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle fontSize="small" />;
      case 'in_progress': return <PlayArrow fontSize="small" />;
      case 'pending': return <Pending fontSize="small" />;
      default: return <Schedule fontSize="small" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#f44336';
      case 'high': return '#ff9800';
      case 'medium': return '#2196f3';
      case 'low': return '#4caf50';
      default: return '#757575';
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
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)',
                width: 56,
                height: 56
              }}>
                <Group sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Field Workers
        </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Monitor and manage your field workforce
        </Typography>
              </Box>
            </Box>
          </Box>
        </MotionBox>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Total Workers
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {mockWorkers.length}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Active workforce
                    </Typography>
                  </Box>
                  <Box sx={{ opacity: 0.8 }}>
                    <Group sx={{ fontSize: 40 }} />
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Available
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {mockWorkers.filter(w => w.status === 'available').length}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Ready for tasks
                    </Typography>
                  </Box>
                  <Box sx={{ opacity: 0.8 }}>
                    <CheckCircle sx={{ fontSize: 40 }} />
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              sx={{
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Active Tasks
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {mockTasks.filter(t => t.status === 'in_progress').length}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      In progress
                    </Typography>
                  </Box>
                  <Box sx={{ opacity: 0.8 }}>
                    <Work sx={{ fontSize: 40 }} />
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              sx={{
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                      Avg Rating
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      4.8
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Team performance
                    </Typography>
                  </Box>
                  <Box sx={{ opacity: 0.8 }}>
                    <TrendingUp sx={{ fontSize: 40 }} />
                  </Box>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Main Content Grid */}
        <Grid container spacing={3}>
          {/* Workers List */}
          <Grid item xs={12} lg={8}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  Team Members
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockWorkers.map((worker, index) => (
                    <MotionBox
                      key={worker.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                          border: '1px solid #e9ecef',
                          '&:hover': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease'
                          }
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <Box
                                sx={{
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%',
                                  background: getStatusColor(worker.status),
                                  border: '2px solid white'
                                }}
                              />
                            }
                          >
                            <Avatar sx={{ 
                              bgcolor: '#667eea',
                              width: 48,
                              height: 48
                            }}>
                              {worker.avatar}
                            </Avatar>
                          </Badge>
                          <Box sx={{ flex: 1 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {worker.firstName} {worker.lastName}
          </Typography>
                              <Chip
                                icon={getStatusIcon(worker.status)}
                                label={worker.status}
                                size="small"
                                sx={{
                                  background: getStatusColor(worker.status),
                                  color: 'white',
                                  textTransform: 'capitalize',
                                  fontWeight: 600
                                }}
                              />
                            </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
                              {worker.team} • {worker.location}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={2} mt={1}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                  ⭐ {worker.rating}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                📋 {worker.tasksCompleted} tasks
          </Typography>
                            </Box>
                            <Box display="flex" gap={1} mt={1}>
                              {worker.skills.map((skill, idx) => (
                                <Chip
                                  key={idx}
                                  label={skill}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="column" gap={1}>
                            <Tooltip title="Location">
                              <IconButton size="small" sx={{ color: '#667eea' }}>
                                <LocationOn fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Work Details">
                              <IconButton size="small">
                                <Work fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Paper>
                    </MotionBox>
                  ))}
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          {/* Task Summary */}
          <Grid item xs={12} lg={4}>
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
                  Task Overview
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {mockTasks.slice(0, 4).map((task, index) => (
                    <MotionBox
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: '#f8f9fa',
                          border: '1px solid #e9ecef'
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
                            {task.title}
                          </Typography>
                          <Chip
                            icon={getTaskStatusIcon(task.status)}
                            label={task.status.replace('_', ' ')}
                            size="small"
                            sx={{
                              background: getTaskStatusColor(task.status),
                              color: 'white',
                              textTransform: 'capitalize',
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          {task.location} • {task.estimatedTime}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={1}>
                          <Typography variant="caption" color="text.secondary">
                            Assigned to:
                          </Typography>
                          <Typography variant="caption" sx={{ fontWeight: 500 }}>
                            {task.assignedWorker.firstName} {task.assignedWorker.lastName}
                          </Typography>
                        </Box>
                        <Chip
                          label={task.priority}
                          size="small"
                          sx={{
                            background: getPriorityColor(task.priority),
                            color: 'white',
                            textTransform: 'capitalize',
                            fontSize: '0.7rem',
                            mt: 1
                          }}
            />
          </Paper>
                    </MotionBox>
                  ))}
        </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Live Map Section */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          sx={{ mt: 4 }}
        >
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Worker Locations - Live MAPPLS Map
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                Real-time interactive MAPPLS map showing all field worker and job locations
          </Typography>
              
              {/* MAPPLS Map Component */}
              <Box sx={{ height: 'calc(100% - 120px)' }}>
                <MapplsMap 
                  height="100%"
                  workers={mockWorkers.map(w => ({
                    id: w.id,
                    firstName: w.firstName,
                    lastName: w.lastName,
                    currentStatus: w.status,
                    currentLocation: w.currentLocation
                  }))}
                  jobs={mockTasks.map(t => ({
                    id: t.id,
                    title: t.title,
                    status: t.status,
                    location: t.location_coords
                  }))}
                  onMarkerClick={handleMarkerClick}
                />
              </Box>
              
              {/* Map Instructions */}
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2, border: '1px solid rgba(102, 126, 234, 0.1)' }}>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  <strong>MAPPLS Map Features:</strong> Interactive markers for workers (W) and jobs (J), real-time location tracking, 
                  clickable information panels, and professional mapping interface powered by MapmyIndia.
        </Typography>
      </Box>
            </CardContent>
          </Card>
        </MotionBox>
    </Container>
    </Box>
  );
};

export default Workers;