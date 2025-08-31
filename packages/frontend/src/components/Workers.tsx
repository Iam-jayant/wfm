import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
} from '@mui/material';


const Workers: React.FC = () => {
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
    { id: 'T1', title: 'Install Router', status: 'pending', assignedWorker: mockWorkers[0] },
    { id: 'T2', title: 'Repair AC', status: 'in_progress', assignedWorker: mockWorkers[1] },
    { id: 'T3', title: 'Check Wiring', status: 'completed', assignedWorker: mockWorkers[2] },
    { id: 'T4', title: 'Replace Bulb', status: 'pending', assignedWorker: mockWorkers[3] },
    { id: 'T5', title: 'Clean Filter', status: 'in_progress', assignedWorker: mockWorkers[4] },
  ];
  const [loading] = useState(false);


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
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Field Workers
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Monitor and manage your field workforce
        </Typography>

        {/* Live Map Section */}
        <Box sx={{ mt: 3, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Worker Locations
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Real-time map showing all field worker locations
          </Typography>
          <Paper elevation={2} sx={{ p: 2 }}>
            <iframe
              src="./public/Gemini_Generated_Image_117jtj117jtj117j.png"
              width="100%"
              height="640px"
              
              style={{
                border: 'none',
                borderRadius: '4px',
              }}
              title="MAPPLS Map - Worker Locations"
            />
          </Paper>
        </Box>

        {/* Task Table for Workers */}
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
                </tr>
              </thead>
              <tbody>
                {mockTasks.map(task => (
                  <tr key={task.id}>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{task.title}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{task.status}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{task.assignedWorker.firstName} {task.assignedWorker.lastName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </Box>

        {/* ...existing code for worker details... */}
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Worker Details
        </Typography>
        {/* ...existing code... */}
      </Box>
    </Container>
  );
};

export default Workers;