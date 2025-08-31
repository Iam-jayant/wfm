import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Analytics, 
  Timeline, 
  Assessment,
  Code,
  DataUsage,
  ShowChart,
  Calculate,
  Science
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer
} from 'recharts';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

const MODEL_INFO_PATH = '../../../ml model/model_info.json';
const DATASET_PATH = '../../../ml model/workforce_demand_dataset.csv';
const CODE_PATH = '../../../ml model/workforce_forecasting_implementation.py';

const WorkforceForecasting: React.FC = () => {
  // Mock input state
  const [city, setCity] = useState('New Delhi');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [businessCount, setBusinessCount] = useState(450);
  const [populationDensity, setPopulationDensity] = useState(11320);
  const [avgIncome, setAvgIncome] = useState(45000);
  const [employmentRate, setEmploymentRate] = useState(0.68);
  const [trafficDensity, setTrafficDensity] = useState(0.7);
  const [avgSpeed, setAvgSpeed] = useState(20);
  const [predictions, setPredictions] = useState<number[]>([]);
  const [isPredicting, setIsPredicting] = useState(false);

  // Mock prediction function
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPredicting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple mock: base + businessCount/100 + populationDensity/10000 + avgIncome/10000 + employmentRate*10 - trafficDensity*5 + avgSpeed/10
    const base = city === 'New Delhi' ? 25 : city === 'Mumbai' ? 30 : city === 'Chennai' ? 20 : city === 'Kolkata' ? 18 : 22;
    const factors = businessCount/100 + populationDensity/10000 + avgIncome/10000 + employmentRate*10 - trafficDensity*5 + avgSpeed/10;
    const today = new Date(date);
    const results = Array.from({length: 6}, (_, i) => {
      // Simulate seasonal and trend effects
      const month = (today.getMonth() + i) % 12 + 1;
      const seasonal = month === 12 || month === 1 ? 1.3 : month >= 4 && month <= 6 ? 1.1 : 0.8;
      const trend = 1 + i*0.05;
      return Math.max(5, Math.round(base * seasonal * trend + factors));
    });
    setPredictions(results);
    setIsPredicting(false);
  };

  const [modelInfo, setModelInfo] = useState<any>(null);
  const [dataset, setDataset] = useState<string[][]>([]);
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    // Fetch model info
    fetch(MODEL_INFO_PATH)
      .then(res => res.json())
      .then(setModelInfo)
      .catch(() => setModelInfo(null));
    // Fetch dataset
    fetch(DATASET_PATH)
      .then(res => res.text())
      .then(text => setDataset(text.split('\n').map(row => row.split(','))))
      .catch(() => setDataset([]));

    // Fetch code
    fetch(CODE_PATH)
      .then(res => res.text())
      .then(setCode)
      .catch(() => setCode(''));
  }, []);

  // Chart data for predictions
  const predictionChartData = predictions.map((value, index) => ({
    month: `Month ${index + 1}`,
    workers: value,
    projected: Math.round(value * 1.1)
  }));

  // Mock performance data
  const performanceData = [
    { metric: 'Accuracy', value: 94.2, target: 90, color: '#4caf50' },
    { metric: 'Precision', value: 91.8, target: 88, color: '#2196f3' },
    { metric: 'Recall', value: 89.5, target: 85, color: '#ff9800' },
    { metric: 'F1-Score', value: 90.6, target: 87, color: '#9c27b0' },
  ];

  const cities = ['New Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Bangalore'];

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
                <Analytics sx={{ fontSize: 28 }} />
              </Avatar>
      <Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Workforce Forecasting
          </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                  ML-powered workforce demand prediction and analytics
          </Typography>
        </Box>
            </Box>
          </Box>
        </MotionBox>

        {/* Prediction Form */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            mb: 4
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Calculate color="primary" />
              Predict Workforce Demand
            </Typography>
            <Box component="form" onSubmit={handlePredict}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>City</InputLabel>
                    <Select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      label="City"
                    >
                      {cities.map(cityName => (
                        <MenuItem key={cityName} value={cityName}>{cityName}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Business Count"
                    type="number"
                    value={businessCount}
                    onChange={(e) => setBusinessCount(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Population Density"
                    type="number"
                    value={populationDensity}
                    onChange={(e) => setPopulationDensity(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Average Income"
                    type="number"
                    value={avgIncome}
                    onChange={(e) => setAvgIncome(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Employment Rate"
                    type="number"
                    value={employmentRate}
                    onChange={(e) => setEmploymentRate(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Traffic Density"
                    type="number"
                    value={trafficDensity}
                    onChange={(e) => setTrafficDensity(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Average Speed"
                    type="number"
                    value={avgSpeed}
                    onChange={(e) => setAvgSpeed(Number(e.target.value))}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isPredicting}
                  startIcon={<Science />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isPredicting ? 'Analyzing...' : 'Generate Prediction'}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </MotionCard>

        {/* Predictions Display */}
          {predictions.length > 0 && (
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            sx={{ mb: 4 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  height: 'fit-content'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShowChart color="primary" />
                      Workforce Demand Forecast
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={predictionChartData}>
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
                          dataKey="workers" 
                          stroke="#667eea" 
                          strokeWidth={3}
                          dot={{ fill: '#667eea', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#667eea', strokeWidth: 2 }}
                          name="Predicted Workers"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="projected" 
                          stroke="#f093fb" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: '#f093fb', strokeWidth: 2, r: 4 }}
                          name="Projected Growth"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  height: 'fit-content'
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                      Monthly Predictions
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {predictions.map((value, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                            border: '1px solid #dee2e6'
                          }}
                        >
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Month {index + 1}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                            {value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            workers needed
                          </Typography>
                        </Box>
                      ))}
            </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </MotionBox>
        )}

        {/* Model Performance */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          sx={{ mb: 4 }}
        >
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Assessment color="primary" />
                Model Performance Metrics
              </Typography>
              <Grid container spacing={3}>
                {performanceData.map((metric, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Box sx={{
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      border: '1px solid #e9ecef',
                      textAlign: 'center'
                    }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: metric.color, mb: 1 }}>
                        {metric.value}%
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>
                        {metric.metric}
                      </Typography>
                      <Box sx={{ mb: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(metric.value / metric.target) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: '#e9ecef',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: metric.color,
                              borderRadius: 4
                            }
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Target: {metric.target}%
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </MotionBox>

        {/* Model Info and Code */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DataUsage color="primary" />
                  Model Information
                </Typography>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  maxHeight: 300,
                  overflow: 'auto'
                }}>
                  <pre style={{ 
                    margin: 0, 
                    fontSize: '0.8rem',
                    color: '#495057',
                    fontFamily: 'monospace'
                  }}>
                    {modelInfo ? JSON.stringify(modelInfo, null, 2) : 'No model info found.'}
                  </pre>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              sx={{
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                height: 'fit-content'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Code color="primary" />
                  Implementation Code
                </Typography>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  maxHeight: 300,
                  overflow: 'auto'
                }}>
                  <pre style={{ 
                    margin: 0, 
                    fontSize: '0.7rem',
                    color: '#495057',
                    fontFamily: 'monospace'
                  }}>
                    {code || 'No code found.'}
                  </pre>
                </Box>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>

        {/* Dataset Preview */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          sx={{ mt: 4 }}
        >
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline color="primary" />
                Dataset Preview
              </Typography>
              <TableContainer sx={{
                borderRadius: 2,
                border: '1px solid #e9ecef',
                maxHeight: 400
              }}>
            <Table size="small">
              <TableHead>
                    <TableRow sx={{ background: '#f8f9fa' }}>
                      {dataset[0]?.map((col, idx) => (
                        <TableCell key={idx} sx={{ fontWeight: 600, color: '#495057' }}>
                          {col}
                        </TableCell>
                      ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataset.slice(1, 6).map((row, idx) => (
                      <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { background: '#f8f9fa' } }}>
                        {row.map((cell, cidx) => (
                          <TableCell key={cidx} sx={{ fontSize: '0.8rem' }}>
                            {cell}
                          </TableCell>
                        ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
            </CardContent>
          </Card>
        </MotionBox>
      </Container>
      </Box>
  );
};

export default WorkforceForecasting;
