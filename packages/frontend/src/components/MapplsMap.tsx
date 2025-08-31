import React, { useState, useEffect, useRef } from 'react';
import { 
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { ZoomIn, ZoomOut, MyLocation, Refresh } from '@mui/icons-material';

interface MapplsMapProps {
  height?: string;
  workers?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    currentStatus: string;
    currentLocation?: { latitude: number; longitude: number };
  }>;
  jobs?: Array<{
    id: string;
    title: string;
    status: string;
    location: { latitude: number; longitude: number };
  }>;
  onMarkerClick?: (item: any, type: 'worker' | 'job') => void;
}

const MapplsMap: React.FC<MapplsMapProps> = ({ 
  height = '500px',
  workers = [],
  jobs = [],
  onMarkerClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // MAPPLS API configuration
  const MAPPLS_API_KEY = import.meta.env.VITE_MAPPLS_API_KEY;

  // Get marker color based on status
  const getMarkerColor = (status: string, type: 'worker' | 'job') => {
    if (type === 'worker') {
      switch (status) {
        case 'available': return '#4caf50';
        case 'busy': return '#ff9800';
        case 'offline': return '#f44336';
        default: return '#2196f3';
      }
    } else {
      switch (status) {
        case 'pending': return '#2196f3';
        case 'in_progress': return '#9c27b0';
        case 'completed': return '#4caf50';
        default: return '#757575';
      }
    }
  };

  // Initialize MAPPLS map
  const initializeMap = async () => {
    if (!mapRef.current || !MAPPLS_API_KEY) {
      setMapError('MAPPLS API key not found. Please check your environment configuration.');
      setLoading(false);
      return;
    }

    try {
      // Load MAPPLS SDK if not already loaded
      if (!(window as any).Mappls) {
        const script = document.createElement('script');
        script.src = `https://apis.mapmyindia.com/map_v3/1.js?apikey=${MAPPLS_API_KEY}`;
        script.async = true;
        script.onload = () => createMap();
        script.onerror = () => {
          setMapError('Failed to load MAPPLS SDK');
          setLoading(false);
        };
        document.head.appendChild(script);
      } else {
        createMap();
      }
    } catch (error) {
      console.error('Error initializing MAPPLS map:', error);
      setMapError('Failed to initialize MAPPLS map');
      setLoading(false);
    }
  };

  const createMap = () => {
    try {
      const Mappls = (window as any).Mappls;
      
      // Create map instance
      const map = new Mappls.Map(mapRef.current, {
        center: [28.6139, 77.2090], // New Delhi
        zoom: 12,
        mapStyle: Mappls.MAP_STYLES.STREET
      });

      mapInstanceRef.current = map;

      // Add markers for workers
      workers.forEach((worker) => {
        if (worker.currentLocation) {
          const marker = new Mappls.Marker({
            position: [worker.currentLocation.latitude, worker.currentLocation.longitude],
            map: map,
            title: `${worker.firstName} ${worker.lastName}`,
            icon: {
              url: `data:image/svg+xml;base64,${btoa(`
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="${getMarkerColor(worker.currentStatus, 'worker')}" stroke="white" stroke-width="2"/>
                  <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">W</text>
                </svg>
              `)}`,
              scaledSize: new Mappls.Size(24, 24)
            }
          });

          marker.addListener('click', () => {
            if (onMarkerClick) {
              onMarkerClick(worker, 'worker');
            }
          });

          markersRef.current.push(marker);
        }
      });

      // Add markers for jobs
      jobs.forEach((job) => {
        const marker = new Mappls.Marker({
          position: [job.location.latitude, job.location.longitude],
          map: map,
          title: job.title,
          icon: {
            url: `data:image/svg+xml;base64,${btoa(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="${getMarkerColor(job.status, 'job')}" stroke="white" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">J</text>
              </svg>
            `)}`,
            scaledSize: new Mappls.Size(24, 24)
          }
        });

        marker.addListener('click', () => {
          if (onMarkerClick) {
            onMarkerClick(job, 'job');
          }
        });

        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (markersRef.current.length > 0) {
        const bounds = new Mappls.LatLngBounds();
        markersRef.current.forEach(marker => {
          bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error creating MAPPLS map:', error);
      setMapError('Failed to create MAPPLS map');
      setLoading(false);
    }
  };

  // Handle zoom controls
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    }
  };

  // Center on current location
  const handleCenterLocation = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter([28.6139, 77.2090]);
      mapInstanceRef.current.setZoom(12);
    }
  };

  // Refresh map
  const handleRefresh = () => {
    setLoading(true);
         setMapError(null);
    
    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    
    // Reinitialize map
    setTimeout(() => {
      initializeMap();
    }, 100);
  };

  useEffect(() => {
    initializeMap();
  }, []);

  // Show error state
  if (mapError) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              <Refresh />
            </Button>
          }
        >
          {mapError}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height, position: 'relative' }}>
      {/* MAPPLS Map Container */}
      <Box
        sx={{
          height: '100%',
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}
      >
        {/* Map Div */}
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px'
          }}
        />

        {/* Loading overlay */}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.3)',
              borderRadius: '8px',
              zIndex: 10
            }}
          >
            <CircularProgress size={40} sx={{ color: 'white' }} />
          </Box>
        )}

        {/* Map Controls */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}
        >
          {/* Zoom Controls */}
          <Button
            size="small"
            variant="contained"
            onClick={handleZoomIn}
            sx={{
              minWidth: 'auto',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: 'text.primary',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            <ZoomIn />
          </Button>
          
          <Button
            size="small"
            variant="contained"
            onClick={handleZoomOut}
            sx={{
              minWidth: 'auto',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: 'text.primary',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            <ZoomOut />
          </Button>

          {/* Center Location */}
          <Button
            size="small"
            variant="contained"
            onClick={handleCenterLocation}
            sx={{
              minWidth: 'auto',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: 'text.primary',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            <MyLocation />
          </Button>

          {/* Refresh */}
          <Button
            size="small"
            variant="contained"
            onClick={handleRefresh}
            sx={{
              minWidth: 'auto',
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: 'text.primary',
              '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
            }}
          >
            <Refresh />
          </Button>
        </Box>

        {/* Current Location Info */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 1000,
            backgroundColor: 'rgba(255,255,255,0.9)',
            padding: '8px 12px',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary' }}>
            New Delhi
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
            Workers: {workers.length} • Jobs: {jobs.length}
          </Typography>
        </Box>

        {/* Map Attribution */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            padding: '4px 8px',
            borderRadius: 1,
            fontSize: '11px',
            color: 'text.secondary',
            zIndex: 1000,
            opacity: 0.8,
            '&:hover': {
              opacity: 1
            }
          }}
        >
          © MapmyIndia
        </Box>
      </Box>
    </Box>
  );
};

export default MapplsMap;
