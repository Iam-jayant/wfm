import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Button,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { 
  Map as MapIcon, 
  Language, 
  LocationOn,
  Public
} from '@mui/icons-material';

interface IframeMapProps {
  height?: string;
  title?: string;
  description?: string;
}

const IframeMap: React.FC<IframeMapProps> = ({ 
  height = '500px',
  title = 'Interactive Map',
  description = 'Choose your preferred mapping service'
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentMap, setCurrentMap] = useState('google');

  // Map configurations
  const mapConfigs = {
    google: {
      name: 'Google Maps',
      icon: <LocationOn />,
      src: 'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15057.534307180755!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1234567890',
      description: 'Professional Google Maps with street view and satellite options'
    },
    openstreetmap: {
      name: 'OpenStreetMap',
      icon: <Public />,
      src: 'https://www.openstreetmap.org/export/embed.html?bbox=77.1,28.5,77.3,28.7&layer=mapnik&marker=28.6139,77.2090',
      description: 'Free, open-source mapping with community-driven data'
    },
    bing: {
      name: 'Bing Maps',
      icon: <MapIcon />,
      src: 'https://www.bing.com/maps/embed?h=400&w=500&cp=28.6139~77.2090&lvl=10&typ=d&sty=r&src=SHELL&FORM=MBEDV8',
      description: 'Microsoft Bing Maps with aerial imagery and 3D views'
    },
    mapbox: {
      name: 'Mapbox',
      icon: <Language />,
      src: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.2090,28.6139,10,0/600x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
      description: 'Customizable vector maps with beautiful styling'
    }
  };

  // Predefined locations for quick navigation
  const locations = [
    { name: 'New Delhi', coords: '77.2090,28.6139', zoom: 10 },
    { name: 'Mumbai', coords: '72.8777,19.0760', zoom: 10 },
    { name: 'Chennai', coords: '80.2707,13.0827', zoom: 10 },
    { name: 'Kolkata', coords: '88.3639,22.5726', zoom: 10 },
    { name: 'Hyderabad', coords: '78.4867,17.3850', zoom: 10 }
  ];

  const getMapUrl = (mapType: string, coords?: string, zoom?: number) => {
    const [lng, lat] = (coords || '77.2090,28.6139').split(',');
    const mapZoom = zoom || 10;

    switch (mapType) {
      case 'google':
        return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d${mapZoom * 1000}!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1234567890`;
      case 'openstreetmap':
        return `https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lng) - 0.1},${parseFloat(lat) - 0.1},${parseFloat(lng) + 0.1},${parseFloat(lat) + 0.1}&layer=mapnik&marker=${lat},${lng}`;
      case 'bing':
        return `https://www.bing.com/maps/embed?h=400&w=500&cp=${lat}~${lng}&lvl=${mapZoom}&typ=d&sty=r&src=SHELL&FORM=MBEDV8`;
      case 'mapbox':
        return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},${mapZoom},0/600x400?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;
      default:
        return mapConfigs.google.src;
    }
  };

  const handleLocationChange = (location: typeof locations[0]) => {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = getMapUrl(currentMap, location.coords, location.zoom);
    }
  };

  const handleMapChange = (mapType: string) => {
    setCurrentMap(mapType);
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.src = getMapUrl(mapType);
    }
  };

  return (
    <Box sx={{ height }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </Box>

      {/* Map Selection Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { 
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 600
            }
          }}
        >
          <Tab 
            icon={<MapIcon />} 
            label="Map View" 
            iconPosition="start"
          />
          <Tab 
            icon={<Language />} 
            label="Settings" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Box>
          {/* Map Service Selection */}
          <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              Choose Map Service:
            </Typography>
            <Grid container spacing={1}>
              {Object.entries(mapConfigs).map(([key, config]) => (
                <Grid item key={key}>
                  <Button
                    variant={currentMap === key ? 'contained' : 'outlined'}
                    size="small"
                    startIcon={config.icon}
                    onClick={() => handleMapChange(key)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 120
                    }}
                  >
                    {config.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Map Container */}
          <Box
            sx={{
              height: 'calc(100% - 200px)',
              borderRadius: 2,
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <iframe
              src={getMapUrl(currentMap)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${mapConfigs[currentMap as keyof typeof mapConfigs].name} Map`}
            />
          </Box>

          {/* Quick Location Navigation */}
          <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 2 }}>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
              Quick Navigation:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {locations.map((location) => (
                <Button
                  key={location.name}
                  size="small"
                  variant="outlined"
                  onClick={() => handleLocationChange(location)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  {location.name}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Grid container spacing={3}>
            {/* Map Service Details */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: 'fit-content' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {mapConfigs[currentMap as keyof typeof mapConfigs].icon}
                    {mapConfigs[currentMap as keyof typeof mapConfigs].name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {mapConfigs[currentMap as keyof typeof mapConfigs].description}
                  </Typography>
                  
                  <Box sx={{ p: 2, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600 }}>
                      Current Configuration:
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Service: {mapConfigs[currentMap as keyof typeof mapConfigs].name}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Default Location: New Delhi (28.6139°N, 77.2090°E)
                    </Typography>
                    <Typography variant="caption" display="block">
                      Default Zoom: 10
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Map Features */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: 'fit-content' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Map Features
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      ✅ Interactive navigation
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      ✅ Multiple map services
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      ✅ Quick location switching
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      ✅ Responsive design
                    </Typography>
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      ✅ No API key required
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1, border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                    <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                      💡 Tip: This iframe-based solution works immediately without any API configuration!
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default IframeMap;
