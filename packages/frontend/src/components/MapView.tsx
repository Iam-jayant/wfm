import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
} from '@mui/material';
import { Map as MapIcon, FilterList } from '@mui/icons-material';
import MapComponent from './Map';

const MapView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <MapIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Live Map
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Real-time tracking of field workers and job assignments
        </Typography>
      </Box>

      {/* Filters */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Worker Status</InputLabel>
              <Select
                value={statusFilter}
                label="Worker Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Workers</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="busy">Busy</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Job Status</InputLabel>
              <Select
                value={jobFilter}
                label="Job Status"
                onChange={(e) => setJobFilter(e.target.value)}
              >
                <MenuItem value="all">All Jobs</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="assigned">Assigned</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Legend */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Map Legend
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Workers
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label="Available"
                size="small"
                sx={{ bgcolor: '#4caf50', color: 'white' }}
              />
              <Chip
                label="Busy"
                size="small"
                sx={{ bgcolor: '#ff9800', color: 'white' }}
              />
              <Chip
                label="Offline"
                size="small"
                sx={{ bgcolor: '#f44336', color: 'white' }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Jobs
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label="Pending"
                size="small"
                sx={{ bgcolor: '#2196f3', color: 'white' }}
              />
              <Chip
                label="Assigned"
                size="small"
                sx={{ bgcolor: '#ff9800', color: 'white' }}
              />
              <Chip
                label="In Progress"
                size="small"
                sx={{ bgcolor: '#9c27b0', color: 'white' }}
              />
              <Chip
                label="Completed"
                size="small"
                sx={{ bgcolor: '#4caf50', color: 'white' }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Map */}
      <Paper elevation={2} sx={{ p: 1 }}>
        <MapComponent />
      </Paper>

      {/* Auto-refresh indicator */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Map updates automatically every 5 minutes • Click markers for details
        </Typography>
      </Box>
    </Container>
  );
};

export default MapView;