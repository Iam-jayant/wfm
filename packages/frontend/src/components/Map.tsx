import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Chip, CircularProgress, Card, CardContent } from '@mui/material';
import { Worker, Job } from '@workforce-navigator/shared';
import { workerService, jobService } from '../services/api';

// MAPPLS configuration
const MAPPLS_API_KEY = import.meta.env.VITE_MAPPLS_API_KEY;

// Declare MAPPLS global types
declare global {
  interface Window {
    mappls: any;
    initializeMapCallback?: () => void;
  }
}

// Custom marker colors for different statuses
const getMarkerColor = (status: string) => {
  switch (status) {
    case 'available': return '#4caf50';
    case 'busy': return '#ff9800';
    case 'offline': return '#f44336';
    case 'pending': return '#2196f3';
    case 'assigned': return '#ff9800';
    case 'in_progress': return '#9c27b0';
    case 'completed': return '#4caf50';
    default: return '#757575';
  }
};

interface MapComponentProps {
  height?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ height = '500px' }) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ type: 'worker' | 'job'; data: Worker | Job } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const fetchData = async () => {
    try {
      // Try to fetch real data, but fall back to mock data if it fails
      const [workersResponse, jobsResponse] = await Promise.all([
        workerService.getWorkers().catch(() => ({ data: [] })),
        jobService.getJobs().catch(() => ({ data: [] })),
      ]);
      
      // If no real data, use mock data for demonstration
      if (workersResponse.data.length === 0 && jobsResponse.data.length === 0) {
        console.log('Using mock data for map demonstration');
        setWorkers(getMockWorkers());
        setJobs(getMockJobs());
      } else {
        setWorkers(workersResponse.data);
        setJobs(jobsResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch map data, using mock data:', error);
      setWorkers(getMockWorkers());
      setJobs(getMockJobs());
    } finally {
      setLoading(false);
    }
  };

  // Mock data for demonstration
  const getMockWorkers = (): Worker[] => [
    {
      id: '1',
      employeeId: 'EMP001',
      firstName: 'Amit',
      lastName: 'Sharma',
      email: 'amit.sharma@company.com',
      phone: '+91-9876543210',
      role: 'field_worker',
      teamId: 'TEAM-A',
      organizationId: 'ORG-1',
      createdAt: new Date(),
      currentStatus: 'available',
      currentLocation: {
        latitude: 28.6139,
        longitude: 77.2090,
      },
    },
    {
      id: '2',
      employeeId: 'EMP002',
      firstName: 'Priya',
      lastName: 'Patel',
      email: 'priya.patel@company.com',
      phone: '+91-9876543211',
      role: 'field_worker',
      teamId: 'TEAM-B',
      organizationId: 'ORG-1',
      createdAt: new Date(),
      currentStatus: 'busy',
      currentLocation: {
        latitude: 19.0760,
        longitude: 72.8777,
      },
    },
    {
      id: '3',
      employeeId: 'EMP003',
      firstName: 'Rahul',
      lastName: 'Verma',
      email: 'rahul.verma@company.com',
      phone: '+91-9876543212',
      role: 'field_worker',
      teamId: 'TEAM-A',
      organizationId: 'ORG-1',
      createdAt: new Date(),
      currentStatus: 'offline',
      currentLocation: {
        latitude: 13.0827,
        longitude: 80.2707,
      },
    },
    {
      id: '4',
      employeeId: 'EMP004',
      firstName: 'Sneha',
      lastName: 'Singh',
      email: 'sneha.singh@company.com',
      phone: '+91-9876543213',
      role: 'field_worker',
      teamId: 'TEAM-B',
      organizationId: 'ORG-1',
      createdAt: new Date(),
      currentStatus: 'available',
      currentLocation: {
        latitude: 22.5726,
        longitude: 88.3639,
      },
    },
    {
      id: '5',
      employeeId: 'EMP005',
      firstName: 'Vikram',
      lastName: 'Reddy',
      email: 'vikram.reddy@company.com',
      phone: '+91-9876543214',
      role: 'field_worker',
      teamId: 'TEAM-A',
      organizationId: 'ORG-1',
      createdAt: new Date(),
      currentStatus: 'busy',
      currentLocation: {
        latitude: 17.3850,
        longitude: 78.4867,
      },
    },
  ];

  const getMockJobs = (): Job[] => [
    {
      id: '1',
      title: 'AC Repair - Office Building',
      description: 'Fix air conditioning unit on 3rd floor',
      location: {
        latitude: 22.7198,
        longitude: 75.8582,
      },
      status: 'pending',
      priority: 'high',
      estimatedDuration: 2,
      assignedWorkerId: undefined,
      createdAt: new Date(),
    },
    {
      id: '2',
      title: 'Electrical Maintenance',
      description: 'Routine electrical system check',
      location: {
        latitude: 28.6339,
        longitude: 77.2199,
      },
      status: 'assigned',
      priority: 'medium',
      estimatedDuration: 3,
      assignedWorkerId: '1',
      createdAt: new Date(),
    },
    {
      id: '3',
      title: 'Plumbing Emergency',
      description: 'Water leak in basement',
      location: {
        latitude: 28.5989,
        longitude: 77.2295,
      },
      status: 'in_progress',
      priority: 'urgent',
      estimatedDuration: 1,
      assignedWorkerId: '2',
      createdAt: new Date(),
    },
  ];

  // Initialize MAPPLS map
  const initializeMap = () => {
    console.log('initializeMap called', {
      mapRef: !!mapRef.current,
      mappls: !!window.mappls,
      mapInstance: !!mapInstanceRef.current
    });
    
    if (!mapRef.current) {
      console.error('Map container not found');
      return;
    }
    
    if (!window.mappls) {
      console.error('MAPPLS SDK not loaded');
      return;
    }
    
    if (mapInstanceRef.current) {
      console.log('Map already initialized');
      return;
    }

    try {
      console.log('Creating MAPPLS map...');
      const map = new window.mappls.Map(mapRef.current, {
        center: [22.7196, 75.8577], // Indore coordinates
        zoom: 4,
        search: false,
        traffic: false,
        geolocation: false,
        clickableIcons: false,
        backgroundColor: 'white',
      });

      mapInstanceRef.current = map;
      console.log('Map instance created, setting mapLoaded to true');
      setMapLoaded(true);

      // Fit India bounds on load
      map.addListener('load', () => {
        console.log('MAPPLS map loaded successfully');
        const indiaBounds = new window.mappls.LatLngBounds();
        indiaBounds.extend([6.5546079, 68.1113787]); // Southwest
        indiaBounds.extend([35.6745457, 97.395561]); // Northeast
        map.fitBounds(indiaBounds, { padding: 50 });
      });

    } catch (error) {
      console.error('Error initializing MAPPLS map:', error);
      setLoading(false);
    }
  };

  // Load MAPPLS SDK
  useEffect(() => {
    if (!MAPPLS_API_KEY) {
      console.error('MAPPLS API key not found. Please check your .env file.');
      setLoading(false);
      return;
    }

    console.log('Loading MAPPLS SDK with API key:', MAPPLS_API_KEY.substring(0, 8) + '...');

    // Check if MAPPLS is already loaded
    if (window.mappls) {
      console.log('MAPPLS SDK already loaded');
      initializeMap();
      return;
    }

    // Set up global callback before loading script
    window.initializeMapCallback = () => {
      console.log('MAPPLS SDK loaded via callback');
      initializeMap();
    };

    // Load MAPPLS SDK
    const script = document.createElement('script');
    script.src = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0&callback=initializeMapCallback`;
    script.async = true;

    script.onload = () => {
      console.log('MAPPLS script loaded successfully');
      // Fallback if callback doesn't work
      setTimeout(() => {
        if (window.mappls && !mapInstanceRef.current) {
          console.log('Initializing map via fallback');
          initializeMap();
        }
      }, 1000);
    };

    script.onerror = (error) => {
      console.error('Failed to load MAPPLS SDK:', error);
      setLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.initializeMapCallback) {
        delete window.initializeMapCallback;
      }
    };
  }, []);

  // Add markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove();
      }
    });
    markersRef.current = [];

    const allMarkers: any[] = [];
    const markerPositions: [number, number][] = [];

    // Add worker markers
    workers.forEach(worker => {
      if (!worker.currentLocation) return;
      markerPositions.push([worker.currentLocation.latitude, worker.currentLocation.longitude]);
      try {
        const marker = new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: [worker.currentLocation.latitude, worker.currentLocation.longitude],
          title: `${worker.firstName} ${worker.lastName}`,
          icon: {
            url: `data:image/svg+xml;base64,${btoa(`
              <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="12" fill="${getMarkerColor(worker.currentStatus)}" stroke="#fff" stroke-width="3"/>
                <circle cx="15" cy="15" r="6" fill="#fff"/>
                <text x="15" y="19" text-anchor="middle" fill="${getMarkerColor(worker.currentStatus)}" font-size="10" font-weight="bold">W</text>
              </svg>
            `)}`,
            size: [30, 30],
            anchor: [15, 15]
          }
        });

        marker.addListener('click', () => {
          setSelectedItem({ type: 'worker', data: worker });
        });

        allMarkers.push(marker);
      } catch (error) {
        console.error('Error adding worker marker:', error);
      }
    });

    // Add job markers
    jobs.forEach(job => {
      try {
        const marker = new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: [job.location.latitude, job.location.longitude],
          title: job.title,
          icon: {
            url: `data:image/svg+xml;base64,${btoa(`
              <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="24" height="24" rx="3" fill="${getMarkerColor(job.status)}" stroke="#fff" stroke-width="3"/>
                <rect x="9" y="9" width="12" height="12" rx="1" fill="#fff"/>
                <text x="15" y="19" text-anchor="middle" fill="${getMarkerColor(job.status)}" font-size="10" font-weight="bold">J</text>
              </svg>
            `)}`,
            size: [30, 30],
            anchor: [15, 15]
          }
        });

        marker.addListener('click', () => {
          setSelectedItem({ type: 'job', data: job });
        });

        allMarkers.push(marker);
      } catch (error) {
        console.error('Error adding job marker:', error);
      }
    });

    markersRef.current = allMarkers;

    // Fit bounds to show all markers
    if (allMarkers.length > 0) {
      try {
        const bounds = new window.mappls.LatLngBounds();
        workers.forEach(worker => {
          if (worker.currentLocation) {
            bounds.extend([worker.currentLocation.latitude, worker.currentLocation.longitude]);
          }
        });
        jobs.forEach(job => {
          markerPositions.push([job.location.latitude, job.location.longitude]);
          bounds.extend([job.location.latitude, job.location.longitude]);
        });

        // Only fit bounds if there are at least two distinct positions
        const uniquePositions = Array.from(new Set(markerPositions.map(pos => pos.join(','))));
        if (uniquePositions.length > 1 && !bounds.isEmpty()) {
          mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
        } else {
          // Always center on Indore if not enough markers
          mapInstanceRef.current.setCenter([22.7196, 75.8577]);
          mapInstanceRef.current.setZoom(10);
        }
      } catch (error) {
        console.error('Error fitting bounds:', error);
      }
    }
  }, [workers, jobs, mapLoaded]);

  useEffect(() => {
    fetchData();
    
    // Set up polling every 5 minutes for real-time updates (reduced frequency to avoid connection issues)
    const interval = setInterval(() => {
      // Only fetch if component is still mounted and visible
      if (document.visibilityState === 'visible') {
        fetchData();
      }
    }, 300000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'busy':
        return 'warning';
      case 'offline':
        return 'error';
      case 'pending':
        return 'info';
      case 'assigned':
        return 'warning';
      case 'in_progress':
        return 'secondary';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        height={height}
        bgcolor="grey.100"
        borderRadius={1}
        p={2}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
          Loading MAPPLS map...
        </Typography>
        <Typography variant="caption" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
          API Key: {MAPPLS_API_KEY ? `${MAPPLS_API_KEY.substring(0, 8)}...` : 'Not found'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box position="relative" height={height} borderRadius={1} overflow="hidden">
      {/* MAPPLS Map Container */}
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '4px',
          backgroundColor: '#f5f5f5',
        }}
      />
      
      {/* Fallback content when map is not loaded */}
      {!mapLoaded && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bgcolor="rgba(245, 245, 245, 0.9)"
          zIndex={999}
        >
          <Typography variant="h6" gutterBottom>
            Map Loading...
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
            Initializing MAPPLS Map
          </Typography>
          <CircularProgress size={24} />
          
          {/* Show data summary while map loads */}
          {(workers.length > 0 || jobs.length > 0) && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {workers.length} Workers • {jobs.length} Jobs
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Info Panel for Selected Item */}
      {selectedItem && (
        <Card
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            minWidth: 300,
            maxWidth: 400,
            zIndex: 1000,
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Typography variant="h6" component="div">
                {selectedItem.type === 'worker' 
                  ? `${(selectedItem.data as Worker).firstName} ${(selectedItem.data as Worker).lastName}`
                  : (selectedItem.data as Job).title
                }
              </Typography>
              <Box
                component="button"
                onClick={() => setSelectedItem(null)}
                sx={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: 'text.secondary',
                  '&:hover': { color: 'text.primary' }
                }}
              >
                ×
              </Box>
            </Box>

            {selectedItem.type === 'worker' ? (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {(selectedItem.data as Worker).email}
                </Typography>
                <Box mb={2}>
                  <Chip
                    label={(selectedItem.data as Worker).currentStatus}
                    color={getStatusColor((selectedItem.data as Worker).currentStatus) as any}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" gutterBottom>
                  <strong>Employee ID:</strong> {(selectedItem.data as Worker).employeeId}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Team:</strong> {(selectedItem.data as Worker).teamId}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Phone:</strong> {(selectedItem.data as Worker).phone}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Role:</strong> {(selectedItem.data as Worker).role}
                </Typography>
                {(selectedItem.data as Worker).currentLocation && (
                  <Typography variant="caption" color="text.secondary">
                    Location: {(selectedItem.data as Worker).currentLocation!.latitude.toFixed(4)}, {(selectedItem.data as Worker).currentLocation!.longitude.toFixed(4)}
                  </Typography>
                )}
              </Box>
            ) : (
              <Box>
                <Typography variant="body2" gutterBottom>
                  {(selectedItem.data as Job).description}
                </Typography>
                <Box mb={2}>
                  <Chip
                    label={(selectedItem.data as Job).status}
                    color={getStatusColor((selectedItem.data as Job).status) as any}
                    size="small"
                  />
                  <Chip
                    label={(selectedItem.data as Job).priority}
                    color={(selectedItem.data as Job).priority === 'urgent' ? 'error' : (selectedItem.data as Job).priority === 'high' ? 'warning' : 'default'}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Box>
                {(selectedItem.data as Job).assignedWorkerId && (
                  <Typography variant="body2" gutterBottom>
                    <strong>Assigned to:</strong> {workers.find(w => w.id === (selectedItem.data as Job).assignedWorkerId)?.firstName} {workers.find(w => w.id === (selectedItem.data as Job).assignedWorkerId)?.lastName}
                  </Typography>
                )}
                <Typography variant="body2" gutterBottom>
                  <strong>Duration:</strong> {(selectedItem.data as Job).estimatedDuration} hours
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Location: {(selectedItem.data as Job).location.latitude.toFixed(4)}, {(selectedItem.data as Job).location.longitude.toFixed(4)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Map Attribution */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '4px 8px',
          borderRadius: 1,
          fontSize: '12px',
          color: 'text.secondary',
          zIndex: 1000,
        }}
      >
        © MapmyIndia
      </Box>
    </Box>
  );
};

export default MapComponent;