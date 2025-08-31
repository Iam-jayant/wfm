import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const MODEL_INFO_PATH = '../../../ml model/model_info.json';
const DATASET_PATH = '../../../ml model/workforce_demand_dataset.csv';
const PERFORMANCE_PATH = '../../../ml model/model_performance.csv';
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

  // Mock prediction function
  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
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
  };
  const [modelInfo, setModelInfo] = useState<any>(null);
  const [dataset, setDataset] = useState<string[][]>([]);
  const [performance, setPerformance] = useState<string[][]>([]);
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
    // Fetch performance
    fetch(PERFORMANCE_PATH)
      .then(res => res.text())
      .then(text => setPerformance(text.split('\n').map(row => row.split(','))))
      .catch(() => setPerformance([]));
    // Fetch code
    fetch(CODE_PATH)
      .then(res => res.text())
      .then(setCode)
      .catch(() => setCode(''));
  }, []);

  return (
    <Container maxWidth="lg">
      <Box>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Workforce Forecasting
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ML model, dataset, and code for workforce demand forecasting
          </Typography>
        </Box>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Model Info</Typography>
          <pre>{modelInfo ? JSON.stringify(modelInfo, null, 2) : 'No model info found.'}</pre>
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Predict Workforce Demand</Typography>
          <form onSubmit={handlePredict} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            <label>
              City:
              <select value={city} onChange={e => setCity(e.target.value)} style={{ marginLeft: 8 }}>
                <option>New Delhi</option>
                <option>Mumbai</option>
                <option>Chennai</option>
                <option>Kolkata</option>
                <option>Bangalore</option>
              </select>
            </label>
            <label>
              Date:
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ marginLeft: 8 }} />
            </label>
            <label>
              Business Count:
              <input type="number" value={businessCount} onChange={e => setBusinessCount(Number(e.target.value))} style={{ marginLeft: 8 }} />
            </label>
            <label>
              Population Density:
              <input type="number" value={populationDensity} onChange={e => setPopulationDensity(Number(e.target.value))} style={{ marginLeft: 8 }} />
            </label>
            <label>
              Avg Income:
              <input type="number" value={avgIncome} onChange={e => setAvgIncome(Number(e.target.value))} style={{ marginLeft: 8 }} />
            </label>
            <label>
              Employment Rate:
              <input type="number" step="0.01" value={employmentRate} onChange={e => setEmploymentRate(Number(e.target.value))} style={{ marginLeft: 8 }} />
            </label>
            <label>
              Traffic Density:
              <input type="number" step="0.01" value={trafficDensity} onChange={e => setTrafficDensity(Number(e.target.value))} style={{ marginLeft: 8 }} />
            </label>
            <label>
              Avg Speed:
              <input type="number" value={avgSpeed} onChange={e => setAvgSpeed(Number(e.target.value))} style={{ marginLeft: 8 }} />
            </label>
            <button type="submit" style={{ padding: '8px 16px' }}>Predict</button>
          </form>
          {predictions.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1">Predicted Workforce Demand (next 6 months):</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Month</TableCell>
                      <TableCell>Predicted Workers</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {predictions.map((val, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{new Date(date).toLocaleString('default', { month: 'long' }) + ' +' + (idx+1) + 'm'}</TableCell>
                        <TableCell>{val}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Dataset Preview</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {dataset[0]?.map((col, idx) => <TableCell key={idx}>{col}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {dataset.slice(1, 6).map((row, idx) => (
                  <TableRow key={idx}>
                    {row.map((cell, cidx) => <TableCell key={cidx}>{cell}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Model Performance</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {performance[0]?.map((col, idx) => <TableCell key={idx}>{col}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {performance.slice(1, 6).map((row, idx) => (
                  <TableRow key={idx}>
                    {row.map((cell, cidx) => <TableCell key={cidx}>{cell}</TableCell>)}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Model Code</Typography>
          <pre style={{ maxHeight: 400, overflow: 'auto', background: '#f5f5f5', padding: 12 }}>{code || 'No code found.'}</pre>
        </Paper>
      </Box>
    </Container>
  );
}

export default WorkforceForecasting;
