import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Avatar, 
  IconButton, 
  Box,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { 
  Map as MapIcon, 
  LocationOn,
  Person,
  Work,
  Close
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import MapplsMap from './MapplsMap';

// Mock data for demonstration
const mockWorkers = [
  {
    id: '1',
    firstName: 'Amit',
    lastName: 'Sharma',
    currentStatus: 'available',
    currentLocation: { latitude: 28.6139, longitude: 77.2090 }
  },
  {
    id: '2',
    firstName: 'Priya',
    lastName: 'Patel',
    currentStatus: 'busy',
    currentLocation: { latitude: 19.0760, longitude: 72.8777 }
  },
  {
    id: '3',
    firstName: 'Rahul',
    lastName: 'Verma',
    currentStatus: 'offline',
    currentLocation: { latitude: 13.0827, longitude: 80.2707 }
  }
];

const mockJobs = [
  {
    id: '1',
    title: 'Site Inspection - Delhi',
    status: 'pending',
    location: { latitude: 28.6139, longitude: 77.2090 }
  },
  {
    id: '2',
    title: 'Equipment Maintenance - Mumbai',
    status: 'in_progress',
    location: { latitude: 19.0760, longitude: 72.8777 }
  },
  {
    id: '3',
    title: 'Safety Audit - Chennai',
    status: 'completed',
    location: { latitude: 13.0827, longitude: 80.2707 }
  }
];

const MapComponent: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleMarkerClick = (item: any, type: 'worker' | 'job') => {
    setSelectedItem({ ...item, type });
  };

  const handleCloseInfo = () => {
    setSelectedItem(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: 'white', 
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Interactive MAPPLS Map
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontWeight: 400,
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              Real-time worker and job location tracking with professional mapping
            </Typography>
          </Box>
        </motion.div>

        <Grid container spacing={3}>
          {/* Main Map */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                overflow: 'hidden',
                height: '600px'
              }}>
                <CardContent sx={{ p: 0, height: '100%' }}>
                  {/* MAPPLS Map Component */}
                  <Box sx={{ height: '100%' }}>
                    <MapplsMap 
                      height="100%"
                      workers={mockWorkers}
                      jobs={mockJobs}
                      onMarkerClick={handleMarkerClick}
                    />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Info Panel */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card sx={{ 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                height: '600px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)'
              }}>
                <CardContent sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <MapIcon sx={{ mr: 1, fontSize: 28, color: 'primary.main' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Map Information
                    </Typography>
                  </Box>

                  <AnimatePresence mode="wait">
                    {selectedItem ? (
                      <motion.div
                        key={selectedItem.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ mb: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: selectedItem.type === 'worker' ? 'primary.main' : 'secondary.main',
                                mr: 2
                              }}
                            >
                              {selectedItem.type === 'worker' ? 'W' : 'J'}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {selectedItem.type === 'worker' 
                                  ? `${selectedItem.firstName} ${selectedItem.lastName}`
                                  : selectedItem.title
                                }
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {selectedItem.type === 'worker' ? 'Worker' : 'Job'}
                              </Typography>
                            </Box>
                            <IconButton 
                              onClick={handleCloseInfo}
                              sx={{ ml: 'auto' }}
                              size="small"
                            >
                              <Close />
                            </IconButton>
                          </Box>

                          {selectedItem.type === 'worker' ? (
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  Status: {selectedItem.currentStatus}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Person sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  ID: {selectedItem.id}
                                </Typography>
                              </Box>
                            </Box>
                          ) : (
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Work sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  Status: {selectedItem.status}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOn sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  Job ID: {selectedItem.id}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                          <MapIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                            No Item Selected
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Click on any marker on the map to view detailed information
                          </Typography>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Map Features */}
                  <Box sx={{ mt: 'auto', pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                      MAPPLS Map Features:
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        ✅ Interactive markers for workers and jobs
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ✅ Real-time location tracking
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ✅ Professional mapping interface
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ✅ Powered by MapmyIndia
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MapComponent;