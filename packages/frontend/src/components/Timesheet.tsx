import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// Types for mock data
interface TimesheetEntry {
  id: string;
  jobSiteId: string;
  checkInTime: Date;
  checkOutTime: Date;
  totalHours: number;
  status: string;
}
export interface TimesheetData {
  totalHours: number;
  totalDistance: number;

  totalExpenses: number;
  entries: TimesheetEntry[];
}

export const mockTimesheets: Record<string, TimesheetData> = {
  '1': {
    totalHours: 8.5,
    totalDistance: 32.4,
    totalExpenses: 450,
    entries: [
      { id: 'E1', jobSiteId: 'Indore Airport', checkInTime: new Date(), checkOutTime: new Date(), totalHours: 4, status: 'completed' },
      { id: 'E2', jobSiteId: 'IIT Indore', checkInTime: new Date(), checkOutTime: new Date(), totalHours: 4.5, status: 'completed' },
    ],
  },
  '2': {
    totalHours: 7.2,
    totalDistance: 28.1,
    totalExpenses: 320,
    entries: [
      { id: 'E3', jobSiteId: 'Baank', checkInTime: new Date(), checkOutTime: new Date(), totalHours: 3.2, status: 'completed' },
      { id: 'E4', jobSiteId: 'Bhicholi Hapsi', checkInTime: new Date(), checkOutTime: new Date(), totalHours: 4, status: 'completed' },
    ],
  },
  // ...add more for other workers
};

const Timesheet = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Timesheets & Expenses
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track worker hours and manage expense reimbursements
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {/* Controls, Daily Summary Cards, Timesheet Entries, Expense Entries, Weekly Summary */}
        {/* ...existing JSX code for all sections... */}
      </Grid>
    </Container>
  );
};

export default Timesheet;